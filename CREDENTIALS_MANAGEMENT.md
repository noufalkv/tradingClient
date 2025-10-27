# 🔐 Credentials Management Guide

## Overview
This document explains how to properly manage sensitive credentials for the Trading App, including Google Play Store credentials and Android keystore files.

## ⚠️ Important Security Rules

### NEVER commit these files to Git:
- ❌ `android/playstore-credential.json` - Google Cloud Service Account
- ❌ `android/gradle.properties` - Contains keystore passwords
- ❌ `*.jks` or `*.keystore` - Android keystore files
- ❌ `firebase-config.json` - Firebase configuration with secrets
- ❌ Any file containing passwords, tokens, or API keys

### These ARE safe to commit:
- ✅ `android/playstore-credential.json.template` - Template/example file
- ✅ `.gitignore` - Lists what should be ignored

---

## 📋 Setup Instructions

### 1. Google Play Store Credentials

#### First Time Setup:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new Service Account:
   - Select your project
   - Go to "Service Accounts"
   - Click "Create Service Account"
   - Grant these roles:
     - Editor (for publishing)
     - Service Account Admin
3. Create a JSON key:
   - Click on the service account
   - Go to "Keys" tab
   - Click "Add Key" → "Create new key"
   - Select "JSON" and download
4. **Move the downloaded file to `android/playstore-credential.json`**

#### Local Development:
```bash
# Copy your credentials (never commit to Git!)
cp ~/Downloads/your-service-account.json android/playstore-credential.json

# Verify it's not tracked by Git
git status  # Should NOT show playstore-credential.json
```

### 2. Android Keystore File

#### First Time Setup:
```bash
# Create a new keystore (or use the one you already have)
keytool -genkey -v -keystore ~/trading_app_keystore.jks \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000 \
  -alias trading_app_key

# Move to project
cp ~/trading_app_keystore.jks android/app/
```

#### Configure Gradle:
Create `android/gradle.properties` (do NOT commit to Git):

```properties
# Google Play Store Credentials (from Service Account JSON)
GOOGLE_PLAY_JSON_KEY_FILE=android/playstore-credential.json

# Android Keystore Configuration
MYAPP_RELEASE_STORE_FILE=app/trading_app_keystore.jks
MYAPP_RELEASE_STORE_PASSWORD=your_keystore_password
MYAPP_RELEASE_KEY_ALIAS=trading_app_key
MYAPP_RELEASE_KEY_PASSWORD=your_key_password

# Gradle Options
org.gradle.jvmargs=-Xmx2048m
org.gradle.daemon=true
org.gradle.parallel=true
```

---

## 🗂️ File Structure

```
client/
├── android/
│   ├── playstore-credential.json          ❌ NOT committed (contains secrets)
│   ├── playstore-credential.json.template  ✅ Template file (safe to commit)
│   ├── gradle.properties                   ❌ NOT committed (contains passwords)
│   ├── app/
│   │   └── trading_app_keystore.jks       ❌ NOT committed (keystore file)
│   └── ...
├── .gitignore                              ✅ Lists ignored files
└── ...
```

---

## 🔄 CI/CD Integration

### For GitHub Actions or CI/CD:
1. **Encode your keystore file to Base64:**
   ```bash
   # Create Base64 encoded version of your keystore
   base64 -i android/app/trading_app_keystore.jks -o keystore-base64.txt
   
   # View the encoded content (copy this for GitHub Secrets)
   cat keystore-base64.txt
   ```

2. **Store credentials as GitHub Secrets:**
   - Go to repo → Settings → Secrets and variables → Actions
   - Add these secrets:
     - `PLAYSTORE_CREDENTIALS`: Paste contents of `playstore-credential.json`
     - `KEYSTORE_FILE`: Paste the Base64 encoded keystore (from `keystore-base64.txt`)
     - `KEYSTORE_PASSWORD`: The password
     - `KEYSTORE_ALIAS`: `trading_app_key`
     - `KEYSTORE_KEY_PASSWORD`: The key password

2. **In your GitHub Actions workflow:**
   ```yaml
   - name: Setup credentials
     env:
       PLAYSTORE_CREDENTIALS: ${{ secrets.PLAYSTORE_CREDENTIALS }}
       KEYSTORE_FILE: ${{ secrets.KEYSTORE_FILE }}
     run: |
       echo "$PLAYSTORE_CREDENTIALS" > android/playstore-credential.json
       echo "$KEYSTORE_FILE" | base64 -d > android/app/trading_app_keystore.jks
       echo "MYAPP_RELEASE_STORE_PASSWORD=${{ secrets.KEYSTORE_PASSWORD }}" >> android/gradle.properties
       echo "MYAPP_RELEASE_KEY_PASSWORD=${{ secrets.KEYSTORE_KEY_PASSWORD }}" >> android/gradle.properties
   ```

---

## ✅ Verification Checklist

- [ ] `.gitignore` includes `playstore-credential.json`
- [ ] `.gitignore` includes `gradle.properties`
- [ ] `.gitignore` includes `*.jks` files (except debug.keystore)
- [ ] `playstore-credential.json` is NOT in git history (`git log -- android/playstore-credential.json`)
- [ ] `gradle.properties` is NOT in git history
- [ ] Template file `playstore-credential.json.template` IS in git
- [ ] Running `git status` shows `android/playstore-credential.json` as untracked (red)
- [ ] Running `npm run build:android:bundle` works locally with your credentials

---

## 🚨 If Credentials Are Leaked

**Immediately:**
1. ✅ Revoke the compromised Service Account in Google Cloud Console
2. ✅ Delete/regenerate the keystore file
3. ✅ Create new credentials
4. ✅ Update GitHub Secrets (if using CI/CD)
5. ✅ Inform your team about the security incident

**To remove from Git history:**
```bash
# Use git filter to remove sensitive file from history
git filter-branch --tree-filter 'rm -f android/playstore-credential.json' -- --all

# Force push to remote (DANGEROUS - coordinate with team!)
git push --force-with-lease origin main
```

---

## 💡 Best Practices

1. **Local Development**
   - Keep credentials in `android/` but never commit
   - Add to `.gitignore` immediately
   - Use different credentials for dev/production if possible

2. **Team Development**
   - Store credentials outside the repo (password manager)
   - Share credentials securely (1Password, LastPass, etc.)
   - Each developer has their own copy locally

3. **Production/CI-CD**
   - Use GitHub Secrets for sensitive data
   - Never print secrets in logs
   - Use environment variables for credentials
   - Rotate credentials regularly

4. **Backup**
   - ✅ DO: Backup keystore file to secure location
   - ✅ DO: Store password in password manager
   - ❌ DON'T: Backup to iCloud/Dropbox/Google Drive
   - ❌ DON'T: Email keystore files

---

## 📚 Related Files

- `.gitignore` - Git ignore rules
- `DEPLOYMENT_CHECKLIST.md` - Step-by-step deployment guide
- `GOOGLE_PLAY_DEPLOYMENT.md` - Complete deployment documentation
- `deploy-helper.sh` - Interactive deployment helper script

---

## 📝 How to Create Base64 Encoded Keystore File

### What is Base64 Encoding?
Base64 encoding converts binary files (like `.jks` keystore) into plain text format that can be safely stored as GitHub Secrets. When your CI/CD workflow runs, it decodes this text back into the binary keystore file.

### Step-by-Step Guide

#### Option 1: Using Terminal (macOS/Linux)

**Step 1: Ensure you have your keystore file**
```bash
# Check if keystore exists
ls -la android/app/trading_app_keystore.jks

# If not, create one first:
keytool -genkey -v -keystore ~/trading_app_keystore.jks \
  -keyalg RSA -keysize 2048 -validity 10000 \
  -alias trading_app_key

# Copy to project
cp ~/trading_app_keystore.jks android/app/
```

**Step 2: Encode to Base64**
```bash
# Create Base64 encoded version
base64 -i android/app/trading_app_keystore.jks -o keystore-base64.txt
```

**Step 3: View the encoded content**
```bash
# Display the Base64 string (for copying to GitHub)
cat keystore-base64.txt
```

**Step 4: Copy to GitHub Secrets**
```bash
# Copy the Base64 content to clipboard (macOS)
cat keystore-base64.txt | pbcopy

# Or print to view and manually copy
cat keystore-base64.txt
```

**Step 5: Store in GitHub Secrets**
1. Go to: GitHub → Repository → Settings → Secrets and variables → Actions
2. Click "New repository secret"
3. Name: `KEYSTORE_FILE`
4. Value: Paste the Base64 string you copied
5. Click "Add secret"

#### Option 2: Windows PowerShell
```powershell
# Encode keystore to Base64
$file = "android/app/trading_app_keystore.jks"
$base64 = [Convert]::ToBase64String([IO.File]::ReadAllBytes($file))
$base64 | Set-Clipboard

# Now paste in GitHub Secrets
```

#### Option 3: Create a Helper Script
```bash
#!/bin/bash
# save as: encode-keystore.sh

if [ ! -f "android/app/trading_app_keystore.jks" ]; then
  echo "❌ Keystore file not found!"
  exit 1
fi

echo "🔐 Encoding keystore to Base64..."
base64 -i android/app/trading_app_keystore.jks -o keystore-base64.txt

echo "✅ Base64 encoded keystore created: keystore-base64.txt"
echo ""
echo "📋 Content (copy this to GitHub Secrets as KEYSTORE_FILE):"
echo "---"
cat keystore-base64.txt
echo ""
echo "---"
echo ""
echo "To copy to clipboard (macOS): cat keystore-base64.txt | pbcopy"
```

Make it executable:
```bash
chmod +x encode-keystore.sh
./encode-keystore.sh
```

### Verification

**Verify the Base64 encoding is correct:**
```bash
# Decode back to original (test)
base64 -D -i keystore-base64.txt -o keystore-test.jks

# Compare with original (should be identical)
diff android/app/trading_app_keystore.jks keystore-test.jks

# Clean up test file
rm keystore-test.jks
```

### ⚠️ Important Notes

- ✅ The Base64 file (`keystore-base64.txt`) is plain text and looks like gibberish - this is normal!
- ✅ You can safely share the Base64 encoded version (not the original `.jks`)
- ❌ Never commit `keystore-base64.txt` to Git (add to `.gitignore`)
- ❌ Never commit the original `trading_app_keystore.jks` file to Git
- ✅ Store the original keystore file locally in a safe location
- ✅ Store the keystore password in a password manager

### Example Base64 Output
Your Base64 encoded keystore will look something like:
```
/u3+7QAA...very long string...ABCD/w==
```

This entire long string goes into the GitHub Secret `KEYSTORE_FILE`.

### Using in GitHub Actions

Once stored as a GitHub Secret, your CI/CD workflow can use it like this:

```yaml
name: Build and Deploy

on: [push]

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Java
        uses: actions/setup-java@v2
        with:
          java-version: '11'
      
      - name: Setup Node
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      
      - name: Decode and setup keystore
        env:
          KEYSTORE_FILE: ${{ secrets.KEYSTORE_FILE }}
          KEYSTORE_PASSWORD: ${{ secrets.KEYSTORE_PASSWORD }}
          KEYSTORE_KEY_PASSWORD: ${{ secrets.KEYSTORE_KEY_PASSWORD }}
        run: |
          # Decode Base64 to binary keystore
          echo "$KEYSTORE_FILE" | base64 -d > android/app/trading_app_keystore.jks
          
          # Create gradle.properties with keystore config
          echo "MYAPP_RELEASE_STORE_FILE=app/trading_app_keystore.jks" >> android/gradle.properties
          echo "MYAPP_RELEASE_STORE_PASSWORD=$KEYSTORE_PASSWORD" >> android/gradle.properties
          echo "MYAPP_RELEASE_KEY_ALIAS=trading_app_key" >> android/gradle.properties
          echo "MYAPP_RELEASE_KEY_PASSWORD=$KEYSTORE_KEY_PASSWORD" >> android/gradle.properties
      
      - name: Build signed APK/AAB
        run: npm run build:android:bundle
      
      - name: Upload to Play Store
        run: |
          # Add your Play Store upload script here
          echo "Uploading to Google Play Store..."
```

---

## 🆘 Troubleshooting

### Error: "Could not find playstore-credential.json"
**Solution:** Create the file locally (don't commit it)
```bash
cp android/playstore-credential.json.template android/playstore-credential.json
# Edit and add your actual credentials
```

### Error: "Push rejected - contains secrets"
**Solution:** 
1. Remove the file: `git rm --cached android/playstore-credential.json`
2. Add to .gitignore
3. Amend commit: `git commit --amend`
4. Force push: `git push --force-with-lease`

### GitHub showing "Secret scanning alert"
**Solution:** Go to repository → Security → Secret scanning → Review and dismiss alerts

---

## 📞 Support

For more information:
- [GitHub - Secret Scanning](https://docs.github.com/code-security/secret-scanning)
- [Google Cloud - Service Accounts](https://cloud.google.com/iam/docs/service-accounts)
- [React Native - Signing APK](https://reactnative.dev/docs/signed-apk-android)

---

**Last Updated**: October 27, 2025
**Status**: ✅ Secure - No credentials in repository
