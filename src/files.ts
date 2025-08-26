import { type TemplateVariables } from './types.js';
import { promises as fs, createReadStream } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { pipeline } from 'node:stream/promises';
import { exists } from './utils.js';
import { TransactionLog, withRetry } from './atomic.js';
import { renderTemplate, validateTemplateVariables } from './template.js';
import { logger } from './logger.js';

async function validatePathSecurity(targetPath: string, projectPath: string): Promise<void> {
  const resolvedTarget = resolve(targetPath);
  const resolvedProject = resolve(projectPath);
  
  if (!resolvedTarget.startsWith(resolvedProject)) {
    throw new Error(
      `SECURITY: Path traversal attempt blocked\n` +
      `Target: ${targetPath}\n` +
      `Project: ${projectPath}\n` +
      `Action: Ensure all paths are within project directory`
    );
  }
}

async function hashFile(path: string): Promise<string> {
  const hash = createHash('sha256');
  const stream = createReadStream(path);
  await pipeline(stream, hash);
  return hash.digest('hex');
}

async function verifyBackup(originalPath: string, backupPath: string): Promise<void> {
  const stats = await fs.stat(originalPath);
  
  if (stats.isDirectory()) {
    const originalFiles = await getAllFiles(originalPath);
    const backupFiles = await getAllFiles(backupPath);
    
    if (originalFiles.length !== backupFiles.length || 
        !originalFiles.every(f => backupFiles.includes(f))) {
      throw new Error(
        `CRITICAL: Backup verification failed - directory structure mismatch\n` +
        `Action: DO NOT PROCEED - Data integrity compromised`
      );
    }
    return;
  }
  
  const [originalHash, backupHash] = await Promise.all([
    hashFile(originalPath),
    hashFile(backupPath)
  ]);
  
  if (originalHash !== backupHash) {
    throw new Error(
      `CRITICAL: Backup verification failed\n` +
      `SHA256 mismatch detected\n` +
      `Action: DO NOT PROCEED - Data integrity compromised`
    );
  }
}

function getSourceDir(): string {
  return join(dirname(fileURLToPath(import.meta.url)), '..', 'skel');
}

async function createBackupDir(projectPath: string): Promise<string> {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupDir = join(projectPath, `.create-claude-backup-${timestamp}`);
  
  await withRetry(
    async () => await fs.mkdir(backupDir, { recursive: true }),
    'Creating backup directory'
  );
  
  return backupDir;
}

async function getAllFiles(dir: string): Promise<string[]> {
  const files: string[] = [];
  
  async function traverse(currentDir: string, prefix = ''): Promise<void> {
    const entries = await fs.readdir(currentDir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = join(currentDir, entry.name);
      const relativePath = prefix ? join(prefix, entry.name) : entry.name;
      
      if (entry.isDirectory()) {
        await traverse(fullPath, relativePath);
      } else if (entry.isFile()) {
        files.push(relativePath);
      }
    }
  }
  
  await traverse(dir);
  return files;
}

export async function copyClaudeDirectory(
  projectPath: string,
  variables: TemplateVariables,
  sharedBackupDir?: string
): Promise<{ filesProcessed: number; backupDir?: string | undefined }> {
  const targetDir = join(projectPath, '.claude');
  const sourceDir = join(getSourceDir(), '.claude');
  
  await validatePathSecurity(targetDir, projectPath);
  
  const tx = new TransactionLog();
  await tx.init();
  
  let backupDir = sharedBackupDir;
  
  try {
    logger.info('Starting .claude directory copy', { target: targetDir });
    
    if (await exists(targetDir)) {
      backupDir = backupDir || await createBackupDir(projectPath);
      const backupPath = join(backupDir, '.claude');
      
      logger.info('Backing up existing .claude directory', { backup: backupPath });
      await tx.copy(targetDir, backupPath);
      await verifyBackup(targetDir, backupPath);
    }
    
    const files = await getAllFiles(sourceDir);
    const validatedVars = validateTemplateVariables(variables);
    
    for (const file of files) {
      const sourcePath = join(sourceDir, file);
      const targetPath = join(targetDir, file);
      
      const content = await fs.readFile(sourcePath, 'utf-8');
      const processed = content.includes('{{') 
        ? renderTemplate(content, validatedVars)
        : content;
      
      await tx.write(targetPath, processed);
    }
    
    await tx.commit();
    logger.info('.claude directory copy completed', { files: files.length });
    
    return { filesProcessed: files.length, backupDir: backupDir };
  } catch (error) {
    logger.error('Failed to copy .claude directory, rolling back', { 
      error: error instanceof Error ? error.message : String(error) 
    });
    
    await tx.rollback();
    throw error;
  }
}

export async function copyAdditionalFiles(
  projectPath: string,
  variables: TemplateVariables,
  sharedBackupDir?: string
): Promise<{ filesProcessed: number }> {
  const files = ['CLAUDE.md'];
  const sourceDir = getSourceDir();
  
  const tx = new TransactionLog();
  await tx.init();
  
  let backupDir = sharedBackupDir;
  let processedCount = 0;
  
  try {
    logger.info('Copying additional files', { files });
    const validatedVars = validateTemplateVariables(variables);
    
    for (const fileName of files) {
      const sourcePath = join(sourceDir, fileName);
      const targetPath = join(projectPath, fileName);
      
      await validatePathSecurity(targetPath, projectPath);
      
      if (await exists(targetPath)) {
        backupDir = backupDir || await createBackupDir(projectPath);
        const backupPath = join(backupDir, fileName);
        
        logger.info(`Backing up existing ${fileName}`, { backup: backupPath });
        await tx.copy(targetPath, backupPath);
        await verifyBackup(targetPath, backupPath);
      }
      
      const content = await fs.readFile(sourcePath, 'utf-8');
      const processed = content.includes('{{')
        ? renderTemplate(content, validatedVars)
        : content;
      
      await tx.write(targetPath, processed);
      processedCount++;
    }
    
    await tx.commit();
    logger.info('Additional files copy completed', { count: processedCount });
    
    return { filesProcessed: processedCount };
  } catch (error) {
    logger.error('Failed to copy additional files, rolling back', {
      error: error instanceof Error ? error.message : String(error)
    });
    
    await tx.rollback();
    throw error;
  }
}
