@echo off
echo.
echo ========================================================
echo     Firebase Storage CORS Fix - Windows Script
echo ========================================================
echo.

REM Check if gsutil is installed
where gsutil >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Google Cloud SDK is not installed!
    echo.
    echo Please install it from:
    echo https://cloud.google.com/sdk/docs/install#windows
    echo.
    echo After installation, run: gcloud auth login
    echo.
    pause
    exit /b 1
)

echo [OK] Google Cloud SDK found!
echo.

REM Check authentication
gcloud auth list >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Not authenticated with Google Cloud.
    echo.
    echo Please run: gcloud auth login
    echo.
    pause
    exit /b 1
)

echo [OK] Authenticated!
echo.

REM Create CORS configuration
echo Creating CORS configuration...
(
echo [
echo   {
echo     "origin": ["*"],
echo     "method": ["GET", "POST", "PUT", "DELETE", "HEAD"],
echo     "maxAgeSeconds": 3600,
echo     "responseHeader": ["Content-Type", "Authorization", "Content-Length", "User-Agent", "X-Requested-With"]
echo   }
echo ]
) > cors-temp.json

echo [OK] CORS configuration created!
echo.

REM Apply CORS
echo Applying CORS to Firebase Storage...
gsutil cors set cors-temp.json gs://parcelport-499d4.appspot.com

if %ERRORLEVEL% EQU 0 (
    echo.
    echo [OK] CORS applied successfully!
    echo.
) else (
    echo.
    echo [ERROR] Failed to apply CORS configuration.
    echo Please check your permissions.
    echo.
    del cors-temp.json
    pause
    exit /b 1
)

REM Verify CORS
echo Verifying CORS configuration...
echo.
gsutil cors get gs://parcelport-499d4.appspot.com

REM Cleanup
del cors-temp.json

echo.
echo ========================================================
echo                    ALL DONE!
echo ========================================================
echo.
echo CORS has been configured for your Firebase Storage!
echo.
echo Next steps:
echo   1. Wait 2-3 minutes for changes to propagate
echo   2. Clear your browser cache
echo   3. Test the upload at your website
echo.
pause
