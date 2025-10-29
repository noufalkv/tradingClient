# 🔧 Fastlane Configuration Fix - Play Store Credentials

## Issue: How to Use PLAYSTORE_CREDENTIALS Secret

**Problem:** Fastfile was hardcoding the JSON key file path, but Appfile should handle it automatically.

---

## Solution Overview

### Three Components Work Together:

1. **GitHub Workflow** - Creates the credentials file
2. **Appfile** - Tells Fastlane where to find credentials
3. **Fastfile** - Tells Fastlane what to do

---

## How It Works Now

### Step 1: Workflow Creates Credentials File

```yaml
# In .github/workflows/main.yml
- name: Deploy to Google Play Store
  env:
    PLAYSTORE_CREDENTIALS: ${{ secrets.PLAYSTORE_CREDENTIALS }}
  run: |
    echo "$PLAYSTORE_CREDENTIALS" > fastlane/playstore-credentials.json
    bundle exec fastlane playstore
```

**Result:**
```
android/
├── fastlane/
│   ├── playstore-credentials.json  ← Created by workflow
│   ├── Appfile                     ← Knows where to find it
│   └── Fastfile                    ← Uses Appfile config
```

### Step 2: Appfile Points to Credentials

```ruby
# android/fastlane/Appfile
json_key_file("./playstore-credentials.json")  # ✅ Points to the file
package_name("com.rn_trading_app")
```

**What this does:**
- Tells Fastlane: "The credentials JSON is at `./playstore-credentials.json`"
- Fastlane automatically uses this for all Play Store uploads

### Step 3: Fastfile Uses Appfile Config

```ruby
# android/fastlane/Fastfile
lane :playstore do
  gradle(task: "bundle", build_type: "Release")
  
  upload_to_play_store(
    track: "internal",
    release_status: "completed"
    # ✅ json_key removed - Appfile handles it!
  )
end
```

**Benefits:**
- ✅ Cleaner code
- ✅ Single source of truth (Appfile)
- ✅ Easier to maintain
- ✅ Works with workflow

---

## Files Modified

### 1. `android/fastlane/Appfile` (Updated)

```ruby
# Before ❌
json_key_file("./playstore-credential.json")   # Wrong filename

# After ✅
json_key_file("./playstore-credentials.json")  # Matches workflow
package_name("com.rn_trading_app")
```

### 2. `android/fastlane/Fastfile` (Updated)

```ruby
# Before ❌
upload_to_play_store(
  track: "internal",
  release_status: "completed",
  json_key: "fastlane/playstore-credentials.json"  # Hardcoded path
)

# After ✅
upload_to_play_store(
  track: "internal",
  release_status: "completed"
  # Appfile provides json_key automatically
)
```

---

## Data Flow

### Complete Deployment Flow

```
GitHub Actions Workflow
│
├─ Setup credentials
│  └─ echo "${{ secrets.PLAYSTORE_CREDENTIALS }}" > fastlane/playstore-credentials.json
│
├─ Set up Ruby
│  └─ Installs bundler and fastlane gems
│
└─ Deploy to Google Play Store
   └─ bundle exec fastlane playstore
      │
      └─ Fastlane reads Appfile
         ├─ Gets: json_key_file = "./playstore-credentials.json"
         ├─ Gets: package_name = "com.rn_trading_app"
         │
         └─ Runs: playstore lane in Fastfile
            ├─ gradle bundleRelease
            │  └─ Signs AAB with keystore ✅
            │
            └─ upload_to_play_store
               ├─ Reads: playstore-credentials.json (from Appfile) ✅
               ├─ Uses credentials for authentication ✅
               └─ Uploads AAB to "internal" track ✅
```

---

## Required GitHub Secrets

Make sure these 4 secrets are set:

| Secret | Purpose | Example |
|--------|---------|---------|
| `KEYSTORE_FILE` | Base64 encoded .jks | `/u3+7QAA...==` |
| `KEYSTORE_PASSWORD` | Keystore password | `MyPassword123` |
| `KEYSTORE_KEY_PASSWORD` | Key password | `MyPassword123` |
| `PLAYSTORE_CREDENTIALS` | Google Cloud JSON | `{"type":"service_account"...}` |

---

## How to Set Up PLAYSTORE_CREDENTIALS

### Option 1: Get from Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Select your project
3. Go to "Service Accounts"
4. Select your service account
5. Go to "Keys" tab
6. Click "Add Key" → "Create new key"
7. Select "JSON"
8. Download the file

### Option 2: Add to GitHub Secrets

1. Go to GitHub repository
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Name: `PLAYSTORE_CREDENTIALS`
5. Value: Paste entire JSON content from Google Cloud
6. Click **Add secret**

---

## Verification

### Check Appfile

```bash
cat android/fastlane/Appfile
```

Expected output:
```ruby
json_key_file("./playstore-credentials.json")
package_name("com.rn_trading_app")
```

### Check Fastfile

```bash
grep -A 3 "upload_to_play_store" android/fastlane/Fastfile
```

Expected output:
```ruby
upload_to_play_store(
  track: "internal",
  release_status: "completed"
)
```

---

## Testing Locally

To test the Fastlane configuration locally:

```bash
cd android

# Create test credentials
echo '{"type":"service_account",...}' > fastlane/playstore-credentials.json

# Verify Appfile can find it
bundle exec fastlane supply --help

# Should work without errors
```

---

## Troubleshooting

### Error: "Could not find credentials"

**Solution:**
1. Verify GitHub Secret `PLAYSTORE_CREDENTIALS` is set
2. Check Appfile has correct filename: `./playstore-credentials.json`
3. Verify workflow creates the file before calling fastlane

### Error: "Invalid JSON key"

**Solution:**
1. Download fresh JSON from Google Cloud Console
2. Verify JSON is complete (starts with `{` and ends with `}`)
3. Update GitHub Secret with complete JSON

### Error: "Package name mismatch"

**Solution:**
1. Verify Appfile has correct package: `com.rn_trading_app`
2. Check app is registered in Google Play Console
3. Verify package name matches android/app/build.gradle

---

## Track Options

The Fastfile uses `track: "internal"` for testing. You can change this:

```ruby
# For testing
track: "internal"

# For beta testing
track: "beta"

# For production
track: "production"
```

---

## Fastlane Appfile Reference

The Appfile provides default configuration for all lanes:

```ruby
# android/fastlane/Appfile

# Where to find Google Play credentials
json_key_file("./playstore-credentials.json")

# Your app's package name
package_name("com.rn_trading_app")

# Optional: Default values for upload_to_play_store
track "internal"              # Default track
```

---

## Summary

✅ **Before:** Hardcoded path in Fastfile  
✅ **After:** Centralized configuration in Appfile  
✅ **Result:** Cleaner, more maintainable code  
✅ **Status:** Ready for Production

---

**Fixed:** October 29, 2025  
**Status:** Ready to Deploy ✅  
**Next Step:** Push to main and workflow will deploy!
