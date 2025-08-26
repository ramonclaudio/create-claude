const { execSync } = require('node:child_process');

const ALLOWED_GIT_COMMANDS = [
  'git status --porcelain=v1 --branch',
  'git diff --shortstat',
  'git diff --cached --shortstat'
];

const PATTERNS = {
  BRANCH: /## (.+?)(?:\.\.\.|$)/,
  AHEAD: /ahead (\d+)/,
  BEHIND: /behind (\d+)/
};

let lastGitCall = 0;
const MIN_INTERVAL = 100;

function safeExec(command, cwd) {
  try {
    if (!ALLOWED_GIT_COMMANDS.some(allowed => command.startsWith(allowed))) {
      return null;
    }
    
    if (!cwd || cwd.includes('..') || cwd.length > 500) {
      return null;
    }
    
    const now = Date.now();
    if (now - lastGitCall < MIN_INTERVAL) {
      return null;
    }
    lastGitCall = now;
    
    return execSync(command, { 
      cwd, 
      encoding: 'utf-8', 
      stdio: 'pipe', 
      timeout: 2000,
      env: {
        PATH: process.env.PATH,
        HOME: process.env.HOME,
        USER: process.env.USER
      }
    }).toString().trim();
  } catch {
    return null;
  }
}

function parseGitStatus(status) {
  let branch = 'main', modified = 0, staged = 0, untracked = 0, ahead = 0, behind = 0;
  
  for (const line of status.split('\n')) {
    if (line.startsWith('##')) {
      const branchMatch = PATTERNS.BRANCH.exec(line);
      if (branchMatch?.[1]) branch = branchMatch[1];
      const aheadMatch = PATTERNS.AHEAD.exec(line);
      const behindMatch = PATTERNS.BEHIND.exec(line);
      if (aheadMatch?.[1]) ahead = parseInt(aheadMatch[1]);
      if (behindMatch?.[1]) behind = parseInt(behindMatch[1]);
    } else {
      const st = line.substring(0, 2);
      if (st === ' M') modified++;
      else if (st === 'M ' || st === 'A ') staged++;
      else if (st === '??') untracked++;
    }
  }
  
  return { branch, ahead, behind, modified, staged, untracked };
}

function formatGitStatus(counts, config) {
  const { COLORS, ICONS } = config;
  
  return {
    ahead: counts.ahead > 0 ? `${COLORS.GIT_AHEAD}${ICONS.GIT_AHEAD} ${counts.ahead}${COLORS.RESET}` : '',
    behind: counts.behind > 0 ? `${COLORS.GIT_BEHIND}${ICONS.GIT_BEHIND} ${counts.behind}${COLORS.RESET}` : '',
    untracked: counts.untracked > 0 ? `${COLORS.GIT_UNTRACKED}${ICONS.GIT_UNTRACKED} ${counts.untracked}${COLORS.RESET}` : '',
    staged: counts.staged > 0 ? `${COLORS.GIT_STAGED}${ICONS.GIT_STAGED} ${counts.staged}${COLORS.RESET}` : ''
  };
}

function getGitInfo(cwd, config) {
  const status = safeExec('git status --porcelain=v1 --branch', cwd);
  if (!status) return null;
  
  const parsed = parseGitStatus(status);
  const formatted = formatGitStatus(parsed, config);
  
  return {
    branch: parsed.branch,
    ...formatted
  };
}

module.exports = {
  safeExec,
  parseGitStatus,
  formatGitStatus,
  getGitInfo
};
