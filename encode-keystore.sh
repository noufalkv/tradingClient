#!/bin/bash

# 🔐 Keystore Base64 Encoder for GitHub Secrets
# This script encodes your Android keystore file to Base64 for GitHub Secrets storage

set -e

# Color codes for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}🔐 Keystore Base64 Encoder${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Check if keystore exists
KEYSTORE_FILE="android/app/my_trading_keystore.jks"

if [ ! -f "$KEYSTORE_FILE" ]; then
    echo -e "${RED}❌ Keystore file not found at: $KEYSTORE_FILE${NC}"
    echo ""
    echo "To create a keystore, run:"
    echo "  keytool -genkey -v -keystore ~/my_trading_keystore.jks \\"
    echo "    -keyalg RSA -keysize 2048 -validity 10000 \\"
    echo "    -alias trading_app_key"
    echo ""
    echo "Then copy it to the project:"
    echo "  cp ~/my_trading_keystore.jks android/app/"
    exit 1
fi

echo -e "${GREEN}✅ Keystore file found: $KEYSTORE_FILE${NC}"
echo ""

# Check file size
FILE_SIZE=$(du -h "$KEYSTORE_FILE" | cut -f1)
echo "📊 File size: $FILE_SIZE"
echo ""

# Encode to Base64
OUTPUT_FILE="keystore-base64.txt"
echo -e "${YELLOW}⏳ Encoding keystore to Base64...${NC}"
base64 -i "$KEYSTORE_FILE" -o "$OUTPUT_FILE"
echo -e "${GREEN}✅ Base64 file created: $OUTPUT_FILE${NC}"
echo ""

# Display statistics
BASE64_SIZE=$(du -h "$OUTPUT_FILE" | cut -f1)
BASE64_LINES=$(wc -l < "$OUTPUT_FILE")
echo "📊 Base64 file size: $BASE64_SIZE"
echo "📊 Number of lines: $BASE64_LINES"
echo ""

# Verify encoding
echo -e "${YELLOW}✅ Verifying encoding...${NC}"
base64 -D -i "$OUTPUT_FILE" -o keystore-verify.jks
if diff "$KEYSTORE_FILE" keystore-verify.jks > /dev/null; then
    echo -e "${GREEN}✅ Verification successful! Encoding is correct.${NC}"
    rm keystore-verify.jks
else
    echo -e "${RED}❌ Verification failed! Encoding may be corrupted.${NC}"
    rm keystore-verify.jks
    exit 1
fi
echo ""

# Display the Base64 content
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}📋 Base64 Encoded Keystore Content${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""
cat "$OUTPUT_FILE"
echo ""
echo ""

# Copy to clipboard based on OS
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    cat "$OUTPUT_FILE" | pbcopy
    echo -e "${GREEN}✅ Copied to clipboard! (macOS)${NC}"
    echo ""
    echo "📌 Steps to add to GitHub Secrets:"
    echo "  1. Go to: GitHub → Repository → Settings → Secrets and variables → Actions"
    echo "  2. Click 'New repository secret'"
    echo "  3. Name: ${YELLOW}KEYSTORE_FILE${NC}"
    echo "  4. Value: Paste (Cmd+V) the Base64 content"
    echo "  5. Click 'Add secret'"
    echo ""
elif [[ "$OSTYPE" == "linux"* ]]; then
    # Linux
    if command -v xclip &> /dev/null; then
        cat "$OUTPUT_FILE" | xclip -selection clipboard
        echo -e "${GREEN}✅ Copied to clipboard! (Linux)${NC}"
    else
        echo -e "${YELLOW}⚠️ xclip not found. Manually copy the content above.${NC}"
    fi
elif [[ "$OSTYPE" == "msys" || "$OSTYPE" == "cygwin" ]]; then
    # Windows
    cat "$OUTPUT_FILE" | clip
    echo -e "${GREEN}✅ Copied to clipboard! (Windows)${NC}"
fi

echo ""
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}📚 Next Steps${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""
echo "1. ✅ Base64 content is ready (see above)"
echo "2. ⏭️  Go to GitHub → Repository → Settings → Secrets"
echo "3. ⏭️  Add these secrets:"
echo "     - KEYSTORE_FILE: (paste the Base64 content)"
echo "     - KEYSTORE_PASSWORD: (your keystore password)"
echo "     - KEYSTORE_KEY_PASSWORD: (your key password)"
echo ""
echo "4. ⏭️  Your CI/CD workflow can now decode it:"
echo "     echo \"\${{ secrets.KEYSTORE_FILE }}\" | base64 -d > android/app/my_trading_keystore.jks"
echo ""
echo -e "${GREEN}Done! 🎉${NC}"
echo ""

# Cleanup note
echo -e "${YELLOW}⚠️  Security Reminder:${NC}"
echo "  ❌ DO NOT commit keystore-base64.txt to Git"
echo "  ❌ DO NOT commit android/app/my_trading_keystore.jks to Git"
echo "  ✅ Add to .gitignore (already done)"
echo "  ✅ Store keystore password in password manager"
echo "  ✅ Backup original keystore file to safe location"
echo ""
