# Flipper Quick Reference

## 🚀 Start Debugging in 3 Steps

### 1. Start App
```bash
npm run android
```
Wait ~30 seconds for the app to fully load.

### 2. Open Flipper
Open the Flipper app on your Mac (you already have it installed).

### 3. Select Your App
Flipper should auto-detect `com.rn_trading_app` in the emulator.

---

## 📋 Common Tasks

### View Network Requests
1. Go to **Network** tab
2. Perform an action in your app
3. Click any request to view details

### Check App Logs
1. Go to **Logs** tab
2. See all console output from your app

### Inspect Database
1. Go to **Storage** tab
2. Select **Databases**
3. Browse stored data

### Debug UI Layout
1. Go to **Layout** tab
2. Click elements in your app to inspect
3. View component hierarchy

### Monitor Performance
1. Go to **Performance** tab
2. Watch CPU, Memory, Frame Rate in real-time

---

## 🔧 If Connection Fails

```bash
# Reconnect device
adb reconnect device

# Or full restart
adb kill-server
adb start-server

# Then rebuild app
npm run android
```

---

## ⚡ Important

- ✅ Only works in **debug builds**
- ✅ No impact on **release builds**
- ✅ Safe to use - won't crash app
- ✅ Auto-disabled in production

---

## 📚 More Info

See `FLIPPER_SETUP.md` for detailed guide.
