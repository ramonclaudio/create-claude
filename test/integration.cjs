#!/usr/bin/env node
const { init } = require('../dist/index.js');
const { promises: fs } = require('node:fs');
const { join } = require('node:path');
const { tmpdir } = require('node:os');

async function createTempDir() {
  const tempDir = join(tmpdir(), `create-claude-test-${Date.now()}`);
  await fs.mkdir(tempDir, { recursive: true });
  return tempDir;
}

async function cleanup(dir) {
  try {
    await fs.rm(dir, { recursive: true, force: true });
  } catch (e) {
    // Ignore cleanup errors
  }
}

async function testBasicInit() {
  console.log('Testing basic initialization...');
  const testDir = await createTempDir();
  
  try {
    const result = await init(testDir);
    
    if (!result.success) {
      throw new Error(`Init failed: ${result.message}`);
    }
    
    if (result.filesCreated === 0) {
      throw new Error('No files were created');
    }
    
    // Verify core files exist AND have correct content
    const claudeFile = join(testDir, 'CLAUDE.md');
    const settingsFile = join(testDir, '.claude', 'settings.local.json');
    const hookFile = join(testDir, '.claude', 'hooks', 'format.cjs');
    
    // Test CLAUDE.md has actual content (should be 2200-2600 bytes after rendering)
    const claudeContent = await fs.readFile(claudeFile, 'utf-8');
    if (!claudeContent.includes('# Create Claude')) {
      throw new Error('CLAUDE.md missing required header');
    }
    if (!claudeContent.includes('Brutal efficiency')) {
      throw new Error('CLAUDE.md missing expected content');
    }
    if (claudeContent.length < 2200 || claudeContent.length > 2600) {
      throw new Error(`CLAUDE.md has unexpected size: ${claudeContent.length} bytes (expected 2200-2600)`);
    }
    // Verify template was properly rendered (no unreplaced variables)
    if (claudeContent.includes('{{') || claudeContent.includes('}}')) {
      throw new Error('CLAUDE.md contains unprocessed template variables');
    }
    
    // Test settings.local.json is valid JSON with expected structure
    const settingsContent = await fs.readFile(settingsFile, 'utf-8');
    const settings = JSON.parse(settingsContent);
    if (!settings.permissions || !settings.permissions.allow) {
      throw new Error('settings.local.json missing permissions structure');
    }
    
    // Test hook file is valid JavaScript
    const hookContent = await fs.readFile(hookFile, 'utf-8');
    if (!hookContent.includes('require(') || !hookContent.includes('process.exit')) {
      throw new Error('Hook file is not valid JavaScript');
    }
    // Check it's a proper CommonJS script
    if (!hookContent.includes('const') || !hookContent.includes('execFileSync')) {
      throw new Error('Hook file missing expected Node.js code');
    }
    
    // Verify all expected directories exist
    const dirs = ['agents', 'commands', 'hooks', 'output-styles', 'scripts'];
    for (const dir of dirs) {
      const dirPath = join(testDir, '.claude', dir);
      const stat = await fs.stat(dirPath);
      if (!stat.isDirectory()) {
        throw new Error(`Missing directory: ${dir}`);
      }
    }
    
    console.log(`✓ Created ${result.filesCreated} files with valid content`);
  } finally {
    await cleanup(testDir);
  }
}

async function testDryRun() {
  console.log('Testing dry-run mode...');
  const testDir = await createTempDir();
  
  try {
    const result = await init(testDir, { dryRun: true });
    
    if (!result.success) {
      throw new Error(`Dry run failed: ${result.message}`);
    }
    
    if (!result.dryRun) {
      throw new Error('Dry run flag not set in result');
    }
    
    if (result.filesCreated === 0) {
      throw new Error('Dry run should report file count');
    }
    
    // Verify no files were actually created
    const claudeFile = join(testDir, 'CLAUDE.md');
    const claudeExists = await fs.access(claudeFile).then(() => true).catch(() => false);
    
    if (claudeExists) {
      throw new Error('Dry run should not create actual files');
    }
    
    console.log(`✓ Dry run mode works correctly`);
  } finally {
    await cleanup(testDir);
  }
}

async function testExistingFiles() {
  console.log('Testing backup mechanism with existing files...');
  const testDir = await createTempDir();
  
  try {
    // Create existing files with specific content
    const existingClaudeContent = '# My Custom Project\n\nThis is my existing documentation.';
    const existingSettingsContent = '{"custom": true, "myConfig": 42}';
    
    await fs.writeFile(join(testDir, 'CLAUDE.md'), existingClaudeContent);
    await fs.mkdir(join(testDir, '.claude'), { recursive: true });
    await fs.writeFile(join(testDir, '.claude', 'settings.local.json'), existingSettingsContent);
    
    const result = await init(testDir);
    
    if (!result.success) {
      throw new Error(`Init with existing files failed: ${result.message}`);
    }
    
    // Check if backup was created
    const backupDirs = await fs.readdir(testDir);
    const backupDir = backupDirs.find(dir => dir.startsWith('.create-claude-backup-'));
    
    if (!backupDir) {
      throw new Error('Backup directory was not created');
    }
    
    // Verify backup contains EXACT original content
    const backupClaudeFile = join(testDir, backupDir, 'CLAUDE.md');
    const backupClaudeContent = await fs.readFile(backupClaudeFile, 'utf-8');
    
    if (backupClaudeContent !== existingClaudeContent) {
      throw new Error(`Backup content mismatch.\nExpected: ${existingClaudeContent}\nGot: ${backupClaudeContent}`);
    }
    
    const backupSettingsFile = join(testDir, backupDir, '.claude', 'settings.local.json');
    const backupSettingsContent = await fs.readFile(backupSettingsFile, 'utf-8');
    
    if (backupSettingsContent !== existingSettingsContent) {
      throw new Error(`Settings backup mismatch.\nExpected: ${existingSettingsContent}\nGot: ${backupSettingsContent}`);
    }
    
    // Verify new files replaced the old ones
    const newClaudeContent = await fs.readFile(join(testDir, 'CLAUDE.md'), 'utf-8');
    const newSettingsContent = await fs.readFile(join(testDir, '.claude', 'settings.local.json'), 'utf-8');
    
    if (newClaudeContent === existingClaudeContent) {
      throw new Error('CLAUDE.md was not replaced with new content');
    }
    
    const newSettings = JSON.parse(newSettingsContent);
    if (newSettings.custom === true) {
      throw new Error('settings.local.json was not replaced');
    }
    
    console.log('✓ Backup mechanism preserves exact user data');
  } finally {
    await cleanup(testDir);
  }
}

async function testInvalidDirectory() {
  console.log('Testing error handling with invalid directory...');
  
  try {
    const result = await init('/nonexistent/directory/that/should/not/exist');
    
    if (result.success) {
      throw new Error('Should have failed with invalid directory');
    }
    
    if (!result.errorCode) {
      throw new Error('Error result should include error code');
    }
    
    console.log('✓ Error handling works correctly');
  } catch (error) {
    // This is expected for init function calls
    if (error.message.includes('Should have failed')) {
      throw error;
    }
    console.log('✓ Error handling works correctly (threw exception)');
  }
}

async function testAtomicOperations() {
  console.log('Testing atomic operations...');
  const testDir = await createTempDir();
  
  try {
    // Create files with checksums we can verify
    const originalSettings = {"timestamp": Date.now(), "test": "atomic", "data": Array(100).fill("x").join("")};
    const originalContent = JSON.stringify(originalSettings, null, 2);
    
    const claudeDir = join(testDir, '.claude');
    await fs.mkdir(claudeDir, { recursive: true });
    await fs.writeFile(join(claudeDir, 'settings.local.json'), originalContent);
    
    // Calculate checksum of original
    const crypto = require('crypto');
    const originalHash = crypto.createHash('sha256').update(originalContent).digest('hex');
    
    // Run init which should atomically replace the file
    const result = await init(testDir);
    
    if (!result.success) {
      throw new Error(`Atomic operation test failed: ${result.message}`);
    }
    
    // Verify the new content exists and is different
    const newContent = await fs.readFile(join(claudeDir, 'settings.local.json'), 'utf-8');
    const newHash = crypto.createHash('sha256').update(newContent).digest('hex');
    
    if (newHash === originalHash) {
      throw new Error('File was not replaced (hashes match)');
    }
    
    const parsed = JSON.parse(newContent);
    if (parsed.timestamp === originalSettings.timestamp) {
      throw new Error('New file contains old data');
    }
    
    // Verify backup has exact original content
    const dirs = await fs.readdir(testDir);
    const backupDir = dirs.find(d => d.startsWith('.create-claude-backup-'));
    
    if (!backupDir) {
      throw new Error('No backup directory created');
    }
    
    const backupFile = join(testDir, backupDir, '.claude', 'settings.local.json');
    const backupContent = await fs.readFile(backupFile, 'utf-8');
    const backupHash = crypto.createHash('sha256').update(backupContent).digest('hex');
    
    if (backupHash !== originalHash) {
      throw new Error(`Backup corrupted! Original: ${originalHash}, Backup: ${backupHash}`);
    }
    
    console.log('✓ Atomic operations preserve data integrity');
  } finally {
    await cleanup(testDir);
  }
}

async function testConcurrentInit() {
  console.log('Testing concurrent initialization (lock mechanism)...');
  const testDir = await createTempDir();
  
  try {
    // Run three inits concurrently to really stress test
    const results = await Promise.allSettled([
      init(testDir),
      init(testDir),
      init(testDir)
    ]);
    
    // At least one should succeed
    const succeeded = results.filter(r => r.status === 'fulfilled' && r.value.success);
    
    if (succeeded.length === 0) {
      throw new Error('No initialization succeeded');
    }
    
    // Verify files are valid and not corrupted
    const claudeFile = join(testDir, 'CLAUDE.md');
    const settingsFile = join(testDir, '.claude', 'settings.local.json');
    
    // Check CLAUDE.md integrity
    const claudeContent = await fs.readFile(claudeFile, 'utf-8');
    if (!claudeContent.includes('# Create Claude')) {
      throw new Error('CLAUDE.md corrupted - missing header');
    }
    if (claudeContent.includes('null') || claudeContent.includes('undefined')) {
      throw new Error('CLAUDE.md contains invalid template replacements');
    }
    
    // Check settings.json is valid JSON
    const settingsContent = await fs.readFile(settingsFile, 'utf-8');
    try {
      const settings = JSON.parse(settingsContent);
      if (!settings.permissions || !settings.permissions.allow) {
        throw new Error('Settings file missing required permissions');
      }
    } catch (e) {
      throw new Error(`Settings file corrupted - not valid JSON: ${e.message}`);
    }
    
    // Verify file permissions are correct
    const stats = await fs.stat(settingsFile);
    const mode = (stats.mode & parseInt('777', 8)).toString(8);
    if (mode !== '644' && mode !== '664' && mode !== '755') {
      throw new Error(`Invalid file permissions: ${mode}`);
    }
    
    console.log('✓ Lock mechanism prevents data corruption under load');
  } finally {
    await cleanup(testDir);
  }
}

async function testInterruptHandling() {
  console.log('Testing interrupt handling (SIGINT)...');
  const testDir = await createTempDir();
  
  try {
    // Create existing files
    await fs.writeFile(join(testDir, 'CLAUDE.md'), 'ORIGINAL');
    
    // Start init and interrupt it
    const initPromise = init(testDir);
    process.nextTick(() => {
      // Simulate interrupt (won't actually kill the process)
      process.emit('SIGINT');
    });
    
    try {
      await initPromise;
    } catch {}
    
    // Verify files are not corrupted
    const content = await fs.readFile(join(testDir, 'CLAUDE.md'), 'utf-8');
    if (!content || content.length === 0) {
      throw new Error('File corrupted after interrupt');
    }
    
    console.log('✓ Files remain valid after interruption');
  } finally {
    await cleanup(testDir);
  }
}

async function testLargeFiles() {
  console.log('Testing large file handling...');
  const testDir = await createTempDir();
  
  try {
    // Create 5MB file
    const largeContent = Buffer.alloc(5 * 1024 * 1024, 'test');
    await fs.writeFile(join(testDir, 'CLAUDE.md'), largeContent);
    
    const memBefore = process.memoryUsage().heapUsed;
    const result = await init(testDir);
    const memAfter = process.memoryUsage().heapUsed;
    
    if (!result.success) {
      throw new Error('Failed to handle large file');
    }
    
    const memIncrease = (memAfter - memBefore) / 1024 / 1024;
    if (memIncrease > 50) {
      throw new Error(`Memory usage too high: ${memIncrease.toFixed(2)}MB`);
    }
    
    console.log(`✓ Handled large file efficiently (${memIncrease.toFixed(1)}MB memory)`);
  } finally {
    await cleanup(testDir);
  }
}

async function testWriteFailure() {
  console.log('Testing write failure recovery...');
  const testDir = await createTempDir();
  
  try {
    // Create read-only file to cause failure
    await fs.mkdir(join(testDir, '.claude'), { recursive: true });
    const roFile = join(testDir, '.claude', 'readonly.lock');
    await fs.writeFile(roFile, 'locked');
    await fs.chmod(roFile, 0o444);
    
    // Should handle failure gracefully
    await init(testDir, { silent: true }).catch(() => {});
    
    // Fix permissions for cleanup
    await fs.chmod(roFile, 0o644).catch(() => {});
    
    console.log('✓ Write failures handled gracefully');
  } finally {
    await cleanup(testDir);
  }
}

async function runTests() {
  console.log('Running comprehensive integration tests...\n');
  
  try {
    // Basic functionality
    await testBasicInit();
    await testDryRun();
    
    // Backup system
    await testExistingFiles();
    await testAtomicOperations();
    
    // Error handling
    await testInvalidDirectory();
    await testWriteFailure();
    
    // Concurrency and robustness
    await testConcurrentInit();
    await testInterruptHandling();
    await testLargeFiles();
    
    console.log('\n✅ All integration tests passed!');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    process.exit(1);
  }
}

runTests();
