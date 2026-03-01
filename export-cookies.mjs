#!/usr/bin/env node
/**
 * Cookie exporter — opens a browser so you can log in manually,
 * then saves cookies for the test runner to use.
 *
 * Works with any login method: standard, 2FA, CAPTCHA, SSO, passwordless.
 *
 * Usage: node export-cookies.mjs <wp-url>
 */

import { chromium } from 'playwright';
import { writeFileSync } from 'fs';
import { createInterface } from 'readline';

var wpUrl = (process.argv[2] || '').replace(/\/+$/, '');

if (!wpUrl) {
  console.error('Usage: node export-cookies.mjs <wp-url>');
  console.error('Example: node export-cookies.mjs https://staging.example.com');
  process.exit(1);
}

async function main() {
  console.log('Opening browser to ' + wpUrl + '/wp-login.php');
  console.log('Log in manually using any method (password, 2FA, SSO, etc.).\n');

  var browser = await chromium.launch({ headless: false });
  var context = await browser.newContext();
  var page = await context.newPage();

  await page.goto(wpUrl + '/wp-login.php', { waitUntil: 'domcontentloaded', timeout: 30000 });

  var rl = createInterface({ input: process.stdin, output: process.stdout });

  await new Promise(function (resolve) {
    rl.question('Press Enter after you have logged in successfully... ', function () {
      rl.close();
      resolve();
    });
  });

  var cookies = await context.cookies();
  writeFileSync('cookies.json', JSON.stringify(cookies, null, 2));
  console.log('\nSaved ' + cookies.length + ' cookies to cookies.json');
  console.log('Now run: node run-tests.mjs ' + wpUrl + ' <user> <pass> --cookies cookies.json');

  await browser.close();
}

main().catch(function (e) { console.error(e); process.exit(1); });
