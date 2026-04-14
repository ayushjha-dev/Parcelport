@echo off
REM Script to find Firebase usage in the codebase
REM This helps identify which files still need to be migrated to Supabase

echo.
echo 🔍 Searching for Firebase usage in ParcelPort...
echo.
echo ================================================
echo Files importing from Firebase:
echo ================================================
findstr /S /I /M "from 'firebase" src\*.ts src\*.tsx src\*.js src\*.jsx 2>nul

echo.
echo ================================================
echo Files importing from @/lib/firebase:
echo ================================================
findstr /S /I /M "from '@/lib/firebase" src\*.ts src\*.tsx src\*.js src\*.jsx 2>nul

echo.
echo ================================================
echo Files using Firestore functions:
echo ================================================
findstr /S /I /M "collection doc getDoc getDocs setDoc updateDoc deleteDoc addDoc query where orderBy" src\*.ts src\*.tsx src\*.js src\*.jsx 2>nul

echo.
echo ================================================
echo Files using Firebase Auth:
echo ================================================
findstr /S /I /M "signInWithEmailAndPassword createUserWithEmailAndPassword signOut onAuthStateChanged updateProfile" src\*.ts src\*.tsx src\*.js src\*.jsx 2>nul

echo.
echo ================================================
echo Files using Firebase Storage:
echo ================================================
findstr /S /I /M "uploadBytes getDownloadURL storage" src\*.ts src\*.tsx src\*.js src\*.jsx 2>nul

echo.
echo ================================================
echo Files using Timestamp:
echo ================================================
findstr /S /I /M "Timestamp serverTimestamp" src\*.ts src\*.tsx src\*.js src\*.jsx 2>nul

echo.
echo ✅ Search complete!
echo.
echo 💡 Tip: Files listed above need to be migrated to Supabase
echo 📖 See MIGRATION_GUIDE.md for migration patterns
echo.
pause
