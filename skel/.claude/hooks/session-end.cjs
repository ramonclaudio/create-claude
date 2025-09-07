#!/usr/bin/env node

const { execSync } = require('node:child_process');

try {
  execSync('find . -type f -name "*.tmp" -o -name "*.log" -o -name ".DS_Store" | head -20 | xargs rm -f 2>/dev/null', {
    encoding: 'utf-8',
    stdio: 'pipe'
  });

  const branch = execSync('git branch --show-current 2>/dev/null || echo "not-git"', {
    encoding: 'utf-8',
    stdio: 'pipe'
  }).trim();

  const changes = execSync('git status --short 2>/dev/null | wc -l || echo "0"', {
    encoding: 'utf-8',
    stdio: 'pipe'
  }).trim();

  if (changes !== '0') {
    console.log(`✓ Session complete. ${changes} file(s) modified on ${branch}`);
  }
} catch (e) {
  // Silent fail - not critical
}