#!/usr/bin/env node
/**
 * Setup script — installs Playwright's Chromium browser.
 * Run once after npm install.
 */

import { execFileSync } from 'child_process';
import { existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

console.log('Installing Chromium browser for Playwright...\n');
execFileSync('npx', ['playwright', 'install', 'chromium'], { stdio: 'inherit' });

var assetsOk = ['test.png', 'test.jpg', 'test.webp'].every(function (f) {
  return existsSync(join(__dirname, 'test-assets', f));
});

console.log('\nSetup complete.' + (assetsOk ? ' Test assets verified.' : ' Warning: test-assets/ missing.'));
console.log('\nNext steps:');
console.log('  node run-tests.mjs <url> <username> <password>');
console.log('\nIf your site has 2FA or CAPTCHA, export cookies first:');
console.log('  node export-cookies.mjs <url>');
