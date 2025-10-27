# Google Play Store Deployment Checklist

## ✅ Pre-Deployment Checklist

### Step 1: Prepare Your Project
- [ ] Code is tested and working
- [ ] All bugs are fixed
- [ ] App is built and runs successfully: `npm run android`

### Step 2: Update Version Numbers
- [ ] Update `versionCode` in `android/app/build.gradle` (increment by 1)
- [ ] Update `versionName` in `android/app/build.gradle` (e.g., "1.0", "1.1")

Example:
```gradle
defaultConfig {
    versionCode 1  // Change to 2, 3, etc. for each release
    versionName "1.0"  // Change to "1.1", "2.0", etc.
}
```

### Step 3: Create Keystore (First Release Only)
- [ ] Run: `./deploy-helper.sh`
- [ ] Select option `1` (Create a new keystore)
- [ ] Answer the prompts (country, name, organization, etc.)
- [ ] **Backup the keystore file to a safe location**
- [ ] **Remember/save the password**

### Step 4: Configure Gradle with Keystore
- [ ] Create/update `android/gradle.properties` with:
  ```properties
  MYAPP_RELEASE_STORE_FILE=trading_app_keystore.jks
  MYAPP_RELEASE_STORE_PASSWORD=your_keystore_password
  MYAPP_RELEASE_KEY_ALIAS=trading_app_key
  MYAPP_RELEASE_KEY_PASSWORD=your_key_password
  ```
- [ ] Add `android/gradle.properties` to `.gitignore` (IMPORTANT!)
- [ ] Do NOT commit passwords to Git

### Step 5: Update app/build.gradle with Signing Config
- [ ] Verify `android/app/build.gradle` has signing configuration:
  ```gradle
  signingConfigs {
      release {
          if (project.hasProperty('MYAPP_RELEASE_STORE_FILE')) {
              storeFile file(MYAPP_RELEASE_STORE_FILE)
              storePassword MYAPP_RELEASE_STORE_PASSWORD
              keyAlias MYAPP_RELEASE_KEY_ALIAS
              keyPassword MYAPP_RELEASE_KEY_PASSWORD
          }
      }
  }
  ```
- [ ] Verify `release` build type uses `signingConfig signingConfigs.release`

### Step 6: Build the App Bundle
- [ ] Run: `./deploy-helper.sh`
- [ ] Select option `3` (Build signed AAB)
- [ ] Wait for build to complete (5-10 minutes)
- [ ] Verify output exists: `ls -la android/app/build/outputs/bundle/release/app-release.aab`

### Step 7: Verify the Build
- [ ] Run: `./deploy-helper.sh`
- [ ] Select option `5` (Verify signed files)
- [ ] Confirm it shows "jar verified" message

### Step 8: Create Google Play Developer Account
- [ ] Go to [Google Play Console](https://play.google.com/console)
- [ ] Sign in with your Google account
- [ ] Pay $25 developer fee (one-time)
- [ ] Accept terms and conditions

### Step 9: Create a New App
- [ ] Click "Create app"
- [ ] Enter app name (e.g., "Trading App")
- [ ] Select "Apps" as app type
- [ ] Set default language (English)
- [ ] Click "Create"

### Step 10: Fill App Information
- [ ] **App access**: Select appropriate access type
- [ ] **Ads**: Declare if your app uses ads
- [ ] **Paid app**: Select if paid or free
- [ ] **Content rating**: Fill out questionnaire

### Step 11: Add App Details
On the main dashboard, fill in:
- [ ] **App name**: Your app name
- [ ] **Short description**: Max 80 characters
- [ ] **Full description**: Max 4000 characters
- [ ] **Screenshots**: 
  - [ ] At least 2 (recommend 4-8)
  - [ ] Dimension: 1080x1920 pixels
  - [ ] Format: PNG or JPEG
- [ ] **Feature graphic**: 1024x500 pixels
- [ ] **Icon**: 512x512 pixels
- [ ] **Category**: Select from available categories
- [ ] **Content rating**: Complete the form

### Step 12: Prepare Release
- [ ] Go to **Release** → **Production**
- [ ] Click **"Create new release"**

### Step 13: Upload App Bundle
- [ ] Click **"Upload"** under "Android App Bundle"
- [ ] Select your signed AAB file: `android/app/build/outputs/bundle/release/app-release.aab`
- [ ] Wait for upload to complete

### Step 14: Add Release Notes
- [ ] In the "Release notes" field, enter:
  ```
  Initial release - version 1.0
  ```
  Or for updates:
  ```
  Bug fixes and performance improvements
  ```

### Step 15: Review and Rollout
- [ ] Click **"Review"** to check everything
- [ ] Verify app name, version, and AAB are correct
- [ ] Click **"Start rollout to Production"**
- [ ] Confirm the rollout

### Step 16: Wait for Review
- [ ] App enters "Review in progress" status
- [ ] Initial review typically takes: **24 hours to 48 hours**
- [ ] Check **Google Play Console** periodically for status
- [ ] You'll receive email notifications about status changes

### Step 17: App Published ✅
- [ ] Once approved, app is live on Google Play Store
- [ ] Available at: `https://play.google.com/store/apps/details?id=com.yourcompany.yourapp`
- [ ] Can be searched on Google Play Store

---

## 📝 Common Issues & Solutions

### Issue: Build fails with "Wrong keystore password"
**Solution**: Verify passwords in `gradle.properties` match exactly

### Issue: "versionCode not incremented"
**Solution**: Google Play won't accept releases with same versionCode. Always increment it.

### Issue: "Certificate expired" or "Invalid signature"
**Solution**: Check keystore validity (should be 10000 days = ~27 years)

### Issue: App rejected for policy violations
**Solution**: 
- Review Google Play policies
- Check for privacy policy requirements
- Ensure content rating is accurate
- Verify app permissions are necessary

---

## 🔐 Security Reminders

- ✅ DO: Backup keystore file securely
- ✅ DO: Use strong password for keystore
- ✅ DO: Store credentials in password manager
- ❌ DON'T: Commit keystore file to Git
- ❌ DON'T: Commit passwords to Git
- ❌ DON'T: Share keystore file publicly

---

## 📚 Useful Commands

```bash
# Run the deployment helper
./deploy-helper.sh

# Build APK only
npm run build:android:apk

# Build AAB only
npm run build:android:bundle

# Build both
npm run build:android:bundle && npm run build:android:apk

# View keystore info
keytool -list -v -keystore ~/trading_app_keystore.jks

# Clean build
cd android && ./gradlew clean && cd ..
```

---

## 🎯 Next Release Update Process

For each new release:

1. Update `versionCode` and `versionName` in `android/app/build.gradle`
2. Run: `npm run build:android:bundle`
3. Go to Google Play Console → Release → Production → Create new release
4. Upload the new AAB file
5. Add release notes
6. Click "Start rollout to Production"
7. Wait for review (24-48 hours)

---

**Last Updated**: October 27, 2025
**Support**: Check [React Native Docs](https://reactnative.dev/docs/signed-apk-android)
