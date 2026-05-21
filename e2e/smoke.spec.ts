import { test, expect, type Page } from '@playwright/test'

// Smoke tests cover the unauthenticated surface. They assert pages render,
// forms are present, redirects work, and the browser console stays clean.
// Authenticated flows are covered separately once a test fixture exists.

// Console errors caused by third-party scripts that aren't available outside
// Vercel (Speed Insights). These are expected when running `next start`
// locally and aren't a regression we care about.
const IGNORED_ERROR_PATTERNS = [/\/_vercel\//, /speed-insights/i]

function watchConsole(page: Page) {
  const errors: string[] = []
  const push = (text: string) => {
    if (IGNORED_ERROR_PATTERNS.some((re) => re.test(text))) return
    // Bare "Failed to load resource" messages from the browser console carry
    // no URL — the matching response listener already records the URL, so we
    // drop the duplicate console line.
    if (/Failed to load resource/i.test(text)) return
    errors.push(text)
  }
  page.on('console', (msg) => {
    if (msg.type() === 'error') push(msg.text())
  })
  page.on('pageerror', (err) => push(err.message))
  page.on('response', (res) => {
    if (res.status() >= 400) push(`HTTP ${res.status()} ${res.url()}`)
  })
  return errors
}

test.describe('public surface', () => {
  test('home renders sign-in entry', async ({ page }) => {
    const errors = watchConsole(page)
    await page.goto('/')
    // Either the landing pitch or the redirect target should be visible.
    await expect(page.locator('body')).toContainText(/mornings/i)
    expect(errors, errors.join('\n')).toHaveLength(0)
  })

  test('login page renders the form', async ({ page }) => {
    const errors = watchConsole(page)
    await page.goto('/login')
    await expect(page.getByPlaceholder('your email')).toBeVisible()
    await expect(page.getByPlaceholder('password')).toBeVisible()
    await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible()
    expect(errors, errors.join('\n')).toHaveLength(0)
  })

  test('signup page renders the form', async ({ page }) => {
    const errors = watchConsole(page)
    await page.goto('/signup')
    await expect(page.getByPlaceholder('your email')).toBeVisible()
    await expect(page.getByPlaceholder(/password/i).first()).toBeVisible()
    expect(errors, errors.join('\n')).toHaveLength(0)
  })

  test('about page renders', async ({ page }) => {
    const errors = watchConsole(page)
    await page.goto('/about')
    await expect(page.locator('body')).toContainText(/mornings/i)
    expect(errors, errors.join('\n')).toHaveLength(0)
  })

  test('privacy + terms render', async ({ page }) => {
    for (const path of ['/legal/privacy', '/legal/terms']) {
      const errors = watchConsole(page)
      await page.goto(path)
      await expect(page.locator('main').first()).toBeVisible()
      expect(errors, `${path}: ${errors.join('\n')}`).toHaveLength(0)
    }
  })

  test('today redirects unauthenticated visitors to login', async ({ page }) => {
    await page.goto('/today')
    await expect(page).toHaveURL(/\/login/)
  })

  test('forgot password page renders', async ({ page }) => {
    const errors = watchConsole(page)
    await page.goto('/forgot')
    await expect(page.getByPlaceholder(/email/i)).toBeVisible()
    expect(errors, errors.join('\n')).toHaveLength(0)
  })

  test('login form validates empty submit', async ({ page }) => {
    await page.goto('/login')
    await page.getByRole('button', { name: /sign in/i }).click()
    // Native required attribute should keep us on /login.
    await expect(page).toHaveURL(/\/login/)
  })
})
