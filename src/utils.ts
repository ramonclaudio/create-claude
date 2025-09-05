import { stat, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import type { PackageManager, Runtime } from './types.js';
import { executeQuiet } from './exec.js';
import { withRetry } from './atomic.js';

export async function exists(path: string): Promise<boolean> {
  return stat(path).then(() => true).catch(() => false);
}

export async function detectPackageManager(projectPath: string): Promise<PackageManager> {
  const checks = [
    { file: 'package-lock.json', result: 'npm' as PackageManager },
    { file: 'pnpm-lock.yaml', result: 'pnpm' as PackageManager },
    { file: 'bun.lockb', result: 'bun' as PackageManager },
    { file: 'yarn.lock', result: 'yarn' as PackageManager },
    { file: 'package.json', result: 'npm' as PackageManager },
    { file: 'poetry.lock', result: 'poetry' as PackageManager },
    { file: 'uv.lock', result: 'uv' as PackageManager },
    { file: 'requirements.txt', result: 'pip' as PackageManager }
  ];
  
  for (const check of checks) {
    if (await exists(join(projectPath, check.file))) {
      return check.result;
    }
  }
  
  return 'none';
}

export async function detectRuntime(projectPath: string): Promise<Runtime> {
  const checks = [
    { file: 'Cargo.toml', result: 'rust' as Runtime },
    { file: 'go.mod', result: 'go' as Runtime },
    { files: ['setup.py', 'pyproject.toml', 'requirements.txt'], result: 'python' as Runtime },
    { files: ['pom.xml', 'build.gradle'], result: 'java' as Runtime },
    { condition: async () => {
      const hasMakefile = await exists(join(projectPath, 'Makefile'));
      const hasSrc = await exists(join(projectPath, 'src'));
      return hasMakefile && hasSrc;
    }, result: 'c/c++' as Runtime },
    { file: 'bun.lockb', result: 'bun' as Runtime },
    { files: ['tsconfig.json', 'tsconfig.build.json'], result: 'typescript' as Runtime },
    { file: 'package.json', result: 'node' as Runtime }
  ];
  
  for (const check of checks) {
    if ('file' in check && await exists(join(projectPath, check.file))) {
      return check.result;
    }
    if ('files' in check) {
      for (const file of check.files) {
        if (await exists(join(projectPath, file))) {
          return check.result;
        }
      }
    }
    if ('condition' in check && await check.condition()) {
      return check.result;
    }
  }
  
  return 'unknown';
}

export async function detectFramework(projectPath: string): Promise<string> {
  const configChecks = [
    { patterns: ['next.config.js', 'next.config.ts', 'next.config.mjs'], framework: 'Next.js' },
    { patterns: ['nuxt.config.js', 'nuxt.config.ts'], framework: 'Nuxt.js' },
    { patterns: ['nest-cli.json'], framework: 'NestJS' },
    { patterns: ['angular.json', '.angular-cli.json'], framework: 'Angular' },
    { patterns: ['svelte.config.js', 'svelte.config.ts'], framework: 'Svelte' },
    { patterns: ['vue.config.js', 'vue.config.ts'], framework: 'Vue' },
    { patterns: ['vite.config.js', 'vite.config.ts'], framework: 'Vite' },
    { patterns: ['astro.config.js', 'astro.config.ts'], framework: 'Astro' }
  ];
  
  for (const { patterns, framework } of configChecks) {
    for (const pattern of patterns) {
      if (await exists(join(projectPath, pattern))) {
        return framework;
      }
    }
  }
  
  const packageJsonPath = join(projectPath, 'package.json');
  if (!await exists(packageJsonPath)) return 'None';
  
  try {
    const content = await withRetry(
      async () => await readFile(packageJsonPath, 'utf-8'),
      'reading package.json',
      3
    );
    
    const packageJson = JSON.parse(content);
    const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };
    
    const depChecks = [
      { key: 'next', framework: 'Next.js' },
      { keys: ['nuxt', 'nuxt3'], framework: 'Nuxt.js' },
      { keys: ['@nestjs/core', '@nestjs/common'], framework: 'NestJS' },
      { keys: ['@angular/core'], framework: 'Angular' },
      { keys: ['svelte', '@sveltejs/kit'], framework: 'Svelte' },
      { keys: ['vue', '@vue/cli', '@vitejs/plugin-vue'], framework: 'Vue' },
      { keys: ['astro', '@astrojs/core'], framework: 'Astro' },
      { keys: ['remix', '@remix-run/node'], framework: 'Remix' },
      { keys: ['gatsby', 'gatsby-cli'], framework: 'Gatsby' },
      { keys: ['vite', '@vitejs/plugin-react'], framework: 'Vite' },
      { keys: ['react', '@types/react'], framework: 'React' },
      { key: 'express', framework: 'Express' },
      { key: 'fastify', framework: 'Fastify' },
      { key: 'koa', framework: 'Koa' },
      { keys: ['hapi', '@hapi/hapi'], framework: 'Hapi' }
    ];
    
    for (const check of depChecks) {
      const keys = 'keys' in check ? check.keys : [check.key!];
      if (keys.some(key => key in deps)) {
        return check.framework;
      }
    }
    
    const scripts = packageJson.scripts || {};
    const scriptChecks = [
      { pattern: /next/, framework: 'Next.js' },
      { pattern: /nuxt/, framework: 'Nuxt.js' },
      { pattern: /vue-cli-service/, framework: 'Vue' },
      { pattern: /ng serve/, framework: 'Angular' }
    ];
    
    for (const { pattern, framework } of scriptChecks) {
      if (Object.values(scripts).some(script => 
        typeof script === 'string' && pattern.test(script)
      )) {
        return framework;
      }
    }
    
    return 'None';
  } catch {
    return 'None';
  }
}

export async function safeExec(command: string, cwd: string): Promise<string | null> {
  return executeQuiet(command, { cwd, timeout: 10000 });
}

export class ProgressIndicator {
  private message = '';
  private isStarted = false;

  start(message: string): void {
    this.message = message;
    this.isStarted = true;
  }

  stop(completionMessage?: string): void {
    if (this.isStarted) {
      console.log(`✓ ${completionMessage || this.message}`);
      this.isStarted = false;
    }
  }

  fail(errorMessage: string): void {
    if (this.isStarted) {
      console.log(`✗ ${errorMessage}`);
      this.isStarted = false;
    }
  }

  cleanup(): void {
    // No-op for now, but could clear console lines if needed
  }
}
