---
name: e2e-verify
description: >
  Verify newly added frontend features by using Playwright MCP to log in as a
  test user and exercise the new UI flows in a real browser. Uses credentials
  from a local config file. Use when the user says "verify the feature",
  "test with playwright", "e2e test", "browser test", "check if it works in
  the browser", "smoke test", "verify the UI", or wants to validate that
  frontend changes actually work end-to-end.
allowed-tools: Read, Grep, Glob, Bash, mcp__playwright
---

# E2E Verification with Playwright

Verify new features by logging in as a test user and exercising the newly
added UI flows in a real browser via the Playwright MCP server.

## Prerequisites

The Playwright MCP server must be connected to your Claude Code session.
Test credentials must exist at `.claude/test-credentials.json`:

```json
{
  "baseUrl": "http://localhost:5173",
  "testUser": {
    "email": "test@test.com",
    "password": "test@123"
  }
}
```

If the credentials file is missing, ask the user to create it before
proceeding. Do NOT hardcode credentials in any output.

## Step 1 — Read Credentials and Identify Scope

1. Read `.claude/test-credentials.json`
2. Determine what to test:
   - If the user describes a specific flow, use that
   - Otherwise, check the git diff for new routes, pages, or components
   - Look for new `<Route>` entries or navigation links

## Step 2 — Launch and Authenticate

1. Navigate to `{baseUrl}/login` (or wherever the login page is — check
   the router config if `/login` doesn't work)
2. Wait for the login form to be visible
3. Fill in the email field with the test user's email
4. Fill in the password field with the test user's password
5. Click the submit/login button
6. Wait for navigation — verify you've landed on the expected post-login
   page (dashboard, home, etc.)
7. **Take a screenshot** after login to confirm success

If login fails, stop and report the issue. Don't proceed with stale or
unauthenticated state.

## Step 3 — Exercise the New Feature

For each new or modified UI flow:

1. **Navigate** to the relevant page
2. **Verify the page loaded**: Check for expected headings, buttons, or
   content. Take a screenshot.
3. **Interact**: Fill forms, click buttons, toggle controls, open
   modals/drawers — exercise the new functionality
4. **Verify outcomes**:
   - Does the expected content appear after an action?
   - Do success toasts/messages show?
   - Does data persist (reload the page and check)?
   - Do form validations trigger on invalid input?
5. **Take screenshots** at each key step

## Step 4 — Check for Regressions

After testing the new feature:

1. Navigate to the main pages of the app (home, list views, settings)
2. Verify they render without visible errors
3. Open the browser console and check for JavaScript errors
4. Take a screenshot of any errors found

## Step 5 — Report Results

```
## E2E Verification Report

**Feature tested**: [name of the feature]
**Date**: YYYY-MM-DD
**Status**: ✅ Pass / ❌ Fail / ⚠️ Partial

### Authentication
- Login: ✅/❌ (screenshot: login-success.png)

### Feature Tests
| Step | Action | Expected | Actual | Status |
|------|--------|----------|--------|--------|
| 1 | Navigate to /events | Events page loads | Events page loaded | ✅ |
| 2 | Click "Create Event" | Modal opens | Modal opened | ✅ |
| 3 | Submit empty form | Validation errors | No validation shown | ❌ |
| ... | ... | ... | ... | ... |

### Regression Checks
- Home page: ✅/❌
- Navigation: ✅/❌
- Console errors: none / (list errors)

### Issues Found
1. **[Severity] Description** — (screenshot reference)
   Steps to reproduce: ...
   Expected: ...
   Actual: ...

### Screenshots
(List of screenshots taken with descriptions)
```

## Step 6 — Optionally Save as Persistent Test

If the user asks, convert the verification into a Playwright test spec:

1. Write the test to the project's e2e test directory (check for `e2e/`,
   `tests/`, or `playwright/` — use whatever exists)
2. Follow existing test conventions in the project
3. Use page object patterns if the project already uses them
4. Include proper `beforeEach` for authentication
5. Name the file: `<feature-name>.spec.ts`

Only do this if explicitly asked — the default is a manual verification run.
