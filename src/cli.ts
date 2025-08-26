#!/usr/bin/env node

import { init } from './init.js';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

function validateArgs(args: string[]): { dryRun: boolean; verbose: boolean; silent: boolean } {
  const processedArgs = args[0] === 'init' ? args.slice(1) : args;
  let dryRun = false;
  let verbose = false;
  let silent = false;
  
  for (const arg of processedArgs) {
    if (arg?.startsWith('-') && !['--help', '-h', '--version', '-v', '--dry-run', '--verbose', '--silent'].includes(arg)) {
      throw new Error(`Unknown flag: ${arg}`);
    }
    if (arg === '--dry-run') dryRun = true;
    if (arg === '--verbose') verbose = true;
    if (arg === '--silent') silent = true;
  }
  
  return { dryRun, verbose, silent };
}

function showVersion(): void {
  const packagePath = join(dirname(fileURLToPath(import.meta.url)), '..', 'package.json');
  const packageContent = readFileSync(packagePath, 'utf-8');
  const packageJson = JSON.parse(packageContent) as { version: string; [key: string]: unknown };
  console.log(packageJson.version);
}

async function runInit(options: { dryRun?: boolean; verbose?: boolean; silent?: boolean } = {}): Promise<number> {
  const result = await init(process.cwd(), options);
  
  if (!result.success) {
    if (!options.silent) {
      console.error(result.message);
    }
    return 1;
  }
  
  if (!options.silent) {
    console.log(result.message);
  }
  return 0;
}

function showHelp(): void {
  console.log(`create-claude - Zero-config Claude Code setup`);
  console.log(``);
  console.log(`USAGE:`);
  console.log(`  create-claude [OPTIONS]`);
  console.log(`  cld [OPTIONS]`);
  console.log(``);
  console.log(`DESCRIPTION:`);
  console.log(`  Initializes Claude Code configuration in the current directory.`);
  console.log(`  Creates .claude/ directory with agents, hooks, commands, and settings.`);
  console.log(`  Adds CLAUDE.md with project context and coding standards.`);
  console.log(``);
  console.log(`OPTIONS:`);
  console.log(`  --help, -h     Show this help message`);
  console.log(`  --version, -v  Show version number`);
  console.log(`  --dry-run      Show what would be done without making changes`);
  console.log(`  --verbose      Show detailed debug information`);
  console.log(`  --silent       Suppress all output except errors`);
  console.log(``);
  console.log(`EXAMPLES:`);
  console.log(`  create-claude           # Initialize in current directory`);
  console.log(`  create-claude --dry-run # Preview changes without applying`);
  console.log(`  cld                     # Same as above`);
}

function checkNodeVersion(): void {
  const currentVersion = process.version;
  const versionParts = currentVersion.slice(1).split('.');
  const majorVersion = parseInt(versionParts[0] || '0', 10);
  
  if (majorVersion < 20) {
    console.error(`Error: Node.js version ${currentVersion} is not supported.`);
    console.error(`Please upgrade to Node.js 20 or higher.`);
    console.error(`Visit https://nodejs.org to download the latest version.`);
    process.exit(1);
  }
}

function setupSignalHandlers(): void {
  let isShuttingDown = false;
  
  const handleShutdown = (signal: string) => {
    if (isShuttingDown) return;
    isShuttingDown = true;
    
    console.error(`\nReceived ${signal}, shutting down gracefully...`);
    process.exit(1);
  };
  
  process.on('SIGINT', () => handleShutdown('SIGINT'));
  process.on('SIGTERM', () => handleShutdown('SIGTERM'));
  process.on('SIGHUP', () => handleShutdown('SIGHUP'));
  process.on('SIGQUIT', () => handleShutdown('SIGQUIT'));
}

async function main(): Promise<void> {
  checkNodeVersion();
  setupSignalHandlers();
  
  const rawArgs = process.argv.slice(2);
  
  if (rawArgs.includes('--help') || rawArgs.includes('-h')) {
    showHelp();
    process.exit(0);
  }
  
  if (rawArgs.includes('--version') || rawArgs.includes('-v')) {
    showVersion();
    process.exit(0);
  }
  
  const { dryRun, verbose, silent } = validateArgs(rawArgs);
  const exitCode = await runInit({ dryRun, verbose, silent });
  process.exit(exitCode);
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`Unexpected error: ${message}`);
  process.exit(1);
});
