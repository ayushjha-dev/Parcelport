# How to Fix CORS Issue - Step by Step Guide

## The Easiest Way (No Installation Required)

### Option 1: Use Google Cloud Console (Recommended - 5 minutes)

1. **Open Google Cloud Console**
   - Go to: https://console.cloud.google.com/storage/browser
   - Sign in with your Firebase account

2. **Select Your Project**
   - Click the project dropdown at the top
   - Select: `parcelport-499d4`

3. **Open Cloud Shell**
   - Click the **Cloud Shell** icon `>_` at the top-right corner
   - Wait for the terminal to load (takes ~10 seconds)

4. **Run These Commands** (copy and paste each one):

   ```bash
   # Create CORS configuration
   cat > cors.json << 'EOF'
   [
     {
       "origin": ["*"],
       "method": ["GET", "POST", "PUT", "DELETE", "HEAD"],
       "maxAgeSeconds": 3600,
       "responseHeader": ["Content-Type", "Authorization", "Content-Length", "User-Agent", "X-Requested-With"]
     }
   ]
   EOF
   ```

   ```bash
   # Apply CORS to your bucket
   gsutil cors set cors.json gs://parcelport-499d4.appspot.com
   ```

   ```bash
   # Verify it worked
   gsutil cors get gs://parcelport-499d4.appspot.com
   ```

5. **Done!** 
   - Wait 2-3 minutes
   - Clear browser cache
   - Test your upload

---

## Alternative: Use Automated Scripts (If You Have Google Cloud SDK)

### For Windows Users:

1. **Install Google Cloud SDK** (if not installed)
   - Download: https://cloud.google.com/sdk/docs/install#windows
   - Run the installer
   - Open a new Command Prompt

2. **Authenticate**
   ```cmd
   gcloud auth login
   ```

3. **Run the Fix Script**
   ```cmd
   fix-cors.bat
   ```

### For Mac/Linux Users:

1. **Install Google Cloud SDK** (if not installed)
   ```bash
   # Mac
   brew install google-cloud-sdk
   
   # Linux
   curl https://sdk.cloud.google.com | bash
   ```

2. **Authenticate**
   ```bash
   gcloud auth login
   ```

3. **Run the Fix Script**
   ```bash
   node fix-cors.js
   ```

---

## What These Scripts Do

1. ✅ Check if Google Cloud SDK is installed
2. ✅ Verify you're authenticated
3. ✅ Create CORS configuration file
4. ✅ Apply CORS to your Firebase Storage bucket
5. ✅ Verify the configuration was applied
6. ✅ Clean up temporary files

---

## After Running the Fix

### Test the Upload:

1. Go to: https://parcelport.vercel.app/student/parcels/new/step-4
2. Select a payment method
3. Fill in transaction details
4. Upload a payment screenshot
5. Click "Submit & Complete"

### If It Still Doesn't Work:

1. **Clear Browser Cache**
   - Chrome: Ctrl+Shift+Delete → Clear cached images and files
   - Firefox: Ctrl+Shift+Delete → Cached Web Content

2. **Hard Refresh**
   - Windows: Ctrl+Shift+R
   - Mac: Cmd+Shift+R

3. **Try Incognito/Private Window**
   - This ensures no cached data interferes

4. **Check Browser Console**
   - Press F12
   - Go to Console tab
   - Look for any remaining CORS errors

---

## Troubleshooting

### "gsutil: command not found"
- Google Cloud SDK is not installed
- Install from: https://cloud.google.com/sdk/docs/install

### "You do not currently have an active account selected"
- Run: `gcloud auth login`
- Follow the browser authentication flow

### "AccessDeniedException: 403"
- You don't have permission to modify the bucket
- Make sure you're logged in with the Firebase project owner account
- Or ask the project owner to run the script

### "CORS errors still appear after fix"
- Wait 5 minutes for changes to propagate
- Clear browser cache completely
- Try a different browser
- Check if you're testing on the correct domain

---

## What the CORS Configuration Does

```json
{
  "origin": ["*"],              // Allows requests from any domain
  "method": ["GET", "POST", ...], // Allows these HTTP methods
  "maxAgeSeconds": 3600,        // Cache preflight requests for 1 hour
  "responseHeader": [...]       // Headers that can be exposed
}
```

### Security Note:
- `"origin": ["*"]` allows all domains (good for development)
- For production, you can restrict to specific domains:
  ```json
  "origin": ["https://parcelport.vercel.app"]
  ```

---

## Need Help?

If you're still stuck:

1. Check the browser console (F12) for specific error messages
2. Verify your Firebase project ID is correct: `parcelport-499d4`
3. Make sure you're using the correct Google account
4. Try the Google Cloud Console method (Option 1) - it's the most reliable

---

## Summary

**Fastest Method**: Use Google Cloud Console Cloud Shell (Option 1)
- No installation required
- Works in any browser
- Takes ~5 minutes
- Most reliable

**Alternative**: Use the automated scripts if you already have Google Cloud SDK installed
