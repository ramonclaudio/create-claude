const { execFileSync } = require('node:child_process');
const { readFileSync, statSync } = require('node:fs');
const { join, dirname, basename } = require('node:path');

let toolInput = {};
try {
  const input = readFileSync(process.stdin.fd, 'utf-8');
  const parsed = JSON.parse(input);
  toolInput = parsed.tool_input || {};
} catch (error) {
  if (error.code === 'EAGAIN' || error.code === 'ENOTTY' || error.code === 'EINVAL') {
    process.exit(0);
  }
  process.exit(0);
}

const { file_path } = toolInput;

if (!file_path || 
    file_path.includes('..') || 
    !file_path.startsWith(process.cwd()) ||
    file_path.length > 500) {
  process.exit(0);
}

try {
  const stats = statSync(file_path);
  if (!stats.isFile() || stats.size > 10 * 1024 * 1024) { 
    process.exit(0);
  }
} catch {
  process.exit(0);
}

function findProjectConfig(startPath) {
  let currentPath = dirname(startPath);
  const root = process.cwd();
  
  while (currentPath.startsWith(root)) {
    const packagePath = join(currentPath, 'package.json');
    try {
      statSync(packagePath);
      const packageJson = JSON.parse(readFileSync(packagePath, 'utf-8'));
      return { 
        type: 'node', 
        configPath: packagePath, 
        scripts: packageJson.scripts || {} 
      };
    } catch {}
    
    const pyprojectPath = join(currentPath, 'pyproject.toml');
    try {
      statSync(pyprojectPath);
      const content = readFileSync(pyprojectPath, 'utf-8');
      
      const scriptsMatch = content.match(/\[tool\.scripts\]\s*((?:\s*\w+\s*=\s*["|'].*?["|']\s*)*)/s);
      let scripts = {};
      
      if (scriptsMatch) {
        const scriptLines = scriptsMatch[1].trim().split('\n');
        for (const line of scriptLines) {
          const match = line.match(/^\s*(\w+)\s*=\s*["|'](.*?)["|']\s*$/);
          if (match) {
            scripts[match[1]] = match[2];
          }
        }
      }
      
      return { type: 'python', configPath: pyprojectPath, scripts };
    } catch {}
    
    const parentPath = dirname(currentPath);
    if (parentPath === currentPath) break;
    currentPath = parentPath;
  }
  
  return { type: 'unknown' };
}

function runNodeScript(scriptName, projectRoot) {
  try {
    const packageManagers = [
      { name: 'pnpm', lockFile: 'pnpm-lock.yaml' },
      { name: 'bun', lockFile: 'bun.lockb' },
      { name: 'yarn', lockFile: 'yarn.lock' },
      { name: 'npm', lockFile: 'package-lock.json' }
    ];
    
    let pm = 'npm';
    for (const { name, lockFile } of packageManagers) {
      try {
        statSync(join(projectRoot, lockFile));
        pm = name;
        break;
      } catch {
        continue;
      }
    }
    
    execFileSync(pm, ['run', scriptName], {
      cwd: projectRoot,
      stdio: 'pipe',
      timeout: 5000
    });
    
    return true;
  } catch {
    return false;
  }
}

function runPythonScript(scriptName, scriptCommand, projectRoot) {
  try {
    execFileSync('sh', ['-c', scriptCommand], {
      cwd: projectRoot,
      stdio: 'pipe',
      timeout: 5000
    });
    
    return true;
  } catch {
    return false;
  }
}

const projectConfig = findProjectConfig(file_path);
const projectRoot = projectConfig.configPath ? dirname(projectConfig.configPath) : process.cwd();

if (projectConfig.type === 'node' && projectConfig.scripts) {
  const fastScripts = ['lint:fix', 'fix', 'format', 'fmt', 'prettier'];
  
  for (const scriptName of fastScripts) {
    if (projectConfig.scripts[scriptName]) {
      if (runNodeScript(scriptName, projectRoot)) {
        process.exit(0);
      }
    }
  }
  
  const fastFormatters = [
    { cmd: 'biome', args: ['format', '--write', file_path] },
    { cmd: 'prettier', args: ['--write', file_path] },
    { cmd: 'eslint', args: ['--fix', file_path] }
  ];
  
  for (const { cmd, args } of fastFormatters) {
    try {
      const whichCmd = process.platform === 'win32' ? 'where' : 'which';
      execFileSync(whichCmd, [cmd], { stdio: 'pipe' });
      execFileSync(cmd, args, { stdio: 'pipe', timeout: 5000 });
      break;
    } catch {
      continue;
    }
  }
  
} else if (projectConfig.type === 'python') {
  if (projectConfig.scripts) {
    const fastScripts = ['format', 'fmt', 'lint:fix', 'fix'];
    
    for (const scriptName of fastScripts) {
      if (projectConfig.scripts[scriptName]) {
        if (runPythonScript(scriptName, projectConfig.scripts[scriptName], projectRoot)) {
          process.exit(0);
        }
      }
    }
  }
  
  const fastPythonFormatters = [
    { cmd: 'ruff', args: ['format', file_path] },
    { cmd: 'black', args: [file_path] },
    { cmd: 'isort', args: [file_path] }
  ];
  
  for (const { cmd, args } of fastPythonFormatters) {
    try {
      const whichCmd = process.platform === 'win32' ? 'where' : 'which';
      execFileSync(whichCmd, [cmd], { stdio: 'pipe' });
      execFileSync(cmd, args, { stdio: 'pipe', timeout: 5000 });
      break;
    } catch {
      continue;
    }
  }
  
} else {
  const fileExt = file_path.split('.').pop()?.toLowerCase();
  
  if (['js', 'jsx', 'ts', 'tsx', 'json', 'css', 'html', 'md'].includes(fileExt || '')) {
    const webFormatters = [
      { cmd: 'biome', args: ['format', '--write', file_path] },
      { cmd: 'prettier', args: ['--write', file_path] }
    ];
    
    for (const { cmd, args } of webFormatters) {
      try {
        const whichCmd = process.platform === 'win32' ? 'where' : 'which';
        execFileSync(whichCmd, [cmd], { stdio: 'pipe' });
        execFileSync(cmd, args, { stdio: 'pipe', timeout: 5000 });
        break;
      } catch {
        continue;
      }
    }
  } else if (['py', 'pyi'].includes(fileExt || '')) {
    const pythonFormatters = [
      { cmd: 'ruff', args: ['format', file_path] },
      { cmd: 'black', args: [file_path] }
    ];
    
    for (const { cmd, args } of pythonFormatters) {
      try {
        const whichCmd = process.platform === 'win32' ? 'where' : 'which';
        execFileSync(whichCmd, [cmd], { stdio: 'pipe' });
        execFileSync(cmd, args, { stdio: 'pipe', timeout: 5000 });
        break;
      } catch {
        continue;
      }
    }
  }
}
