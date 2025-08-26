import { readFile } from 'node:fs/promises';
import { join, basename } from 'node:path';
import type { ProjectContext, TemplateVariables } from './types.js';
import { detectPackageManager, detectRuntime, detectFramework, exists } from './utils.js';
import { executeQuiet } from './exec.js';
import { withRetry } from './atomic.js';
import { logger } from './logger.js';
import { mapWithLimit } from './concurrency.js';

async function detectPurpose(projectPath: string): Promise<string | undefined> {
  const checks = [
    {
      path: 'package.json',
      parser: (content: string) => {
        try {
          const pkg = JSON.parse(content);
          return pkg.description;
        } catch {
          return undefined;
        }
      }
    },
    {
      path: 'Cargo.toml',
      parser: (content: string) => {
        const match = content.match(/description\s*=\s*"([^"]+)"/);
        return match?.[1];
      }
    },
    {
      path: 'pyproject.toml',
      parser: (content: string) => {
        const match = content.match(/description\s*=\s*"([^"]+)"/);
        return match?.[1];
      }
    },
    {
      path: 'README.md',
      parser: (content: string) => {
        const lines = content.split('\n');
        const descLine = lines.find(line => 
          !line.startsWith('#') && line.trim().length > 10
        );
        return descLine?.trim().slice(0, 200);
      }
    }
  ];

  for (const check of checks) {
    const filePath = join(projectPath, check.path);
    if (await exists(filePath)) {
      try {
        const content = await withRetry(
          async () => await readFile(filePath, 'utf-8'),
          `reading ${check.path}`,
          2
        );
        
        const purpose = check.parser(content);
        if (purpose && typeof purpose === 'string' && purpose.trim()) {
          return purpose.trim();
        }
      } catch (error) {
        logger.debug(`Failed to read ${check.path}`, { 
          error: error instanceof Error ? error.message : String(error) 
        });
      }
    }
  }

  return undefined;
}

async function getGitInfo(projectPath: string): Promise<{
  remoteUrl?: string | undefined;
  userName?: string | undefined;
  userEmail?: string | undefined;
  branch?: string | undefined;
}> {
  const gitCommands = [
    'git config --get remote.origin.url',
    'git config user.name',
    'git config user.email',
    'git rev-parse --abbrev-ref HEAD'
  ];
  
  const results = await mapWithLimit(gitCommands, 2, cmd =>
    executeQuiet(cmd, { cwd: projectPath, timeout: 5000 })
  );
  
  const [remoteUrl, userName, userEmail, branch] = results;
  
  return {
    ...(remoteUrl ? { remoteUrl } : {}),
    ...(userName ? { userName } : {}),
    ...(userEmail ? { userEmail } : {}),
    ...(branch ? { branch } : {})
  };
}

export async function detectProjectContext(projectPath: string): Promise<ProjectContext> {
  logger.info('Detecting project context', { path: projectPath });
  
  const [
    hasGit,
    packageManager,
    runtime,
    hasClaudeDir,
    framework
  ] = await Promise.all([
    exists(join(projectPath, '.git')),
    detectPackageManager(projectPath),
    detectRuntime(projectPath),
    exists(join(projectPath, '.claude')),
    detectFramework(projectPath)
  ]);

  const projectName = basename(projectPath);
  const gitInfo = hasGit ? await getGitInfo(projectPath) : {};
  
  const context: ProjectContext = {
    hasGit,
    packageManager,
    runtime,
    hasClaudeDir,
    projectName,
    framework,
    ...(gitInfo.remoteUrl ? { gitRemoteUrl: gitInfo.remoteUrl } : {})
  };
  
  logger.debug('Project context detected', { 
    projectName: context.projectName,
    runtime: context.runtime,
    framework: context.framework
  });
  return context;
}

function formatVersionControl(
  hasGit: boolean,
  gitRemoteUrl?: string,
  projectPath?: string
): string {
  if (!hasGit) return 'No version control detected';
  
  if (gitRemoteUrl) {
    if (gitRemoteUrl.includes('github.com')) {
      return gitRemoteUrl.replace(/\.git$/, '');
    }
    if (gitRemoteUrl.includes('gitlab.com')) {
      return gitRemoteUrl.replace(/\.git$/, '');
    }
    if (gitRemoteUrl.includes('bitbucket.org')) {
      return gitRemoteUrl.replace(/\.git$/, '');
    }
    return gitRemoteUrl;
  }
  
  return projectPath ? `Local Git repository: ${projectPath}` : 'Local Git repository';
}

function formatRuntime(runtime: string): string {
  const runtimeNames: Record<string, string> = {
    'c/c++': 'C/C++',
    'rust': 'Rust',
    'go': 'Go',
    'python': 'Python',
    'java': 'Java',
    'typescript': 'TypeScript',
    'node': 'Node.js',
    'bun': 'Bun',
    'unknown': 'Unknown'
  };
  
  return runtimeNames[runtime] || runtime.charAt(0).toUpperCase() + runtime.slice(1);
}

export async function getTemplateVariables(
  context: ProjectContext,
  projectPath: string
): Promise<TemplateVariables> {
  logger.info('Building template variables');
  
  const gitInfo = context.hasGit ? await getGitInfo(projectPath) : {};
  const purpose = await detectPurpose(projectPath);
  
  const variables: TemplateVariables = {
    PROJECT_NAME: context.projectName,
    PACKAGE_MANAGER: context.packageManager.toUpperCase(),
    RUNTIME: formatRuntime(context.runtime),
    TIMESTAMP: new Date().toISOString(),
    PROJECT_PATH: projectPath,
    VERSION_CONTROL: formatVersionControl(context.hasGit, context.gitRemoteUrl, projectPath),
    FRAMEWORK: context.framework,
    HAS_FRAMEWORK: context.framework !== 'None',
    HAS_PACKAGE_MANAGER: context.packageManager !== 'none',
    HAS_GIT: context.hasGit,
    ...(context.gitRemoteUrl ? { GIT_REMOTE_URL: context.gitRemoteUrl } : {}),
    ...(gitInfo.userName ? { USER_NAME: gitInfo.userName } : {}),
    ...(gitInfo.userEmail ? { USER_EMAIL: gitInfo.userEmail } : {}),
    ...(purpose ? { PURPOSE: purpose } : {})
  };
  
  logger.debug('Template variables ready', {
    project: variables.PROJECT_NAME,
    runtime: variables.RUNTIME,
    framework: variables.FRAMEWORK
  });
  
  return variables;
}
