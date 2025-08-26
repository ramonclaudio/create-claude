export enum LogLevel {
  ERROR = 0,
  WARN = 1,
  INFO = 2,
  DEBUG = 3
}

let silent = false;
let level = LogLevel.INFO;

export const logger = {
  error: (msg: string, ctx?: any) => {
    if (!silent && level >= LogLevel.ERROR) {
      console.error(`[${new Date().toISOString()}] [ERROR] ${msg}${ctx ? ` ${JSON.stringify(ctx)}` : ''}`);
    }
  },
  
  warn: (msg: string, ctx?: any) => {
    if (!silent && level >= LogLevel.WARN) {
      console.warn(`[${new Date().toISOString()}] [WARN] ${msg}${ctx ? ` ${JSON.stringify(ctx)}` : ''}`);
    }
  },
  
  info: (msg: string, ctx?: any) => {
    if (!silent && level >= LogLevel.INFO) {
      console.log(`[${new Date().toISOString()}] [INFO] ${msg}${ctx ? ` ${JSON.stringify(ctx)}` : ''}`);
    }
  },
  
  debug: (msg: string, ctx?: any) => {
    if (!silent && level >= LogLevel.DEBUG) {
      console.log(`[${new Date().toISOString()}] [DEBUG] ${msg}${ctx ? ` ${JSON.stringify(ctx)}` : ''}`);
    }
  },
  
  operation: async <T>(op: string, fn: () => Promise<T>): Promise<T> => {
    const start = Date.now();
    try {
      const result = await fn();
      logger.debug(`${op} completed`, { duration: Date.now() - start });
      return result;
    } catch (error) {
      logger.error(`${op} failed`, { duration: Date.now() - start });
      throw error;
    }
  }
};

export function configureLogger(options: { level?: LogLevel; silent?: boolean }): void {
  if (options.level !== undefined) level = options.level;
  if (options.silent !== undefined) silent = options.silent;
}
