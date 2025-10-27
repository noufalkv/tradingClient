# Complete Guide: Deploy React Native App to Google Play Store

## Step 1: Create a Keystore File

A keystore file is required to sign your APK. Run this command **once**:

```bash
keytool -genkey -v -keystore ~/trading_app_keystore.jks -keyalg RSA -keysize 2048 -validity 10000 -alias trading_app_key
```

**Important Information:**
- First, ensure you have Java installed: `java -version`
- This command will ask you to set a **password** (remember it!)
- Fill in the details:
  ```
  What is your first and last name? → Your Name
  What is the name of your organizational unit? → Your Company
  What is the name of your organization? → Your Company
  What is the name of your City or Locality? → Your City
  What is the name of your State or Province? → Your State
  What is the two-letter country code for this unit? → US
  ```
- **Save the keystore file location**: `~/trading_app_keystore.jks` or `~/.android/trading_app_keystore.jks`
- **Remember**: Keystore file password and key alias password

## Step 2: Configure Gradle with Keystore

Add your keystore information to `android/gradle.properties`:

```properties
# Keystore configuration for signing
MYAPP_RELEASE_STORE_FILE=trading_app_keystore.jks
MYAPP_RELEASE_STORE_PASSWORD=your_keystore_password
MYAPP_RELEASE_KEY_ALIAS=trading_app_key
MYAPP_RELEASE_KEY_PASSWORD=your_key_password
```

**Note**: Replace `your_keystore_password` and `your_key_password` with the passwords you created.

**⚠️ IMPORTANT - Do NOT commit `gradle.properties` to Git if it contains passwords!**

To prevent this, add to `.gitignore`:
```
android/gradle.properties
```

## Step 3: Update Android Build Gradle

Update `android/app/build.gradle` to use the signing configuration:

```gradle
android {
    ...
    
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
    
    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled enableProguardInReleaseBuilds
            proguardFiles getDefaultProguardFile("proguard-android.txt"), "proguard-rules.pro"
        }
    }
}
```

## Step 4: Build the Signed APK

Run this command from your project root:

```bash
npm run build:android:apk
```

Or manually:

```bash
cd android
./gradlew assembleRelease
cd ..
```

**Output location**: `android/app/build/outputs/apk/release/app-release.apk`

## Step 5: Build the App Bundle (AAB) for Play Store

Google Play Store prefers AAB (Android App Bundle) over APK:

```bash
npm run build:android:bundle
```

Or manually:

```bash
cd android
./gradlew bundleRelease
cd ..
```

**Output location**: `android/app/build/outputs/bundle/release/app-release.aab`

## Step 6: Verify the APK/AAB is Signed

```bash
# For APK
jarsigner -verify -verbose -certs android/app/build/outputs/apk/release/app-release.apk

# For AAB
jarsigner -verify -verbose -certs android/app/build/outputs/bundle/release/app-release.aab
```

## Step 7: Create Google Play Console Account

1. Go to [Google Play Console](https://play.google.com/console)
2. Create a new developer account (one-time $25 fee)
3. Create a new app
4. Fill in app details (name, description, etc.)

## Step 8: Prepare App on Google Play Console

### 8.1 Set Up App Signing
- Google Play handles app signing automatically
- You'll upload your AAB, and Google signs it with their key

### 8.2 Add App Information
- **Title**: Your app name
- **Short description**: Max 80 characters
- **Full description**: Max 4000 characters
- **Screenshots**: At least 2 (2-8 recommended)
- **Feature graphic**: 1024×500 px
- **Icon**: 512×512 px
- **Category**: Select appropriate category
- **Content rating**: Fill out questionnaire
- **Pricing**: Free or paid

### 8.3 Set Minimum API Level
- Go to App releases → Production
- Minimum API level should be 21 or higher

## Step 9: Upload AAB to Google Play Store

1. Go to **Google Play Console → Your App → Release → Production**
2. Click **"Create new release"**
3. Click **"Upload"** under "Android App Bundle"
4. Select your `app-release.aab` file
5. Add **release notes**: "Initial release" or your notes
6. Click **"Review"**
7. Click **"Start rollout to Production"**

## Step 10: Wait for Review

- Initial review: 24 hours to a few days
- Check **Google Play Console** for status
- You'll receive email when approved

---

# Quick Command Reference

```bash
# 1. Create keystore (one-time)
keytool -genkey -v -keystore ~/trading_app_keystore.jks -keyalg RSA -keysize 2048 -validity 10000 -alias trading_app_key

# 2. Build signed APK
npm run build:android:apk

# 3. Build signed AAB (for Play Store)
npm run build:android:bundle

# 4. Verify signature
jarsigner -verify -verbose -certs android/app/build/outputs/bundle/release/app-release.aab
```

---

# Troubleshooting

### Issue: "Cannot find keystore file"
**Solution**: Ensure the path in `gradle.properties` matches where you saved the keystore:
```bash
# Find your keystore
ls -la ~/trading_app_keystore.jks
# or
ls -la ~/.android/trading_app_keystore.jks
```

### Issue: "Wrong password"
**Solution**: Verify passwords match in `gradle.properties`

### Issue: "Module not configured"
**Solution**: Make sure you're in the project root directory when running build commands

### Issue: "Build fails with no signingConfig"
**Solution**: Ensure `MYAPP_RELEASE_STORE_FILE` and related properties are set in `gradle.properties`

---

# Security Best Practices

1. **Never commit keystore files to Git**
2. **Never commit passwords to Git**
3. **Use `.gitignore`** to prevent accidental commits:
   ```
   android/gradle.properties
   *.jks
   *.keystore
   ```
4. **Backup your keystore file** to a secure location
5. **Store passwords in a password manager**
6. **In CI/CD**: Use GitHub Secrets or environment variables

---

# Update Version Before Each Release

Before building a new release, update the version in `android/app/build.gradle`:

```gradle
defaultConfig {
    versionCode 1  // Increment this for each release (1, 2, 3, ...)
    versionName "1.0"  // User-facing version (1.0, 1.1, etc.)
}
```

- **versionCode**: Must increment with every release (required by Play Store)
- **versionName**: User-facing version number

---

# Complete Workflow Example

```bash
# 1. Create keystore (first time only)
keytool -genkey -v -keystore ~/trading_app_keystore.jks -keyalg RSA -keysize 2048 -validity 10000 -alias trading_app_key

# 2. Update version in android/app/build.gradle
# Change versionCode from 1 to 2
# Change versionName from "1.0" to "1.1"

# 3. Install dependencies
npm install

# 4. Build the app bundle
npm run build:android:bundle

# 5. Verify the build
ls -la android/app/build/outputs/bundle/release/app-release.aab

# 6. Upload to Google Play Console manually
```

---

For more info: https://reactnative.dev/docs/signed-apk-android
