# React Native Flipper Setup Guide

## ✅ Overview

Flipper is a platform for debugging iOS and Android apps. It provides tools to inspect your app's network requests, databases, shared preferences, and more.

**Status:** ✅ Configured for this project

---

## 🎯 What We Installed

### NPM Packages
- `react-native-flipper` - React Native integration for Flipper

### Android Configuration
- Flipper Framework (v0.273.0)
- Flipper Network Plugin
- Flipper Fresco Plugin (for image debugging)

### Code Changes
- **`android/build.gradle`** - Added `FLIPPER_VERSION = "0.273.0"`
- **`android/app/build.gradle`** - Added Flipper dependencies
- **`MainApplication.kt`** - Initialized Flipper in onCreate()

---

## 📱 Prerequisites

You already have Flipper installed on your Mac. If not:

```bash
# On macOS (you already have this)
# Download from: https://www.fbflipper.com/
# Or install via Homebrew:
brew install flipper
```

---

## 🚀 Using Flipper

### Step 1: Start Your App on Emulator

```bash
npm run android
```

Wait for the app to fully load on the emulator.

### Step 2: Launch Flipper Desktop

1. Open Flipper app on your Mac
2. It should auto-detect your running app

### Step 3: Connect Your Device

Flipper should automatically:
- ✅ Detect your emulator (emulator-5554)
- ✅ Connect to your app (com.rn_trading_app)
- ✅ Show debugging tools

---

## 🛠️ Available Flipper Tools

Once connected, you can use:

| Tool | Purpose |
|------|---------|
| **Logs** | View console logs from your app |
| **Network** | Inspect HTTP requests/responses |
| **Layout Inspector** | Debug UI hierarchy and elements |
| **Storage** | View app databases and preferences |
| **Native Layout** | Inspect Android native views |
| **Performance** | Monitor CPU, memory, and frame rate |

---

## 🔍 Debugging Network Requests

With Flipper's Network plugin, you can:

1. **View all API calls** made by your app
2. **Inspect request/response headers**
3. **See response body** (JSON, XML, etc.)
4. **Check timing information**
5. **Replay requests** for testing

### Example Workflow

1. Open your app in Flipper
2. Go to **"Network"** tab
3. Perform an action in your app (login, fetch data, etc.)
4. Watch the requests appear in real-time
5. Click on any request to see full details

---

## 💾 Debugging Data Storage

### View Shared Preferences
1. Go to **"Storage"** tab
2. Select **"Shared Preferences"**
3. View all app data

### View Databases
1. Go to **"Storage"** tab
2. Select **"Databases"**
3. Browse database contents

---

## 🎨 Inspecting UI Layout

### Using Layout Inspector

1. Go to **"Layout"** tab
2. Click on elements in your app
3. See the component hierarchy
4. View props and styling information

### Tips
- Hover over elements to highlight them
- Right-click for more options
- Use the search function to find specific components

---

## 🔧 Troubleshooting

### Flipper Not Detecting App

**Problem:** App not showing in Flipper

**Solutions:**
1. Restart adb connection:
   ```bash
   adb kill-server && adb start-server
   ```

2. Rebuild the app:
   ```bash
   npm run android
   ```

3. Restart Flipper desktop app

### Network Plugin Not Showing

**Problem:** Network requests not visible in Flipper

**Solution:** This is expected if using basic HTTP. For debugging:
- Flipper Network Plugin tracks certain request types
- Not all APIs may be captured
- Check app logs for network errors

### Connection Issues

**Problem:** "Device offline" or connection timeout

**Solutions:**
```bash
# Check device connection
adb devices

# If offline, reconnect
adb reconnect device

# Restart adb
adb kill-server
adb start-server
```

---

## 📊 Performance Monitoring

1. Go to **"Performance"** tab
2. Monitor:
   - **CPU Usage** - Processor load
   - **Memory** - RAM consumption
   - **Frame Rate** - FPS (should be 60 for smooth animation)
   - **Storage** - Disk usage

### Optimization Tips
- Watch memory spikes during app actions
- Check frame drops during animations
- Identify CPU-intensive operations

---

## 🔐 Important Notes

### Production Builds

⚠️ **Flipper is only enabled in DEBUG builds**

- Release builds don't have Flipper
- No performance overhead in production
- Flipper code is wrapped in try-catch for safety

### Code Safety

The Flipper initialization uses reflection:
```kotlin
try {
    val aClass = Class.forName("com.facebook.flipper.ReactNativeFlipper")
    aClass.getMethod("initializeFlipper", ...)
        .invoke(null, app, packageName)
} catch (e: Exception) {
    e.printStackTrace()
}
```

This means:
- ✅ Flipper won't crash the app if unavailable
- ✅ Works safely in both debug and release
- ✅ No exceptions thrown in production

---

## 📚 Additional Resources

- **Official Flipper Docs:** https://fbflipper.com/
- **React Native Debugging:** https://reactnative.dev/docs/debugging
- **Network Debugging:** https://fbflipper.com/docs/extending/network-plugin

---

## 🎓 Common Workflows

### Debugging an API Call

1. Open Flipper Network tab
2. Trigger the API call in your app
3. Find the request in Flipper
4. Click to view:
   - Headers
   - Query parameters
   - Request body
   - Response body
   - Timing

### Inspecting Redux State

1. Use Layout Inspector tab
2. Click on a component
3. View the passed props (from Redux)
4. Verify state values

### Finding Memory Leaks

1. Open Performance tab
2. Perform actions that repeat (scroll, navigate)
3. Check memory graph for steadily increasing memory
4. Profile in Android Studio if issues found

---

## 🔄 Next Steps

1. **Build and run:** `npm run android`
2. **Open Flipper** on your Mac
3. **Inspect your app** in real-time
4. **Debug network requests** as you develop
5. **Monitor performance** during testing

---

## ✨ Files Modified

```
android/
├── build.gradle (Added FLIPPER_VERSION)
├── app/
│   └── build.gradle (Added Flipper dependencies)
└── app/src/main/java/com/rn_trading_app/
    └── MainApplication.kt (Initialized Flipper)

package.json
├── devDependencies added:
│   └── react-native-flipper
```

---

**Setup Complete!** 🎉

Your app is now ready for debugging with Flipper. Build and run the app, then open Flipper to start inspecting!
