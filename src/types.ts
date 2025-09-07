export type PackageManager = 'npm' | 'pnpm' | 'bun' | 'yarn' | 'pip' | 'poetry' | 'uv' | 'none';
export type Runtime = 'rust' | 'go' | 'python' | 'java' | 'c/c++' | 'bun' | 'typescript' | 'node' | 'unknown';

export enum ErrorCode {
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
  SKELETON_FILES_MISSING = 'SKELETON_FILES_MISSING',
  INVALID_TARGET_DIRECTORY = 'INVALID_TARGET_DIRECTORY',
  NO_WRITE_PERMISSION = 'NO_WRITE_PERMISSION',
  FILE_COPY_FAILED = 'FILE_COPY_FAILED',
  VALIDATION_FAILED = 'VALIDATION_FAILED',
  INTERRUPTED = 'INTERRUPTED',
  SECURITY_PATH_TRAVERSAL = 'SECURITY_PATH_TRAVERSAL',
  RACE_CONDITION_DETECTED = 'RACE_CONDITION_DETECTED',
  BACKUP_VERIFICATION_FAILED = 'BACKUP_VERIFICATION_FAILED',
  TEMP_DIR_CREATION_FAILED = 'TEMP_DIR_CREATION_FAILED'
}

export interface ProjectContext {
  hasGit: boolean;
  packageManager: PackageManager;
  runtime: Runtime;
  hasClaudeDir: boolean;
  gitRemoteUrl?: string;
  projectName: string;
  framework: string;
}

export interface TemplateVariables {
  PROJECT_NAME: string;
  PACKAGE_MANAGER: string;
  RUNTIME: string;
  TIMESTAMP: string;
  GIT_REMOTE_URL?: string;
  USER_NAME?: string;
  USER_EMAIL?: string;
  PROJECT_PATH?: string;
  VERSION_CONTROL: string;
  FRAMEWORK: string;
  PURPOSE?: string;
  PROJECT_IMPORTS?: string;
  HAS_FRAMEWORK?: boolean;
  HAS_PACKAGE_MANAGER?: boolean;
  HAS_GIT?: boolean;
}
