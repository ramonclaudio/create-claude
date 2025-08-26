const { readFileSync, existsSync } = require('node:fs');
const { join } = require('node:path');

const FRAMEWORKS = {
  'next': { icon: '▲', name: 'Next.js' },
  'nuxt': { icon: '▲', name: 'Nuxt.js' },
  'nestjs': { icon: '◊', name: 'NestJS' },
  '@nestjs/core': { icon: '◊', name: 'NestJS' },
  'react': { icon: '◉', name: 'React' },
  '@types/react': { icon: '◉', name: 'React' },
  'vue': { icon: '◈', name: 'Vue' },
  '@vue/cli': { icon: '◈', name: 'Vue' },
  'angular': { icon: '▼', name: 'Angular' },
  '@angular/core': { icon: '▼', name: 'Angular' },
  'svelte': { icon: '◆', name: 'Svelte' },
  'express': { icon: '□', name: 'Express' },
  'fastify': { icon: '◇', name: 'Fastify' }
};

const RUNTIMES = [
  { files: ['Cargo.toml'], runtime: { icon: '⚡', name: 'rust' } },
  { files: ['go.mod'], runtime: { icon: '◈', name: 'go' } },
  { files: ['requirements.txt'], runtime: { icon: '◉', name: 'python' } },
  { files: ['pyproject.toml'], runtime: { icon: '◉', name: 'python' } },
  { files: ['setup.py'], runtime: { icon: '◉', name: 'python' } },
  { files: ['pom.xml'], runtime: { icon: '◎', name: 'java' } },
  { files: ['build.gradle'], runtime: { icon: '◎', name: 'java' } },
  { files: ['bun.lockb'], runtime: { icon: '◯', name: 'bun' } },
  { files: ['tsconfig.json'], runtime: { icon: '○', name: 'typescript' } },
  { files: ['tsconfig.build.json'], runtime: { icon: '○', name: 'typescript' } },
  { files: ['package.json'], runtime: { icon: '○', name: 'node' } }
];

const DEFAULT_RUNTIME = { icon: '◦', name: 'unknown' };

function detectFramework(cwd) {
  try {
    const packageJsonPath = join(cwd, 'package.json');
    if (!existsSync(packageJsonPath)) return null;
    
    const content = readFileSync(packageJsonPath, 'utf-8');
    const packageJson = JSON.parse(content);
    const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };
    
    for (const [dep, framework] of Object.entries(FRAMEWORKS)) {
      if (deps[dep]) return framework;
    }
  } catch {
    // Ignore errors
  }
  
  return null;
}

function detectRuntime(cwd) {
  try {
    if (existsSync(join(cwd, 'Makefile')) && existsSync(join(cwd, 'src'))) {
      return { icon: '⊙', name: 'c/c++' };
    }
    
    for (const check of RUNTIMES) {
      const anyFileExists = check.files.some(file => existsSync(join(cwd, file)));
      if (anyFileExists) {
        return check.runtime;
      }
    }
  } catch {
    // Ignore errors
  }
  
  return DEFAULT_RUNTIME;
}

module.exports = {
  detectFramework,
  detectRuntime
};
