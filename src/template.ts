import type { TemplateVariables } from './types.js';

const ALLOWED_TEMPLATE_KEYS = new Set([
  'PROJECT_NAME',
  'PACKAGE_MANAGER', 
  'RUNTIME',
  'TIMESTAMP',
  'PROJECT_PATH',
  'VERSION_CONTROL',
  'FRAMEWORK',
  'PURPOSE',
  'GIT_REMOTE_URL',
  'USER_NAME',
  'USER_EMAIL',
  'HAS_FRAMEWORK',
  'HAS_PACKAGE_MANAGER',
  'HAS_GIT'
]);

const MAX_VALUE_LENGTH = 1000;
const MAX_ITERATIONS = 100;

function sanitizeValue(value: unknown): string {
  if (value === null || value === undefined) return '';
  if (typeof value === 'boolean') return value ? 'true' : '';
  if (typeof value !== 'string') return String(value).slice(0, MAX_VALUE_LENGTH);
  
  return value
    .slice(0, MAX_VALUE_LENGTH)
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
    .replace(/\\/g, '\\\\')
    .replace(/\{\{/g, '\\{\\{')
    .replace(/\}\}/g, '\\}\\}');
}

export function renderTemplate(
  template: string,
  variables: TemplateVariables
): string {
  let result = template;
  let iterations = 0;
  
  const processConditionals = (text: string): string => {
    return text.replace(/\{\{#(\w+)\}\}((?:(?!\{\{\/\1\}\}).)*?)\{\{\/\1\}\}/gs, (_match, key, content) => {
      if (!ALLOWED_TEMPLATE_KEYS.has(key)) return '';
      
      const value = variables[key as keyof TemplateVariables];
      return value ? content : '';
    });
  };
  
  const processVariables = (text: string): string => {
    return text.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      if (!ALLOWED_TEMPLATE_KEYS.has(key)) return match;
      
      const value = variables[key as keyof TemplateVariables];
      return sanitizeValue(value);
    });
  };
  
  let previousResult = '';
  while (previousResult !== result && iterations++ < MAX_ITERATIONS) {
    previousResult = result;
    result = processConditionals(result);
    result = processVariables(result);
  }
  
  if (iterations >= MAX_ITERATIONS) {
    throw new Error('Template rendering exceeded maximum iterations - possible infinite loop');
  }
  
  return result;
}

export function validateTemplateVariables(variables: TemplateVariables): TemplateVariables {
  type MutableTemplateVariables = {
    -readonly [K in keyof TemplateVariables]: TemplateVariables[K];
  };
  
  const validated: MutableTemplateVariables = {
    PROJECT_NAME: '',
    PACKAGE_MANAGER: '',
    RUNTIME: '',
    TIMESTAMP: '',
    VERSION_CONTROL: '',
    FRAMEWORK: ''
  };
  
  for (const [key, value] of Object.entries(variables)) {
    if (!ALLOWED_TEMPLATE_KEYS.has(key)) continue;
    
    switch (key) {
      case 'TIMESTAMP':
        if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(value)) {
          validated.TIMESTAMP = value;
        }
        break;
        
      case 'USER_EMAIL':
        if (typeof value === 'string' && value.includes('@') && value.length < 100) {
          validated.USER_EMAIL = value;
        }
        break;
        
      case 'HAS_FRAMEWORK':
        if (typeof value === 'boolean') {
          validated.HAS_FRAMEWORK = value;
        }
        break;
        
      case 'HAS_PACKAGE_MANAGER':
        if (typeof value === 'boolean') {
          validated.HAS_PACKAGE_MANAGER = value;
        }
        break;
        
      case 'HAS_GIT':
        if (typeof value === 'boolean') {
          validated.HAS_GIT = value;
        }
        break;
        
      case 'PROJECT_NAME':
      case 'PACKAGE_MANAGER':
      case 'RUNTIME':
      case 'VERSION_CONTROL':
      case 'FRAMEWORK':
        if (typeof value === 'string' && value.length < MAX_VALUE_LENGTH) {
          validated[key] = value;
        }
        break;
        
      case 'GIT_REMOTE_URL':
      case 'USER_NAME':
      case 'PROJECT_PATH':
      case 'PURPOSE':
        if (typeof value === 'string' && value.length < MAX_VALUE_LENGTH) {
          validated[key] = value;
        }
        break;
    }
  }
  
  return validated as TemplateVariables;
}
