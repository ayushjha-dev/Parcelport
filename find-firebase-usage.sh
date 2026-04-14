#!/bin/bash

# Script to find Firebase usage in the codebase
# This helps identify which files still need to be migrated to Supabase

echo "🔍 Searching for Firebase usage in ParcelPort..."
echo ""
echo "================================================"
echo "Files importing from Firebase:"
echo "================================================"
grep -r "from 'firebase" src/ --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" | grep -v node_modules | cut -d: -f1 | sort | uniq

echo ""
echo "================================================"
echo "Files importing from @/lib/firebase:"
echo "================================================"
grep -r "from '@/lib/firebase" src/ --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" | grep -v node_modules | cut -d: -f1 | sort | uniq

echo ""
echo "================================================"
echo "Files using Firestore functions:"
echo "================================================"
grep -r "collection\|doc\|getDoc\|getDocs\|setDoc\|updateDoc\|deleteDoc\|addDoc\|query\|where\|orderBy" src/ --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" | grep -v node_modules | grep -v "// " | cut -d: -f1 | sort | uniq

echo ""
echo "================================================"
echo "Files using Firebase Auth:"
echo "================================================"
grep -r "signInWithEmailAndPassword\|createUserWithEmailAndPassword\|signOut\|onAuthStateChanged\|updateProfile" src/ --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" | grep -v node_modules | cut -d: -f1 | sort | uniq

echo ""
echo "================================================"
echo "Files using Firebase Storage:"
echo "================================================"
grep -r "ref\|uploadBytes\|getDownloadURL\|deleteObject" src/ --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" | grep -v node_modules | grep "storage" | cut -d: -f1 | sort | uniq

echo ""
echo "================================================"
echo "Files using Timestamp:"
echo "================================================"
grep -r "Timestamp\|serverTimestamp" src/ --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" | grep -v node_modules | cut -d: -f1 | sort | uniq

echo ""
echo "✅ Search complete!"
echo ""
echo "💡 Tip: Files listed above need to be migrated to Supabase"
echo "📖 See MIGRATION_GUIDE.md for migration patterns"
