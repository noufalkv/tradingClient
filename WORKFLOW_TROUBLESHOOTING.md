# ⚙️ GitHub Actions Workflow Troubleshooting Guide

## Current Workflow: CI and CD

This document helps you troubleshoot and understand the GitHub Actions workflow for building and deploying your React Native Trading App to Google Play Store.

---

## 🔄 Workflow Overview

### File Location
`.github/workflows/main.yml`

### When It Runs
- On every `push` to `main` branch
- On every pull request to `main` branch

### What It Does

**Job 1: lint-and-test** (Validation)
- Checks out code
- Sets up Java 17
- Sets up Node.js 22.9.0
- Installs dependencies
- *(Currently skipped: Prettier, ESLint, Unit tests)*

**Job 2: deploy** (Build & Deploy)
- Depends on `lint-and-test` passing
- Sets up Java 17 and Node.js
- Sets up credentials (keystore, Play Store credentials)
- Installs dependencies
- Installs Ruby/Bundler
- Builds signed AAB
- Deploys to Google Play Store

---

## 🔧 Required GitHub Secrets

Your workflow needs these secrets to run. Go to:
**Settings → Secrets and variables → Actions**

### Required Secrets:

| Secret | Value | Example |
|--------|-------|---------|
| `KEYSTORE_FILE` | Base64 encoded keystore file | `/u3+7QAA...ABCD/w==` |
| `KEYSTORE_PASSWORD` | Keystore password | `my_secure_password` |
| `KEYSTORE_KEY_PASSWORD` | Key password | `my_key_password` |
| `PLAYSTORE_CREDENTIALS` | Google Play Service Account JSON | `{"type":"service_account"...}` |

### How to Set Up Secrets:

1. **KEYSTORE_FILE** (Base64 encoded)
   ```bash
   ./encode-keystore.sh
   # Paste the output into GitHub Secret
   ```

2. **KEYSTORE_PASSWORD**
   - The password you used when creating the keystore
   - Example: `MySecure123!`

3. **KEYSTORE_KEY_PASSWORD**
   - Usually the same as KEYSTORE_PASSWORD
   - Or a separate password for the key

4. **PLAYSTORE_CREDENTIALS**
   ```bash
   # Go to Google Cloud Console
   # Get your Service Account JSON file
   # Paste entire JSON content into the secret
   ```

---

## ✅ Verification Checklist

- [ ] `.github/workflows/main.yml` exists
- [ ] All 4 GitHub Secrets are set up
- [ ] `android/Gemfile` exists (for bundler/fastlane)
- [ ] `android/fastlane/Fastfile` exists and has correct syntax
- [ ] `android/fastlane/Appfile` exists
- [ ] `package.json` has `build:android:bundle` script
- [ ] `android/gradle.properties` has signing config
- [ ] `.gitignore` includes `*.jks` and `gradle.properties`

---

## 🚨 Common Errors & Solutions

### Error 1: "Syntax error in your Fastfile on line 32"

**Problem:**
```
lane : playstore do  ❌ (space before colon)
```

**Solution:**
```ruby
lane :playstore do  ✅ (no space)
```

**Already Fixed**: The Fastfile has been corrected.

---

### Error 2: "fastlane detected a Gemfile but you didn't use `bundle exec`"

**Problem:** Fastlane warning about using bundler

**Solution:** Use `bundle exec fastlane` instead of just `fastlane`

**In workflow:**
```yaml
- name: Deploy to Google Play Store
  working-directory: android
  run: bundle exec fastlane playstore  ✅
```

**Already Fixed**: The workflow has been updated.

---

### Error 3: "Could not find playstore-credentials.json"

**Problem:** Credentials file not created

**Solution:**
1. Make sure `PLAYSTORE_CREDENTIALS` secret is set
2. Workflow creates it from the secret:
   ```yaml
   echo "$PLAYSTORE_CREDENTIALS" > fastlane/playstore-credentials.json
   ```

**Check:**
- Go to: Settings → Secrets and variables → Actions
- Verify `PLAYSTORE_CREDENTIALS` is listed
- Make sure the JSON content is complete

---

### Error 4: "KEYSTORE_FILE secret not found"

**Problem:** Keystore not decoded properly

**Solution:**
1. Run: `./encode-keystore.sh`
2. Copy the entire Base64 output
3. Go to GitHub Secrets
4. Update `KEYSTORE_FILE` with complete Base64 string
5. Make sure it ends with `==`

**Verify:**
```bash
# Test decode locally
echo "your_base64_string" | base64 -d | file -
# Should output: "data" (binary data)
```

---

### Error 5: "Error initializing gradle"

**Problem:** Gradle build configuration issues

**Solution:**
1. Check `android/app/build.gradle` has signing config
2. Verify `android/gradle.properties` exists locally
3. Check these properties are set:
   - `MYAPP_RELEASE_STORE_FILE`
   - `MYAPP_RELEASE_STORE_PASSWORD`
   - `MYAPP_RELEASE_KEY_ALIAS`
   - `MYAPP_RELEASE_KEY_PASSWORD`

**Don't forget:** `android/gradle.properties` should be in `.gitignore`

---

### Error 6: "Upload to Play Store failed - invalid credentials"

**Problem:** Google Play Service Account JSON is invalid

**Solution:**
1. Download fresh JSON from Google Cloud Console
2. Go to: Google Cloud Console → Service Accounts
3. Select your service account
4. Keys tab → Create new key → JSON
5. Copy the complete JSON content
6. Update GitHub Secret `PLAYSTORE_CREDENTIALS`

---

### Error 7: "versionCode not incremented"

**Problem:** Google Play won't accept release with same versionCode

**Solution:**
1. Open `android/app/build.gradle`
2. Find `versionCode`
3. Increment it: `versionCode 1` → `versionCode 2`
4. Also update `versionName` if needed
5. Commit and push
6. Re-run workflow

---

## 📊 Workflow Execution Steps (In Order)

1. **Checkout code** from repository
2. **Setup Java 17** for Android build tools
3. **Setup Node.js 22.9.0** for React Native
4. **Cache npm modules** for faster builds
5. **Install npm dependencies** (`npm install`)
6. **Setup signing credentials**
   - Decode Base64 keystore file
   - Create gradle.properties
7. **Install Ruby Bundler** for fastlane
8. **Create Play Store credentials** JSON file
9. **Run fastlane playstore**
   - Builds signed AAB
   - Uploads to Google Play Store
10. **Deploy complete** ✅

---

## 📝 How to Manually Build Locally

If you want to test before pushing to GitHub:

```bash
# 1. Install dependencies
npm install

# 2. Setup keystore
./encode-keystore.sh

# 3. Copy credentials
cp ~/path/to/service-account.json android/playstore-credential.json

# 4. Create gradle.properties
cat > android/gradle.properties << EOF
MYAPP_RELEASE_STORE_FILE=app/trading_app_keystore.jks
MYAPP_RELEASE_STORE_PASSWORD=your_password
MYAPP_RELEASE_KEY_ALIAS=trading_app_key
MYAPP_RELEASE_KEY_PASSWORD=your_password
EOF

# 5. Build signed AAB
npm run build:android:bundle

# 6. Test with fastlane (optional)
cd android
bundle install
bundle exec fastlane playstore
```

---

## 🔍 Debugging: View Workflow Logs

1. Go to GitHub repository
2. Click **Actions** tab
3. Click the workflow run you want to check
4. Expand each step to see logs
5. Look for ✅ (success) or ❌ (error)

### What to Check:
- ✅ "Setup credentials" - Did it create keystore?
- ✅ "Install Ruby dependencies" - Did bundler install?
- ✅ "Deploy to Google Play Store" - Did fastlane run?

---

## 💡 Pro Tips

1. **Test on feature branch first**
   - Create a feature branch
   - Make changes
   - Push to test workflow
   - No automatic deploy (only on main)

2. **Use workflow dispatch**
   Add this to trigger manually:
   ```yaml
   on:
     push:
       branches: [main]
     workflow_dispatch:  # Allows manual trigger
   ```
   Then go to Actions tab and click "Run workflow"

3. **Add notifications**
   - Set up email notifications for workflow failures
   - Settings → Notifications

4. **Keep secrets secure**
   - Never log them in workflow
   - Use `${{ secrets.SECRET_NAME }}`
   - GitHub masks secrets in logs automatically

---

## 📚 Related Files

- `.github/workflows/main.yml` - The workflow file
- `android/fastlane/Fastfile` - Fastlane configuration
- `android/fastlane/Appfile` - App configuration
- `android/Gemfile` - Ruby dependencies
- `CREDENTIALS_MANAGEMENT.md` - Credentials guide
- `BASE64_KEYSTORE_GUIDE.md` - Keystore encoding guide
- `DEPLOYMENT_CHECKLIST.md` - Manual deployment steps

---

## 🆘 Still Having Issues?

1. Check the workflow logs (Actions tab)
2. Review error messages carefully
3. Verify all GitHub Secrets are set
4. Test locally first (see manual build steps)
5. Check fastlane documentation: https://docs.fastlane.tools/

---

## 📞 Support Links

- [GitHub Actions Documentation](https://docs.github.com/actions)
- [Fastlane Documentation](https://docs.fastlane.tools/)
- [React Native Build Guide](https://reactnative.dev/docs/signed-apk-android)
- [Google Play Console Help](https://support.google.com/googleplay/android-developer)

---

**Last Updated**: October 27, 2025
**Workflow Status**: ✅ Configured and Ready
**Next Step**: Push to main branch to trigger deployment
