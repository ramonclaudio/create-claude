import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);

export interface ExecOptions {
  cwd?: string;
  timeout?: number;
  maxBuffer?: number;
  env?: NodeJS.ProcessEnv;
}

export interface ExecResult {
  stdout: string;
  stderr: string;
  code: number;
}

const DEFAULT_TIMEOUT = 30000;
const DEFAULT_MAX_BUFFER = 10 * 1024 * 1024;

export async function execute(
  command: string,
  options: ExecOptions = {}
): Promise<ExecResult> {
  const timeout = options.timeout ?? DEFAULT_TIMEOUT;
  const maxBuffer = options.maxBuffer ?? DEFAULT_MAX_BUFFER;
  
  const [cmd, ...args] = command.split(' ').filter(Boolean);
  if (!cmd) {
    throw new Error('Empty command');
  }
  
  const dangerousCommands = ['rm', 'dd', 'mkfs', 'format', 'del'];
  if (dangerousCommands.includes(cmd)) {
    throw new Error(`Dangerous command blocked: ${cmd}`);
  }
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const { stdout, stderr } = await execFileAsync(cmd, args, {
      cwd: options.cwd,
      timeout,
      maxBuffer,
      env: options.env,
      signal: controller.signal,
      encoding: 'utf-8'
    });
    
    return {
      stdout: stdout.trim(),
      stderr: stderr.trim(),
      code: 0
    };
  } catch (error) {
    const execError = error as NodeJS.ErrnoException & {
      stdout?: string;
      stderr?: string;
      code?: number;
    };
    if (controller.signal.aborted) {
      throw new Error(`Command timed out after ${timeout}ms`);
    }
    
    return {
      stdout: execError.stdout?.trim() || '',
      stderr: execError.stderr?.trim() || execError.message || String(error),
      code: execError.code || 1
    };
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function executeQuiet(
  command: string,
  options: ExecOptions = {}
): Promise<string | null> {
  try {
    const result = await execute(command, options);
    return result.code === 0 ? result.stdout : null;
  } catch {
    return null;
  }
}

export async function executeWithRetry(
  command: string,
  options: ExecOptions & { maxRetries?: number; retryDelay?: number } = {}
): Promise<ExecResult> {
  const maxRetries = options.maxRetries ?? 3;
  const retryDelay = options.retryDelay ?? 1000;
  let lastError: Error | undefined;
  
  for (let i = 0; i <= maxRetries; i++) {
    try {
      return await execute(command, options);
    } catch (error) {
      lastError = error as Error;
      
      if (i < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, retryDelay * (i + 1)));
      }
    }
  }
  
  throw lastError || new Error(`Command failed after ${maxRetries} retries`);
}
