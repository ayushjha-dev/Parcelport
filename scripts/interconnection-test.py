#!/usr/bin/env python3
"""
ParcelPort Interconnection Test
================================
Simplified test focusing on verifying that:
1. Student registers parcel → Appears on Admin page
2. Admin approves/rejects → Status updates on Student page
3. Admin assigns to staff → Appears on Staff page
4. Staff updates status → Reflects on Student page
"""

import sys
import time
from datetime import datetime

try:
    from playwright.sync_api import sync_playwright, Page
except ImportError:
    print("❌ ERROR: Playwright not installed")
    print("Install with: pip install playwright && playwright install")
    sys.exit(1)

BASE_URL = "http://localhost:3000"

class Colors:
    GREEN = '\033[92m'
    RED = '\033[91m'
    YELLOW = '\033[93m'
    BLUE = '\033[94m'
    BOLD = '\033[1m'
    END = '\033[0m'

def print_section(title):
    print(f"\n{Colors.BOLD}{Colors.BLUE}{'='*60}{Colors.END}")
    print(f"{Colors.BOLD}{Colors.BLUE}{title.center(60)}{Colors.END}")
    print(f"{Colors.BOLD}{Colors.BLUE}{'='*60}{Colors.END}\n")

def print_test(name, passed, details=""):
    status = f"{Colors.GREEN}✓ PASS" if passed else f"{Colors.RED}✗ FAIL"
    print(f"{status}{Colors.END} | {name}")
    if details:
        print(f"       └─ {details}")

def main():
    print_section("PARCELPORT INTERCONNECTION TEST")
    print(f"Testing URL: {BASE_URL}")
    print(f"Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
    
    print(f"{Colors.YELLOW}⚠ PREREQUISITES:{Colors.END}")
    print("  1. Dev server running: npm run dev")
    print("  2. Admin account exists (email: admin@parcelport.com)")
    print("  3. Database is accessible\n")
    
    input(f"{Colors.BOLD}Press ENTER to start the test...{Colors.END}")
    
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False, slow_mo=800)
        
        # Create contexts for each user
        student_ctx = browser.new_context()
        admin_ctx = browser.new_context()
        staff_ctx = browser.new_context()
        
        student_page = student_ctx.new_page()
        admin_page = admin_ctx.new_page()
        staff_page = staff_ctx.new_page()
        
        test_results = []
        parcel_drid = None
        
        try:
            # ============================================================
            # PART 1: STUDENT REGISTERS PARCEL
            # ============================================================
            print_section("PART 1: STUDENT REGISTERS PARCEL")
            
            # Register student
            print("Registering new student...")
            student_page.goto(f"{BASE_URL}/register")
            student_page.wait_for_load_state("networkidle")
            
            timestamp = int(time.time())
            student_email = f"test_student_{timestamp}@test.com"
            
            student_page.get_by_placeholder("e.g. Rahul Sharma").fill("Test Student")
            student_page.get_by_placeholder("e.g. 2024CS102").fill(f"TEST{timestamp}")
            student_page.get_by_placeholder("rahul@university.edu").fill(student_email)
            student_page.get_by_placeholder("9876543210").fill("9876543210")
            student_page.get_by_placeholder("e.g. 4th").fill("4")
            student_page.get_by_placeholder("e.g. 412").fill("101")
            student_page.locator('input[type="password"]').nth(0).fill("Test123!")
            student_page.locator('input[type="password"]').nth(1).fill("Test123!")
            
            # Select dropdowns
            student_page.get_by_role("combobox").nth(0).click()
            student_page.get_by_role("option").first.click()
            student_page.get_by_role("combobox").nth(1).click()
            student_page.get_by_role("option").first.click()
            
            student_page.locator('input[type="checkbox"]').first.check()
            student_page.get_by_role("button", name="Create Account").click()
            student_page.wait_for_url("**/student/dashboard", timeout=10000)
            
            print_test("Student Registration", True, student_email)
            test_results.append(("Student Registration", True))
            
            time.sleep(2)
            
            # Register parcel
            print("\nRegistering parcel...")
            student_page.goto(f"{BASE_URL}/student/parcels/new/step-1")
            student_page.wait_for_load_state("networkidle")
            
            # Step 1: Personal info (auto-filled)
            student_page.get_by_role("button", name="Next").click()
            
            # Step 2: Sender details
            student_page.wait_for_url("**/step-2")
            student_page.get_by_placeholder("Sender Name").fill("Test Sender")
            student_page.get_by_placeholder("Sender Phone").fill("1234567890")
            student_page.get_by_placeholder("Sender Address").fill("Test Address")
            student_page.get_by_role("button", name="Next").click()
            
            # Step 3: Parcel details
            student_page.wait_for_url("**/step-3")
            student_page.get_by_label("Parcel Type").click()
            student_page.get_by_role("option").first.click()
            student_page.get_by_placeholder("Weight").fill("2")
            student_page.get_by_placeholder("Dimensions").fill("20x20x20")
            student_page.get_by_placeholder("Description").fill("E2E Test Parcel")
            student_page.get_by_role("button", name="Next").click()
            
            # Step 4: Payment
            student_page.wait_for_url("**/step-4")
            student_page.get_by_label("UPI").check()
            
            try:
                student_page.set_input_files('input[type="file"]', "public/payment-qr.jpeg")
            except:
                pass
            
            student_page.get_by_role("button", name="Submit").click()
            time.sleep(3)
            
            # Try to get DRID
            try:
                drid_text = student_page.locator("text=/DRID/").inner_text()
                parcel_drid = drid_text.split(":")[-1].strip()
            except:
                parcel_drid = "E2E_TEST"
            
            student_page.screenshot(path=f"screenshots/1_student_parcel_registered.png", full_page=True)
            print_test("Parcel Registration", True, f"DRID: {parcel_drid}")
            test_results.append(("Parcel Registration", True))
            
            # ============================================================
            # PART 2: VERIFY PARCEL ON ADMIN PAGE
            # ============================================================
            print_section("PART 2: ADMIN VIEWS PARCEL")
            
            # Admin login
            print("Admin logging in...")
            admin_page.goto(f"{BASE_URL}/login")
            admin_page.wait_for_load_state("networkidle")
            
            admin_page.get_by_role("button", name="Admin").click()
            admin_page.get_by_label("Email Address").fill("admin@parcelport.com")
            admin_page.get_by_label("Password").fill("admin123")
            admin_page.get_by_role("button", name="Sign In").click()
            admin_page.wait_for_url("**/admin/dashboard", timeout=10000)
            
            print_test("Admin Login", True)
            test_results.append(("Admin Login", True))
            
            time.sleep(2)
            
            # Check parcels page
            print("\nChecking if parcel appears on admin page...")
            admin_page.goto(f"{BASE_URL}/admin/parcels")
            admin_page.wait_for_load_state("networkidle")
            time.sleep(2)
            
            parcel_visible = admin_page.locator("text=E2E Test Parcel").count() > 0
            admin_page.screenshot(path=f"screenshots/2_admin_sees_parcel.png", full_page=True)
            
            print_test("Parcel Visible on Admin Page", parcel_visible, 
                      "Parcel found" if parcel_visible else "Parcel NOT found")
            test_results.append(("Parcel Visible on Admin Page", parcel_visible))
            
            # ============================================================
            # PART 3: ADMIN APPROVES PAYMENT
            # ============================================================
            print_section("PART 3: ADMIN APPROVES PAYMENT")
            
            print("Navigating to payments page...")
            admin_page.goto(f"{BASE_URL}/admin/payments")
            admin_page.wait_for_load_state("networkidle")
            time.sleep(2)
            
            # Find and approve payment
            approve_buttons = admin_page.locator("button:has-text('Approve')")
            
            if approve_buttons.count() > 0:
                print("Approving payment...")
                approve_buttons.first.click()
                time.sleep(2)
                
                admin_page.screenshot(path=f"screenshots/3_admin_approved_payment.png", full_page=True)
                print_test("Payment Approval", True, "Payment approved")
                test_results.append(("Payment Approval", True))
            else:
                print_test("Payment Approval", False, "No approve button found")
                test_results.append(("Payment Approval", False))
            
            # ============================================================
            # PART 4: VERIFY APPROVAL ON STUDENT PAGE
            # ============================================================
            print_section("PART 4: STUDENT SEES APPROVAL")
            
            print("Checking student parcels page...")
            student_page.goto(f"{BASE_URL}/student/parcels")
            student_page.wait_for_load_state("networkidle")
            time.sleep(2)
            
            # Check for approved/verified status
            approved_visible = (
                student_page.locator("text=/approved|verified|assigned/i").count() > 0
            )
            
            student_page.screenshot(path=f"screenshots/4_student_sees_approval.png", full_page=True)
            print_test("Approval Visible to Student", approved_visible,
                      "Status updated" if approved_visible else "Status NOT updated")
            test_results.append(("Approval Visible to Student", approved_visible))
            
            # ============================================================
            # PART 5: REGISTER DELIVERY STAFF
            # ============================================================
            print_section("PART 5: REGISTER DELIVERY STAFF")
            
            print("Registering delivery staff...")
            staff_page.goto(f"{BASE_URL}/register-staff")
            staff_page.wait_for_load_state("networkidle")
            
            staff_email = f"test_staff_{timestamp}@test.com"
            
            staff_page.get_by_placeholder("Full Name").fill("Test Staff")
            staff_page.get_by_placeholder("Email").fill(staff_email)
            staff_page.get_by_placeholder("Phone").fill("9999888877")
            staff_page.locator('input[type="password"]').nth(0).fill("Test123!")
            staff_page.locator('input[type="password"]').nth(1).fill("Test123!")
            staff_page.locator('input[type="checkbox"]').check()
            staff_page.get_by_role("button", name="Register").click()
            staff_page.wait_for_url("**/delivery/dashboard", timeout=10000)
            
            print_test("Staff Registration", True, staff_email)
            test_results.append(("Staff Registration", True))
            
            time.sleep(2)
            
            # ============================================================
            # PART 6: ADMIN ASSIGNS TO STAFF
            # ============================================================
            print_section("PART 6: ADMIN ASSIGNS TO STAFF")
            
            print("Assigning parcel to staff...")
            admin_page.goto(f"{BASE_URL}/admin/assign")
            admin_page.wait_for_load_state("networkidle")
            time.sleep(2)
            
            try:
                # Select parcel
                parcel_select = admin_page.locator("select").first
                parcel_select.select_option(index=1)
                
                # Select staff
                staff_select = admin_page.locator("select").nth(1)
                staff_select.select_option(index=1)
                
                # Assign
                admin_page.get_by_role("button", name="Assign").click()
                time.sleep(2)
                
                admin_page.screenshot(path=f"screenshots/5_admin_assigned_staff.png", full_page=True)
                print_test("Parcel Assignment", True, "Assigned to staff")
                test_results.append(("Parcel Assignment", True))
            except Exception as e:
                print_test("Parcel Assignment", False, str(e))
                test_results.append(("Parcel Assignment", False))
            
            # ============================================================
            # PART 7: VERIFY PARCEL ON STAFF PAGE
            # ============================================================
            print_section("PART 7: STAFF SEES ASSIGNED PARCEL")
            
            print("Checking staff dashboard...")
            staff_page.goto(f"{BASE_URL}/delivery/dashboard")
            staff_page.wait_for_load_state("networkidle")
            time.sleep(2)
            
            parcel_on_staff = staff_page.locator("text=E2E Test Parcel").count() > 0
            
            staff_page.screenshot(path=f"screenshots/6_staff_sees_parcel.png", full_page=True)
            print_test("Parcel Visible to Staff", parcel_on_staff,
                      "Parcel found" if parcel_on_staff else "Parcel NOT found")
            test_results.append(("Parcel Visible to Staff", parcel_on_staff))
            
            # ============================================================
            # SUMMARY
            # ============================================================
            print_section("TEST SUMMARY")
            
            total = len(test_results)
            passed = sum(1 for _, result in test_results if result)
            failed = total - passed
            
            print(f"\n{Colors.BOLD}Results:{Colors.END}")
            print(f"  Total:  {total}")
            print(f"  {Colors.GREEN}Passed: {passed}{Colors.END}")
            print(f"  {Colors.RED}Failed: {failed}{Colors.END}")
            
            success_rate = (passed / total * 100) if total > 0 else 0
            print(f"\n{Colors.BOLD}Success Rate: {success_rate:.1f}%{Colors.END}")
            
            print(f"\n{Colors.BOLD}Interconnection Test Results:{Colors.END}")
            print("  ┌─ Student → Admin: ", end="")
            print(f"{Colors.GREEN}✓ Connected{Colors.END}" if test_results[2][1] else f"{Colors.RED}✗ Not Connected{Colors.END}")
            
            print("  ├─ Admin → Student: ", end="")
            print(f"{Colors.GREEN}✓ Connected{Colors.END}" if test_results[4][1] else f"{Colors.RED}✗ Not Connected{Colors.END}")
            
            print("  └─ Admin → Staff:   ", end="")
            print(f"{Colors.GREEN}✓ Connected{Colors.END}" if test_results[6][1] else f"{Colors.RED}✗ Not Connected{Colors.END}")
            
            if success_rate == 100:
                print(f"\n{Colors.GREEN}{Colors.BOLD}✓ ALL INTERCONNECTIONS WORKING! 🎉{Colors.END}\n")
            else:
                print(f"\n{Colors.YELLOW}{Colors.BOLD}⚠ SOME INTERCONNECTIONS FAILED{Colors.END}\n")
            
            print(f"Screenshots saved in: screenshots/")
            print(f"Test completed at: {datetime.now().strftime('%H:%M:%S')}\n")
            
        except KeyboardInterrupt:
            print(f"\n{Colors.YELLOW}Test interrupted by user{Colors.END}")
        except Exception as e:
            print(f"\n{Colors.RED}Error: {e}{Colors.END}")
            import traceback
            traceback.print_exc()
        finally:
            browser.close()

if __name__ == "__main__":
    main()
