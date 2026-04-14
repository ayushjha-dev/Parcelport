# ParcelPort Testing Guide

## Overview

This guide covers end-to-end testing for ParcelPort to verify that Student, Admin, and Staff pages are properly interconnected.

## Quick Start

### 1. Install Prerequisites

```bash
# Install Playwright
pip install playwright
playwright install
```

### 2. Setup

```bash
# Start dev server
npm run dev

# Create admin account (one-time)
npx ts-node scripts/make-admin.ts
```

Default admin credentials:
- Email: `admin@parcelport.com`
- Password: `admin123`

### 3. Run Tests

```bash
# Interconnection test (recommended)
python scripts/interconnection-test.py

# Authentication test
python scripts/auth-e2e.py

# Interactive runner
scripts/run-test.bat    # Windows
./scripts/run-test.sh   # Mac/Linux
```

## Available Tests

### 1. Interconnection Test (`interconnection-test.py`)

Tests the complete data flow between portals:

**What it tests:**
- ✅ Student registers parcel → Appears on Admin page
- ✅ Admin approves payment → Status updates on Student page
- ✅ Admin assigns to staff → Appears on Staff page

**Duration:** ~2-3 minutes

**Output:** Screenshots in `screenshots/` folder

### 2. Authentication Test (`auth-e2e.py`)

Tests user registration and login flow:

**What it tests:**
- ✅ Student registration
- ✅ Login/logout functionality
- ✅ Session management

**Duration:** ~1-2 minutes

## Understanding Results

### Success Output

```
✓ PASS | Student Registration
✓ PASS | Parcel Registration
✓ PASS | Admin Login
✓ PASS | Parcel Visible on Admin Page
✓ PASS | Payment Approval
✓ PASS | Approval Visible to Student
✓ PASS | Staff Registration
✓ PASS | Parcel Assignment
✓ PASS | Parcel Visible to Staff

Interconnection Test Results:
  ┌─ Student → Admin: ✓ Connected
  ├─ Admin → Student: ✓ Connected
  └─ Admin → Staff:   ✓ Connected

✓ ALL INTERCONNECTIONS WORKING! 🎉
```

### Failure Output

```
✓ PASS | Student Registration
✓ PASS | Parcel Registration
✓ PASS | Admin Login
✗ FAIL | Parcel Visible on Admin Page
       └─ Parcel NOT found

Interconnection Test Results:
  ┌─ Student → Admin: ✗ Not Connected
```

## Screenshots

Tests automatically capture screenshots at each step:

- `1_student_parcel_registered.png` - After student registers parcel
- `2_admin_sees_parcel.png` - Admin viewing parcels
- `3_admin_approved_payment.png` - After payment approval
- `4_student_sees_approval.png` - Student sees updated status
- `5_admin_assigned_staff.png` - Assignment page
- `6_staff_sees_parcel.png` - Staff dashboard

## Troubleshooting

### "Playwright not installed"

```bash
pip install playwright
playwright install
```

### "Connection refused"

Make sure dev server is running:
```bash
npm run dev
```

### "Admin login failed"

Create admin account:
```bash
npx ts-node scripts/make-admin.ts
```

Or update credentials in test file (line ~90):
```python
admin_page.get_by_label("Email Address").fill("your_admin@email.com")
admin_page.get_by_label("Password").fill("your_password")
```

### "Element not found"

- UI might have changed
- Check placeholder texts match your forms
- Run with browser visible to debug
- Check screenshots to see what went wrong

### "Payment screenshot not found"

Ensure file exists:
```bash
ls public/payment-qr.jpeg
```

## Customization

### Change Test Speed

Edit test file and modify:
```python
browser = p.chromium.launch(headless=False, slow_mo=800)
```

Options:
- `slow_mo=1500` - Very slow (easy to watch)
- `slow_mo=800` - Default
- `slow_mo=200` - Fast
- `headless=True` - Run without opening browser

### Use Different Admin

Edit `scripts/interconnection-test.py` (around line 90):
```python
admin_page.get_by_label("Email Address").fill("your_email@here.com")
admin_page.get_by_label("Password").fill("your_password")
```

## Test Workflow

```
Student registers parcel
         ↓
    Appears on Admin page
         ↓
    Admin approves/rejects
         ↓
    Status updates on Student page
         ↓
    Admin assigns to Staff
         ↓
    Appears on Staff page
```

## Best Practices

1. **Run tests regularly** - After any code changes
2. **Check screenshots** - They help debug failures
3. **Keep test data clean** - Tests create new users each time
4. **Update selectors** - When UI changes, update test selectors
5. **Test edge cases** - Invalid data, missing fields, etc.

## CI/CD Integration

Example GitHub Actions workflow:

```yaml
name: E2E Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - uses: actions/setup-python@v2
      
      - name: Install dependencies
        run: |
          npm install
          pip install playwright
          playwright install
      
      - name: Start dev server
        run: npm run dev &
      
      - name: Wait for server
        run: sleep 10
      
      - name: Run tests
        run: python scripts/interconnection-test.py
```

## Support

For issues or questions:
1. Check screenshots in `screenshots/` folder
2. Run with `headless=False` to watch the test
3. Review console output for error messages
4. Check that all prerequisites are met

---

**Happy Testing! 🚀**
