# Firebase Storage CORS Configuration Fix

## Problem
Users are experiencing CORS errors when uploading payment screenshots to Firebase Storage from the deployed Vercel app.

## Error Message
```
Access to XMLHttpRequest at 'https://firebasestorage.googleapis.com/...' from origin 'https://parcelport.vercel.app' has been blocked by CORS policy
```

## Solution

### Option 1: Using Google Cloud SDK (Recommended)

1. **Install Google Cloud SDK**
   - Download from: https://cloud.google.com/sdk/docs/install
   - Or use: `curl https://sdk.cloud.google.com | bash`

2. **Authenticate with Google Cloud**
   ```bash
   gcloud auth login
   ```

3. **Set your project**
   ```bash
   gcloud config set project parcelport-499d4
   ```

4. **Apply CORS configuration**
   ```bash
   gsutil cors set cors.json gs://parcelport-499d4.appspot.com
   ```

5. **Verify CORS configuration**
   ```bash
   gsutil cors get gs://parcelport-499d4.appspot.com
   ```

### Option 2: Using Firebase Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project: `parcelport-499d4`
3. Navigate to **Cloud Storage** → **Browser**
4. Click on your bucket: `parcelport-499d4.appspot.com`
5. Click on **Permissions** tab
6. Add CORS configuration manually (not recommended, use Option 1)

### Option 3: Temporary Workaround (Already Implemented)

The code has been updated to handle CORS errors gracefully:
- If upload fails due to CORS, the submission continues with transaction details
- Admin can manually verify payment using the transaction ID
- User is notified that manual verification will be done

## CORS Configuration Files

Two configuration files are provided:

### 1. `cors.json` - Development (Allow All Origins)
```json
[
  {
    "origin": ["*"],
    "method": ["GET", "POST", "PUT", "DELETE", "HEAD"],
    "maxAgeSeconds": 3600,
    "responseHeader": ["Content-Type", "Authorization", "Content-Length", "User-Agent", "X-Requested-With"]
  }
]
```

### 2. `cors-production.json` - Production (Specific Origins)
```json
[
  {
    "origin": [
      "https://parcelport.vercel.app",
      "http://localhost:3000",
      "http://localhost:3001"
    ],
    "method": ["GET", "POST", "PUT", "DELETE", "HEAD"],
    "maxAgeSeconds": 3600,
    "responseHeader": ["Content-Type", "Authorization", "Content-Length", "User-Agent", "X-Requested-With"]
  }
]
```

## Testing After Fix

1. Clear browser cache
2. Try uploading a payment screenshot at: https://parcelport.vercel.app/student/parcels/new/step-4
3. Check browser console for any CORS errors
4. Verify the file appears in Firebase Storage

## Additional Notes

- CORS changes may take a few minutes to propagate
- If using multiple domains (e.g., preview deployments), add them to the origin list
- The temporary workaround allows the app to function while CORS is being fixed
- Users will still be able to register parcels even if upload fails

## Support

If issues persist after applying CORS configuration:
1. Check Firebase Storage rules in `firestore.rules`
2. Verify Firebase project permissions
3. Check browser console for detailed error messages
4. Contact Firebase support if needed
