# 🔐 Base64 Keystore Encoding - Quick Reference

## TL;DR (Quick Version)

```bash
# Step 1: Encode your keystore
./encode-keystore.sh

# Step 2: Copy the Base64 output to GitHub Secrets
# Go to: Settings → Secrets and variables → Actions → New secret
# Name: KEYSTORE_FILE
# Value: [Paste the Base64 string]

# Step 3: Done! Your CI/CD can now use it
```

---

## 📊 What is Base64?

**Binary vs Text:**
- `.jks` file = Binary file (random bytes, can't be read as text)
- Base64 = Text representation of binary data
- Perfect for storing in GitHub Secrets (text-only)

**Example:**
```
Original binary keystore: 🔒 (binary data - can't store as text)
                          ↓
                     Base64 encode
                          ↓
Text string: /u3+7QAA...ABCD/w== (can store anywhere!)
                          ↓
                     Base64 decode
                          ↓
Original binary keystore: 🔒 (restored perfectly)
```

---

## 🎯 Step-by-Step Guide

### Step 1: Create Keystore (if you don't have one)

```bash
keytool -genkey -v -keystore ~/trading_app_keystore.jks \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000 \
  -alias trading_app_key
```

When prompted, enter:
- Keystore password: `your_password_here` (remember this!)
- First/last name: Your name
- Organization: Your company
- Confirm: `yes`

```bash
# Copy to project
cp ~/trading_app_keystore.jks android/app/
```

### Step 2: Run the Encoder Script

```bash
./encode-keystore.sh
```

**What it does:**
1. ✅ Checks if keystore file exists
2. ✅ Encodes it to Base64
3. ✅ Verifies the encoding is correct
4. ✅ Displays the Base64 content
5. ✅ Copies to clipboard (macOS)

**Output:**
```
========================================
🔐 Keystore Base64 Encoder
========================================

✅ Keystore file found: android/app/trading_app_keystore.jks

📊 File size: 2.2K
⏳ Encoding keystore to Base64...
✅ Base64 file created: keystore-base64.txt
✅ Verification successful! Encoding is correct.

📋 Base64 Encoded Keystore Content
========================================

/u3+7QAA2cwxAASJKBAADH...
[very long string here]
...ABCD/w==

✅ Copied to clipboard! (macOS)
```

### Step 3: Add to GitHub Secrets

**Via GitHub Web UI:**

1. Go to your repository on GitHub
2. Click **Settings** (tab at top)
3. Click **Secrets and variables** → **Actions** (left sidebar)
4. Click **New repository secret**
5. Fill in:
   - **Name:** `KEYSTORE_FILE`
   - **Value:** Paste the Base64 string (Cmd+V)
6. Click **Add secret** button

**Via GitHub CLI:**

```bash
# Install GitHub CLI first: https://cli.github.com

# Set the KEYSTORE_FILE secret
gh secret set KEYSTORE_FILE < keystore-base64.txt
```

### Step 4: Add Other Required Secrets

```bash
# KEYSTORE_PASSWORD (the password you used when creating keystore)
gh secret set KEYSTORE_PASSWORD -b "your_keystore_password"

# KEYSTORE_KEY_PASSWORD (usually same as KEYSTORE_PASSWORD)
gh secret set KEYSTORE_KEY_PASSWORD -b "your_key_password"

# PLAYSTORE_CREDENTIALS (Google Play Service Account JSON)
gh secret set PLAYSTORE_CREDENTIALS < android/playstore-credential.json
```

---

## 🔄 Using in GitHub Actions

### Example CI/CD Workflow

```yaml
name: Build & Deploy

on:
  push:
    branches: [main, develop]

jobs:
  build-release:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Java
        uses: actions/setup-java@v3
        with:
          java-version: '11'
          distribution: 'temurin'
      
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: 🔐 Decode and setup keystore
        env:
          KEYSTORE_FILE: ${{ secrets.KEYSTORE_FILE }}
        run: |
          # Decode Base64 to binary keystore file
          echo "$KEYSTORE_FILE" | base64 -d > android/app/trading_app_keystore.jks
          
          # Verify it was created successfully
          ls -la android/app/trading_app_keystore.jks
      
      - name: Configure Gradle signing
        env:
          KEYSTORE_PASSWORD: ${{ secrets.KEYSTORE_PASSWORD }}
          KEYSTORE_KEY_PASSWORD: ${{ secrets.KEYSTORE_KEY_PASSWORD }}
        run: |
          cat >> android/gradle.properties << EOF
          MYAPP_RELEASE_STORE_FILE=app/trading_app_keystore.jks
          MYAPP_RELEASE_STORE_PASSWORD=$KEYSTORE_PASSWORD
          MYAPP_RELEASE_KEY_ALIAS=trading_app_key
          MYAPP_RELEASE_KEY_PASSWORD=$KEYSTORE_KEY_PASSWORD
          EOF
      
      - name: Build signed AAB
        run: npm run build:android:bundle
      
      - name: Verify signed AAB
        run: |
          ls -la android/app/build/outputs/bundle/release/
      
      - name: Upload to Play Store
        env:
          PLAYSTORE_CREDENTIALS: ${{ secrets.PLAYSTORE_CREDENTIALS }}
        run: |
          echo "$PLAYSTORE_CREDENTIALS" > android/playstore-credential.json
          # Add your fastlane or Play Store upload script here
          echo "Uploading to Google Play Store..."
```

---

## ✅ Verification Checklist

- [ ] Keystore file created: `android/app/trading_app_keystore.jks`
- [ ] Base64 encoding script works: `./encode-keystore.sh`
- [ ] KEYSTORE_FILE secret added to GitHub
- [ ] KEYSTORE_PASSWORD secret added to GitHub
- [ ] KEYSTORE_KEY_PASSWORD secret added to GitHub
- [ ] PLAYSTORE_CREDENTIALS secret added to GitHub
- [ ] GitHub Actions workflow file created
- [ ] CI/CD pipeline successfully decodes keystore
- [ ] APK/AAB built successfully with signed configuration

---

## 🚨 Troubleshooting

### Error: "permission denied" when running script
```bash
chmod +x encode-keystore.sh
./encode-keystore.sh
```

### Error: "Keystore file not found"
```bash
# Make sure keystore exists at:
ls -la android/app/trading_app_keystore.jks

# If not, create it:
keytool -genkey -v -keystore ~/trading_app_keystore.jks \
  -keyalg RSA -keysize 2048 -validity 10000 \
  -alias trading_app_key
cp ~/trading_app_keystore.jks android/app/
```

### Error: "Base64 encoding verification failed"
- Keystore file might be corrupted
- Try encoding again or recreate the keystore

### Secret not working in GitHub Actions
- Make sure secret name exactly matches: `KEYSTORE_FILE`
- Double-check the Base64 string was pasted completely
- Test by echoing the secret: `echo ${{ secrets.KEYSTORE_FILE }}`

### "jks format is invalid" in CI/CD
- Base64 decoding failed
- Check the Base64 string is complete (ends with `==`)
- Verify with: `echo "..." | base64 -d | file -`

---

## 🔒 Security Best Practices

✅ **DO:**
- Store keystore file locally, not in Git
- Add `*.jks` to `.gitignore`
- Use Base64 for storing in GitHub Secrets
- Rotate credentials periodically
- Backup keystore file to secure location
- Use strong passwords for keystore

❌ **DON'T:**
- Commit `.jks` files to Git
- Share keystore file via email
- Store passwords in code
- Use weak passwords
- Commit Base64 file to Git (add to `.gitignore`)

---

## 📚 Related Files

- `CREDENTIALS_MANAGEMENT.md` - Complete credentials guide
- `encode-keystore.sh` - Automated encoding script
- `DEPLOYMENT_CHECKLIST.md` - Deployment steps
- `.gitignore` - Git ignore rules

---

## 💡 One-Liner Commands

```bash
# Encode and copy to clipboard (macOS)
base64 -i android/app/trading_app_keystore.jks | pbcopy

# Encode and save to file
base64 -i android/app/trading_app_keystore.jks > keystore-base64.txt

# Verify encoding
base64 -D -i keystore-base64.txt -o keystore-test.jks && diff android/app/trading_app_keystore.jks keystore-test.jks

# View size comparison
echo "Original size:" && ls -lh android/app/trading_app_keystore.jks
echo "Base64 size:" && ls -lh keystore-base64.txt
```

---

**Created**: October 27, 2025
**Status**: ✅ Ready to use
**Support**: See CREDENTIALS_MANAGEMENT.md for more info
