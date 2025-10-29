# Reactotron Setup & Running Guide

## ✅ Current Configuration

### Reactotron Desktop App
- **Status**: Running on port 9090
- **Process ID**: 63176
- **Access**: http://localhost:9090

### React Native App Configuration
- **Device**: Samsung S23 Ultra (R5CW40TTGBR)
- **Connection**: USB via ADB
- **Reactotron Config**: `/debugger/reactotronConfig.js`
- **Machine IP**: 192.168.70.150
- **Port Forwarding**: `adb reverse tcp:9090 tcp:9090` ✅

## 🚀 Running Reactotron

The Reactotron desktop application is already running. To access it:

1. **Visit in Browser**: http://localhost:9090
2. **OR Check Dock**: Look for "Reactotron" application in macOS Dock
3. **OR In VS Code**: Install "Reactotron" extension if available

## 📱 App Connection

Your React Native app is configured to connect to Reactotron at:
```
Host: 192.168.70.150
Port: 9090
```

When the app runs, it will attempt to connect and send logs to Reactotron.

## ⚙️ Configuration Files

### `/debugger/reactotronConfig.js`
Configures Reactotron with:
- AsyncStorage handler for persistent state debugging
- Networking monitoring (ignores symbolicate)
- Redux integration ready
- React Native utilities

### `/App.tsx`
Imports Reactotron in development mode only:
```tsx
if (__DEV__) {
  require('./debugger/reactotronConfig');
}
```

## 🔧 Commands for Future Reference

```bash
# Start Metro bundler
npm start

# Build and run on device
npm run android

# Setup port forwarding for Reactotron
adb reverse tcp:9090 tcp:9090

# Start Reactotron CLI
reactotron
```

## 📊 Features Available

✅ App Logs - View console.log, warnings, errors
✅ Networking - Monitor API calls and responses
✅ AsyncStorage - Debug app state persistence
✅ React Native Utils - Native module debugging
✅ State Debugging - Redux/MobX state inspection (when configured)

## 🔗 Network Setup Notes

- **Device Network**: 10.33.75.222 (locked network)
- **Machine Network**: 192.168.70.150 (Wi-Fi)
- **Solution**: Using USB connection with ADB port forwarding
- **Reactotron**: Communicates through forwarded port 9090

## 📝 Next Steps

1. Verify app is running on device
2. Check browser console at http://localhost:9090
3. Monitor app logs as you interact with the app
4. Use debugger to inspect network requests and state

---

**Setup Date**: October 29, 2025
**Status**: ✅ Configured & Running
