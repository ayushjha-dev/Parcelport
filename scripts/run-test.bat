@echo off
REM ParcelPort E2E Test Runner for Windows
REM This script helps you run the interconnection tests easily

echo ================================================================
echo          ParcelPort Interconnection Test Runner
echo ================================================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo X Python is not installed. Please install Python 3.7 or higher.
    pause
    exit /b 1
)

echo [OK] Python found
python --version

REM Check if Playwright is installed
python -c "import playwright" >nul 2>&1
if %errorlevel% neq 0 (
    echo.
    echo [!] Playwright is not installed.
    echo.
    set /p install="Would you like to install it now? (y/n): "
    if /i "%install%"=="y" (
        echo Installing Playwright...
        pip install playwright
        playwright install
        echo [OK] Playwright installed successfully
    ) else (
        echo X Cannot run tests without Playwright. Exiting.
        pause
        exit /b 1
    )
) else (
    echo [OK] Playwright is installed
)

REM Check if dev server is running
echo.
echo Checking if dev server is running...
curl -s http://localhost:3000 >nul 2>&1
if %errorlevel% neq 0 (
    echo X Dev server is not running!
    echo.
    echo Please start the dev server in another terminal:
    echo   npm run dev
    echo.
    pause
)

REM Create screenshots directory if it doesn't exist
if not exist "screenshots" (
    mkdir screenshots
    echo [OK] Created screenshots directory
)

REM Show test options
echo.
echo ================================================================
echo                    Select Test Type
echo ================================================================
echo.
echo 1) Interconnection Test (Recommended) - ~2-3 minutes
echo    Tests: Student -^> Admin -^> Staff connections
echo.
echo 2) Full Workflow Test - ~4-5 minutes
echo    Tests: Complete parcel lifecycle with all steps
echo.
echo 3) Authentication Test - ~1-2 minutes
echo    Tests: User registration and login
echo.
set /p choice="Enter your choice (1-3): "

if "%choice%"=="1" (
    echo.
    echo Running Interconnection Test...
    echo ================================================================
    python scripts\interconnection-test.py
) else if "%choice%"=="2" (
    echo.
    echo Running Full Workflow Test...
    echo ================================================================
    python scripts\full-workflow-e2e.py
) else if "%choice%"=="3" (
    echo.
    echo Running Authentication Test...
    echo ================================================================
    python scripts\auth-e2e.py
) else (
    echo Invalid choice. Exiting.
    pause
    exit /b 1
)

echo.
echo ================================================================
echo Test completed!
echo.
echo Screenshots saved in: screenshots\
echo.
echo To run again: scripts\run-test.bat
echo ================================================================
pause
