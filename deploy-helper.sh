#!/bin/bash

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}React Native Play Store Deploy Helper${NC}"
echo -e "${BLUE}========================================${NC}\n"

# Check if Java is installed
if ! command -v java &> /dev/null; then
    echo -e "${RED}Error: Java is not installed${NC}"
    echo "Install Java first: brew install openjdk"
    exit 1
fi

echo -e "${GREEN}✓ Java found${NC}\n"

# Menu
echo -e "${YELLOW}What would you like to do?${NC}"
echo "1) Create a new keystore file"
echo "2) Build signed APK"
echo "3) Build signed AAB (App Bundle)"
echo "4) Build both APK and AAB"
echo "5) Verify signed APK/AAB"
echo "6) Show keystore info"
read -p "Enter your choice (1-6): " choice

case $choice in
    1)
        echo -e "\n${YELLOW}Creating new keystore file...${NC}"
        read -p "Enter keystore file name (default: trading_app_keystore.jks): " keystore_name
        keystore_name=${keystore_name:-trading_app_keystore.jks}
        
        read -p "Enter keystore location (default: ~/): " keystore_path
        keystore_path=${keystore_path:-~/}
        
        read -p "Enter key alias (default: trading_app_key): " key_alias
        key_alias=${key_alias:-trading_app_key}
        
        full_path="${keystore_path}/${keystore_name}"
        
        keytool -genkey -v -keystore "$full_path" -keyalg RSA -keysize 2048 -validity 10000 -alias "$key_alias"
        
        if [ $? -eq 0 ]; then
            echo -e "\n${GREEN}✓ Keystore created successfully!${NC}"
            echo -e "${YELLOW}Keystore path: $full_path${NC}"
            echo -e "${YELLOW}Add this to android/gradle.properties:${NC}"
            echo "MYAPP_RELEASE_STORE_FILE=$keystore_name"
            echo "MYAPP_RELEASE_STORE_PASSWORD=your_password"
            echo "MYAPP_RELEASE_KEY_ALIAS=$key_alias"
            echo "MYAPP_RELEASE_KEY_PASSWORD=your_key_password"
        fi
        ;;
    
    2)
        echo -e "\n${YELLOW}Building signed APK...${NC}"
        cd android
        ./gradlew assembleRelease
        if [ $? -eq 0 ]; then
            echo -e "\n${GREEN}✓ APK built successfully!${NC}"
            echo -e "${YELLOW}Output: android/app/build/outputs/apk/release/app-release.apk${NC}"
        else
            echo -e "\n${RED}✗ APK build failed${NC}"
        fi
        cd ..
        ;;
    
    3)
        echo -e "\n${YELLOW}Building signed App Bundle (AAB)...${NC}"
        cd android
        ./gradlew bundleRelease
        if [ $? -eq 0 ]; then
            echo -e "\n${GREEN}✓ AAB built successfully!${NC}"
            echo -e "${YELLOW}Output: android/app/build/outputs/bundle/release/app-release.aab${NC}"
            echo -e "${YELLOW}Upload this to Google Play Store${NC}"
        else
            echo -e "\n${RED}✗ AAB build failed${NC}"
        fi
        cd ..
        ;;
    
    4)
        echo -e "\n${YELLOW}Building signed APK and AAB...${NC}"
        cd android
        echo -e "\n${BLUE}Building APK...${NC}"
        ./gradlew assembleRelease
        echo -e "\n${BLUE}Building AAB...${NC}"
        ./gradlew bundleRelease
        
        if [ $? -eq 0 ]; then
            echo -e "\n${GREEN}✓ Both APK and AAB built successfully!${NC}"
            echo -e "${YELLOW}APK: android/app/build/outputs/apk/release/app-release.apk${NC}"
            echo -e "${YELLOW}AAB: android/app/build/outputs/bundle/release/app-release.aab${NC}"
        else
            echo -e "\n${RED}✗ Build failed${NC}"
        fi
        cd ..
        ;;
    
    5)
        echo -e "\n${YELLOW}Verifying signed files...${NC}"
        
        if [ -f "android/app/build/outputs/apk/release/app-release.apk" ]; then
            echo -e "${BLUE}Verifying APK...${NC}"
            jarsigner -verify -verbose -certs android/app/build/outputs/apk/release/app-release.apk
        fi
        
        if [ -f "android/app/build/outputs/bundle/release/app-release.aab" ]; then
            echo -e "\n${BLUE}Verifying AAB...${NC}"
            jarsigner -verify -verbose -certs android/app/build/outputs/bundle/release/app-release.aab
        fi
        ;;
    
    6)
        echo -e "\n${YELLOW}Keystore information:${NC}"
        read -p "Enter keystore file path: " keystore_file
        
        if [ -f "$keystore_file" ]; then
            keytool -list -v -keystore "$keystore_file"
        else
            echo -e "${RED}Keystore file not found${NC}"
        fi
        ;;
    
    *)
        echo -e "${RED}Invalid choice${NC}"
        exit 1
        ;;
esac

echo -e "\n${GREEN}Done!${NC}\n"
