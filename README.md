# WordPress 7.0 Automated Test Runner

Runs 123 test steps against a WordPress 7.0 beta site using Playwright. Produces a JSON results file you can view in the included HTML reporter.

The test steps are based on the Make WordPress Test team's call for testing:

- [Help Test WordPress 7.0](https://make.wordpress.org/test/2026/02/20/help-test-wordpress-7-0/)
- [Test Scrub Schedule for WordPress 7.0](https://make.wordpress.org/test/2026/02/17/test-scrub-schedule-for-wordpress-7-0/)

## Quick start

```bash
git clone <this-repo>
cd wp7-test-automation
npm install
npm run setup
node run-tests.mjs https://your-staging-site.com admin your-password
```

Results land in `results/wp7-results.json`. Open `reporter.html` in a browser and click **Import Results** to view them.

## Authentication

**Standard login (most sites):**

```bash
node run-tests.mjs https://yoursite.com admin password
```

The runner logs in via `/wp-login.php` with the username and password you provide.

**Sites with 2FA, CAPTCHA, or SSO:**

Export cookies from a manual browser session first:

```bash
node export-cookies.mjs https://yoursite.com
# A browser opens — log in however you need to
# Press Enter in the terminal when done
node run-tests.mjs https://yoursite.com admin password --cookies cookies.json
```

The runner tries cookies first, then falls back to form login if they're expired.

## CLI flags

| Flag | Default | Description |
|------|---------|-------------|
| `--cookies <path>` | `./cookies.json` | Path to a cookie file for pre-authenticated sessions |
| `--headless` | off (headed) | Run the browser without a visible window |
| `--output <path>` | `./results/wp7-results.json` | Where to save the results JSON |
| `--screenshots <dir>` | `./results/screenshots/` | Where to save test screenshots |
| `--help` | | Show usage info |

## Viewing results

1. Open `reporter.html` in any browser
2. Click **Import Results**
3. Select your `results/wp7-results.json` file
4. Review pass/fail/skip status for each of the 123 steps

## What's tested

The runner checks 14 areas across 123 steps:

| Section | Steps | What it covers |
|---------|-------|---------------|
| General checklist | 20 | REST API, sitemaps, JS errors, console errors, admin screens |
| Admin improvements | 7 | Settings pages, editor workflows, responsive admin |
| New blocks | 10 | Breadcrumbs, Tabs block insertion and frontend rendering |
| Font library | 8 | Typography panel, font activation |
| Visual revisions | 13 | Revision UI, highlighting, navigation |
| Responsive editing | 7 | Viewport switching, List View interactions |
| Navigation overlay | 5 | Nav block overlay settings, mobile hamburger menu |
| Block updates | 7 | Core block modifications |
| Client-side media | 3 | Image upload (JPEG, PNG, WebP) |
| Pattern scenarios 1-4 | 31 | Pattern editing, template parts, nested patterns, multi-select |
| Real-time collaboration | 14 | Manual only (requires multiple simultaneous users) |

## Known limitations

Some steps are skipped because they can't be automated:

- **Real-time collaboration** (14 steps) — requires multiple users editing simultaneously
- **Custom PHP blocks** (7 steps) — requires server-side block registration
- **Subjective assessments** (6 steps) — "does this feel clear?" type checks
- **Server-side checks** (5 steps) — PHP error logs, cron jobs, service integrations
- **Accessibility** (2 steps) — screen reader and keyboard navigation testing
- **Cross-browser** (1 step) — needs Safari/Firefox runs
- **Visual font rendering** (2 steps) — needs human eyes

## Hosting notes

The runner works on any WordPress 7.0 site. A few environment-specific tips:

- **GoDaddy/wpsec CAPTCHA**: Use `export-cookies.mjs` to bypass the CAPTCHA
- **Flywheel/WP Engine**: Standard login works. If SSO is required, use cookie export
- **Pantheon**: Use the dev/test environment URL directly
- **Local/DDEV/Lando**: Works out of the box with local URLs (`http://localhost:8080`)
- **Cloudflare-protected sites**: Cookie export captures the `__cf_bm` token automatically

## Requirements

- Node.js 18+
- npm
- A WordPress 7.0 beta staging site with admin access
