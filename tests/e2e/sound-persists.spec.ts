import { test, expect } from '@playwright/test'

// This test does NOT verify audio output (Playwright can't reliably observe that);
// it verifies the *session* survives client-side navigation: the persistent
// <audio> elements stay mounted as the same DOM nodes across in-app routes.
//
// Prerequisite: a Playwright config + auth fixture must exist. This file
// assumes `pnpm test:e2e` is wired up and that the home page is reachable
// without authentication, or that an auth helper has signed the test session in.

test('audio elements persist across in-app navigation', async ({ page }) => {
  await page.goto('/')

  const yes = page.getByRole('button', { name: 'yes' })
  if (await yes.isVisible({ timeout: 2000 }).catch(() => false)) {
    await yes.click()
  }

  const audioCountBefore = await page.locator('audio').count()
  expect(audioCountBefore).toBe(2)

  await page.evaluate(() => {
    document.querySelectorAll('audio').forEach((a, i) => {
      a.setAttribute('data-test-stamp', `stamp-${i}`)
    })
  })

  await page.getByRole('link', { name: 'today' }).click()
  await expect(page).toHaveURL(/\/today$/)

  const stamps = await page.evaluate(() =>
    Array.from(document.querySelectorAll('audio')).map(a => a.getAttribute('data-test-stamp'))
  )
  expect(stamps).toEqual(['stamp-0', 'stamp-1'])
})
