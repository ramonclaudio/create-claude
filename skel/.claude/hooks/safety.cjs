const { readFileSync, existsSync } = require('node:fs');
const { join } = require('node:path');

let toolCall = {};
try {
  const input = readFileSync(process.stdin.fd, 'utf-8');
  if (input.length > 50000) {
    console.error('BLOCKED: Input too large');
    process.exit(1);
  }
  
  toolCall = JSON.parse(input);
  
  if (!toolCall || typeof toolCall !== 'object') {
    console.error('BLOCKED: Invalid tool call structure');
    process.exit(1);
  }
  
  if (typeof toolCall.tool_name !== 'string' || toolCall.tool_name.length > 100) {
    console.error('BLOCKED: Invalid tool name');
    process.exit(1);
  }
  
  toolCall.tool_name = toolCall.tool_name.replace(/[^a-zA-Z0-9_-]/g, '');
  
} catch (error) {
  if (error.code === 'EAGAIN' || error.code === 'ENOTTY' || error.code === 'EINVAL') {
    process.exit(0);
  }
  console.error('BLOCKED: Failed to parse tool call input');
  process.exit(1);
}

const { tool_name, tool_input } = toolCall;

function loadPermissions() {
  const settingsPath = join(process.env.CLAUDE_PROJECT_DIR || process.cwd(), '.claude', 'settings.local.json');
  
  if (!existsSync(settingsPath)) {
    console.error('BLOCKED: settings.local.json not found');
    process.exit(1);
  }

  try {
    const settings = JSON.parse(readFileSync(settingsPath, 'utf-8'));
    return settings.permissions || {};
  } catch (error) {
    console.error('BLOCKED: Cannot parse settings.local.json');
    process.exit(1);
  }
}

function matchesPatterns(toolCall, patterns) {
  if (!Array.isArray(patterns)) return false;
  
  const { tool_name, tool_input } = toolCall;
  
  for (const pattern of patterns) {
    if (typeof pattern !== 'string' || pattern.length > 200) continue;
    
    if (pattern === '*') return true;
    if (pattern === tool_name) return true;
    
    if (pattern.includes('*') && pattern.includes('(') && pattern.includes(')')) {
      const parenIndex = pattern.indexOf('(');
      const closeParenIndex = pattern.lastIndexOf(')');
      
      if (parenIndex === -1 || closeParenIndex === -1 || closeParenIndex <= parenIndex) continue;
      
      const toolPart = pattern.substring(0, parenIndex);
      const argPart = pattern.substring(parenIndex + 1, closeParenIndex);
      
      if (toolPart === tool_name || toolPart === '*') {
        if (!argPart) return true;
        
        const escapedArgPattern = argPart
          .replace(/[.+?^${}()|[\]\\]/g, '\\$&')
          .replace(/\\\*/g, '.*');
        
        const argToCheck = getArgForTool(tool_name, tool_input);
        
        if (argToCheck) {
          try {
            if (escapedArgPattern.length <= 100) {
              const regex = new RegExp(escapedArgPattern, 'i');
              if (regex.test(argToCheck)) {
                return true;
              }
            }
          } catch (e) {
            continue;
          }
        }
      }
    }
  }
  
  return false;
}

function getArgForTool(toolName, toolInput) {
  if (!toolInput) return '';
  
  switch (toolName) {
    case 'Bash':
      return toolInput.command || '';
    case 'Read':
    case 'Edit':
    case 'Write':
    case 'MultiEdit':
      return toolInput.file_path || '';
    default:
      return JSON.stringify(toolInput);
  }
}

const permissions = loadPermissions();

if (matchesPatterns(toolCall, permissions.deny)) {
  console.error(`BLOCKED: Operation denied by settings - ${tool_name}${tool_input ? ` ${getArgForTool(tool_name, tool_input)}` : ''}`);
  process.exit(1);
}

if (matchesPatterns(toolCall, permissions.ask)) {
  console.error(`CONFIRMATION REQUIRED: ${tool_name}${tool_input ? ` ${getArgForTool(tool_name, tool_input)}` : ''}`);
  console.error('This operation requires user confirmation. Add to "allow" list in settings.local.json to auto-approve.');
  process.exit(1);
}

if (matchesPatterns(toolCall, permissions.allow)) {
  process.exit(0);
}

const defaultMode = permissions.defaultMode || 'ask';

switch (defaultMode) {
  case 'allow':
    process.exit(0);
  case 'deny':
    console.error(`BLOCKED: Operation denied by default policy - ${tool_name}`);
    process.exit(1);
  case 'ask':
  default:
    console.error(`CONFIRMATION REQUIRED: ${tool_name}${tool_input ? ` ${getArgForTool(tool_name, tool_input)}` : ''}`);
    console.error('Operation not in allow/deny list. Add explicit permission to settings.local.json');
    process.exit(1);
}
