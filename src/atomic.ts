import { promises as fs } from 'node:fs';
import { join, dirname, basename } from 'node:path';
import { randomBytes } from 'node:crypto';
import { tmpdir } from 'node:os';

const RETRY_DELAYS = [100, 500, 1000, 2000, 5000];
const LOCK_TIMEOUT = 30000;
const locks = new Map<string, Promise<void>>();
const lockQueue = new Map<string, (() => void)[]>();

export async function withRetry<T>(
  operation: () => Promise<T>,
  context: string,
  maxRetries = RETRY_DELAYS.length
): Promise<T> {
  let lastError: Error | undefined;
  
  for (let i = 0; i <= maxRetries; i++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      
      if (i === maxRetries) break;
      
      const delay = RETRY_DELAYS[Math.min(i, RETRY_DELAYS.length - 1)];
      await new Promise(resolve => setTimeout(resolve, delay));
      
      if (error && typeof error === 'object' && 'code' in error) {
        const nodeError = error as NodeJS.ErrnoException;
        if (nodeError.code === 'ENOENT' || nodeError.code === 'ENOTDIR' || nodeError.code === 'EISDIR') {
          break;
        }
      }
    }
  }
  
  throw new Error(`${context} failed after ${maxRetries} retries: ${lastError?.message || 'Unknown error'}`);
}

export async function acquireLock(path: string): Promise<() => void> {
  const lockFile = `${path}.lock`;
  const lockId = randomBytes(16).toString('hex');
  const startTime = Date.now();
  
  if (locks.has(path)) {
    await new Promise<void>((resolve, reject) => {
      const queue = lockQueue.get(path) || [];
      const timeoutId = setTimeout(() => {
        const index = queue.indexOf(resolve);
        if (index > -1) queue.splice(index, 1);
        reject(new Error(`Lock timeout: ${path}`));
      }, LOCK_TIMEOUT - (Date.now() - startTime));
      
      const wrappedResolve = () => {
        clearTimeout(timeoutId);
        resolve();
      };
      queue.push(wrappedResolve);
      lockQueue.set(path, queue);
    });
  }
  
  let lockResolve: () => void;
  const lockPromise = new Promise<void>(resolve => {
    lockResolve = resolve;
  });
  
  locks.set(path, lockPromise);
  
  try {
    await withRetry(async () => {
      await fs.writeFile(lockFile, lockId, { flag: 'wx' });
    }, `acquiring lock on ${path}`, 3);
  } catch (error) {
    locks.delete(path);
    const queue = lockQueue.get(path);
    if (queue && queue.length > 0) {
      const next = queue.shift();
      if (next) next();
      if (queue.length === 0) lockQueue.delete(path);
    }
    throw error;
  }
  
  return async () => {
    try {
      await fs.unlink(lockFile).catch(() => {});
    } finally {
      locks.delete(path);
      lockResolve!();
      const queue = lockQueue.get(path);
      if (queue && queue.length > 0) {
        const next = queue.shift();
        if (next) next();
        if (queue.length === 0) lockQueue.delete(path);
      }
    }
  };
}

export async function atomicWrite(
  targetPath: string,
  content: string | Buffer,
  options?: { mode?: number }
): Promise<void> {
  const dir = dirname(targetPath);
  const tempPath = join(dir, `.${basename(targetPath)}.${randomBytes(8).toString('hex')}.tmp`);
  
  await withRetry(async () => {
    await fs.mkdir(dir, { recursive: true });
  }, `creating directory ${dir}`);
  
  const unlock = await acquireLock(targetPath);
  
  try {
    await withRetry(async () => {
      await fs.writeFile(tempPath, content, { mode: options?.mode });
      
      if (process.platform !== 'win32') {
        await fs.rename(tempPath, targetPath);
      } else {
        try {
          await fs.unlink(targetPath);
        } catch {}
        await fs.rename(tempPath, targetPath);
      }
    }, `atomic write to ${targetPath}`);
  } finally {
    try {
      await fs.unlink(tempPath).catch(() => {});
    } finally {
      await unlock();
    }
  }
}

export async function atomicCopy(
  sourcePath: string,
  targetPath: string,
  options?: { preserveTimestamps?: boolean }
): Promise<void> {
  const dir = dirname(targetPath);
  const tempPath = join(dir, `.${basename(targetPath)}.${randomBytes(8).toString('hex')}.tmp`);
  
  await withRetry(async () => {
    await fs.mkdir(dir, { recursive: true });
  }, `creating directory ${dir}`);
  
  const unlock = await acquireLock(targetPath);
  
  try {
    await withRetry(async () => {
      const sourceStats = await fs.stat(sourcePath);
      
      if (sourceStats.isDirectory()) {
        await fs.cp(sourcePath, tempPath, {
          recursive: true,
          preserveTimestamps: options?.preserveTimestamps ?? true,
          force: true
        });
      } else {
        await fs.copyFile(sourcePath, tempPath);
        
        if (options?.preserveTimestamps) {
          await fs.utimes(tempPath, sourceStats.atime, sourceStats.mtime);
        }
      }
      
      if (process.platform !== 'win32') {
        await fs.rename(tempPath, targetPath);
      } else {
        try {
          await fs.rm(targetPath, { recursive: true, force: true });
        } catch {}
        await fs.rename(tempPath, targetPath);
      }
    }, `atomic copy from ${sourcePath} to ${targetPath}`);
  } finally {
    try {
      await fs.rm(tempPath, { recursive: true, force: true }).catch(() => {});
    } finally {
      await unlock();
    }
  }
}

export async function atomicMove(
  sourcePath: string,
  targetPath: string
): Promise<void> {
  const sourceDir = dirname(sourcePath);
  const targetDir = dirname(targetPath);
  
  await withRetry(async () => {
    await fs.mkdir(targetDir, { recursive: true });
  }, `creating directory ${targetDir}`);
  
  try {
    const sourceStat = await fs.stat(sourceDir);
    const targetStat = await fs.stat(targetDir).catch(() => null);
    
    if (targetStat && sourceStat.dev === targetStat.dev) {
      const unlock = await acquireLock(targetPath);
      try {
        await withRetry(async () => {
          if (process.platform !== 'win32') {
            await fs.rename(sourcePath, targetPath);
          } else {
            try {
              await fs.rm(targetPath, { recursive: true, force: true });
            } catch {}
            await fs.rename(sourcePath, targetPath);
          }
        }, `atomic move from ${sourcePath} to ${targetPath}`);
      } finally {
        await unlock();
      }
    } else {
      await atomicCopy(sourcePath, targetPath, { preserveTimestamps: true });
      await fs.rm(sourcePath, { recursive: true, force: true });
    }
  } catch (error) {
    throw new Error(`Atomic move failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export class TransactionLog {
  private operations: Array<{ type: string; path: string; backup?: string }> = [];
  private backupDir: string;
  
  constructor() {
    this.backupDir = join(tmpdir(), `.create-claude-tx-${Date.now()}-${randomBytes(4).toString('hex')}`);
  }
  
  async init(): Promise<void> {
    await fs.mkdir(this.backupDir, { recursive: true });
  }
  
  async backup(path: string): Promise<void> {
    const exists = await fs.access(path).then(() => true).catch(() => false);
    if (!exists) return;
    
    const backupPath = join(this.backupDir, randomBytes(8).toString('hex'));
    await atomicCopy(path, backupPath);
    this.operations.push({ type: 'backup', path, backup: backupPath });
  }
  
  async write(path: string, content: string | Buffer): Promise<void> {
    await this.backup(path);
    await atomicWrite(path, content);
    this.operations.push({ type: 'write', path });
  }
  
  async copy(source: string, target: string): Promise<void> {
    await this.backup(target);
    await atomicCopy(source, target);
    this.operations.push({ type: 'copy', path: target });
  }
  
  async rollback(): Promise<void> {
    for (const op of this.operations.reverse()) {
      if (op.type === 'backup' && op.backup) {
        try {
          await atomicMove(op.backup, op.path);
        } catch (error) {
          console.error(`Failed to rollback ${op.path}: ${error}`);
        }
      } else if (op.type === 'write' || op.type === 'copy') {
        try {
          await fs.rm(op.path, { recursive: true, force: true });
        } catch {}
      }
    }
  }
  
  async commit(): Promise<void> {
    try {
      await fs.rm(this.backupDir, { recursive: true, force: true });
    } catch {}
  }
}
