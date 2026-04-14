from __future__ import annotations

import random
import string
import sys
import time
from dataclasses import dataclass
from typing import Callable

from playwright.sync_api import Error, TimeoutError, sync_playwright

BASE_URL = "http://localhost:3000"


@dataclass
class StepResult:
  name: str
  passed: bool
  details: str


def random_email() -> str:
  suffix = ''.join(random.choices(string.ascii_lowercase + string.digits, k=10))
  return f"e2e_{suffix}@parcelport.test"


def run_step(name: str, fn: Callable[[], str], results: list[StepResult]) -> bool:
  try:
    details = fn()
    results.append(StepResult(name=name, passed=True, details=details))
    print(f"PASS | {name} | {details}")
    return True
  except Exception as exc:  # noqa: BLE001
    details = str(exc)
    results.append(StepResult(name=name, passed=False, details=details))
    print(f"FAIL | {name} | {details}")
    return False


def wait_for_url_contains(page, needle: str, timeout: int = 15000) -> str:
  page.wait_for_url(f"**{needle}", timeout=timeout)
  return page.url


def main() -> int:
  email = random_email()
  password = "StrongPass1"

  print("=== ParcelPort Auth E2E ===")
  print(f"Base URL: {BASE_URL}")
  print(f"Disposable account: {email}")

  results: list[StepResult] = []

  with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()

    try:
      if not run_step(
        "Open register page",
        lambda: (
          page.goto(f"{BASE_URL}/register", wait_until="networkidle")
          or f"Loaded {page.url}"
        ),
        results,
      ):
        return 1

      if not run_step(
        "Fill register fields",
        lambda: (
          page.get_by_placeholder("e.g. Rahul Sharma").fill("Eee Student")
          or page.get_by_placeholder("e.g. 2024CS102").fill("2026CS999")
          or page.get_by_placeholder("rahul@university.edu").fill(email)
          or page.get_by_placeholder("9876543210").fill("9876543210")
          or page.get_by_placeholder("e.g. 4th").fill("4")
          or page.get_by_placeholder("e.g. 412").fill("412")
          or page.locator('input[type="password"]').nth(0).fill(password)
          or page.locator('input[type="password"]').nth(1).fill(password)
          or "Required text fields populated"
        ),
        results,
      ):
        return 1

      if not run_step(
        "Select register dropdowns",
        lambda: (
          page.get_by_role("combobox").nth(0).click()
          or page.get_by_role("option").nth(0).click()
          or page.get_by_role("combobox").nth(1).click()
          or page.get_by_role("option").nth(0).click()
          or "Course and hostel selected"
        ),
        results,
      ):
        return 1

      if not run_step(
        "Accept terms and submit signup",
        lambda: (
          page.locator('input[type="checkbox"]').first.check()
          or page.get_by_role("button", name="Create Account").click()
          or page.wait_for_timeout(1000)
          or "Submitted register form"
        ),
        results,
      ):
        return 1

      if not run_step(
        "Signup redirect to student dashboard",
        lambda: f"Redirected to {wait_for_url_contains(page, '/student/dashboard')}",
        results,
      ):
        return 1

      if not run_step(
        "Logout after signup",
        lambda: (
          page.get_by_role("button", name="Sign Out").click()
          or f"Redirected to {wait_for_url_contains(page, '/login')}"
        ),
        results,
      ):
        return 1

      if not run_step(
        "Login with disposable account",
        lambda: (
          page.get_by_role("button", name="Student").click()
          or page.get_by_label("Email Address").fill(email)
          or page.get_by_label("Password").fill(password)
          or page.get_by_role("button", name="Sign In").click()
          or f"Submitted login for {email}"
        ),
        results,
      ):
        return 1

      if not run_step(
        "Login redirect to student dashboard",
        lambda: f"Redirected to {wait_for_url_contains(page, '/student/dashboard')}",
        results,
      ):
        return 1

      if not run_step(
        "Logout after login",
        lambda: (
          page.get_by_role("button", name="Sign Out").click()
          or f"Redirected to {wait_for_url_contains(page, '/login')}"
        ),
        results,
      ):
        return 1

      print("\n=== Pass/Fail Matrix ===")
      for row in results:
        status = "PASS" if row.passed else "FAIL"
        print(f"{status:4} | {row.name} | {row.details}")

      failed = [r for r in results if not r.passed]
      if failed:
        return 1

      return 0

    except (TimeoutError, Error) as exc:
      print(f"E2E execution error: {exc}")
      return 1
    finally:
      timestamp = int(time.time())
      screenshot_path = f"e2e-auth-final-{timestamp}.png"
      try:
        page.screenshot(path=screenshot_path, full_page=True)
        print(f"Saved final screenshot: {screenshot_path}")
      except Exception:  # noqa: BLE001
        pass
      browser.close()


if __name__ == "__main__":
  sys.exit(main())
