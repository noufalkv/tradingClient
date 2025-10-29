# Reactotron 426 Error - Explanation & Solution

## 🔍 What's the 426 Error?

**HTTP 426 - "Upgrade Required"** is expected and **NOT an error** in Reactotron's case.

### Why You See 426:
- Reactotron requires **WebSocket** connection (not plain HTTP)
- When something tries to access `http://localhost:9090` with regular HTTP, it responds with 426
- This tells the client: "You need to upgrade to WebSocket protocol"

### Where 426 Appears:
- 🔴 Browser console when you open http://localhost:9090 in browser
- ⚠️ Network requests tab showing failed requests
- ℹ️ Any tool trying to access Reactotron via HTTP instead of WebSocket

## ✅ This is Normal & Expected

The React Native app **connects correctly** via WebSocket (not HTTP), so:
- Your app connection works fine
- Network monitoring works fine
- Debugging works fine
- **426 error is harmless**

Think of it like an error message that says: "If you want to talk to me, upgrade your protocol" - the app already has the right protocol, so it works!

## 🎯 How to Use Reactotron Correctly

### Method 1: Desktop App (Recommended)
```bash
# Terminal 1: Start Metro bundler
npm start

# Terminal 2: Build and run app
npm run android

# Terminal 3: Start Reactotron
reactotron
```

The desktop app handles the WebSocket upgrade automatically. No 426 errors in your face.

### Method 2: Browser Console
**Don't** open `http://localhost:9090` in browser for viewing data. Use the **desktop app** instead.

If you do open it in browser, the 426 is expected.

## 🛠️ Troubleshooting

### If Network Calls Don't Show:

1. **Check Reactotron is Running**
   ```bash
   lsof -i :9090
   ```
   Should show: `Reactotron ... (LISTEN)`

2. **Check Port Forwarding**
   ```bash
   adb reverse tcp:9090 tcp:9090
   ```

3. **Check Metro Bundler**
   ```bash
   npm start
   ```

4. **Restart Everything**
   ```bash
   # Kill all
   pkill -f "reactotron"
   pkill -f "node"
   npm run android
   reactotron
   ```

### If 426 Error Bothers You:

It's harmless, but if you want to suppress it:

1. **In Browser DevTools**: Disable console messages from certain sources
2. **In Reactotron App**: It doesn't show this error
3. **Use Desktop App**: No browser, no 426 errors!

## 📊 Real Usage Flow

```
Your Machine          Device (Samsung)
    ↓                      ↓
[Reactotron] ◄--WebSocket--► [React Native App]
Port 9090                   (Connected via ADB)
```

The connection is **WebSocket**, not HTTP. So:
- ✅ Real-time communication works
- ✅ Network requests appear instantly
- ✅ Logs stream in real-time
- ✅ No 426 errors in the flow (only when trying HTTP)

## 🎯 How to View Network Calls (Correctly)

1. **Open Reactotron Desktop App**
   ```bash
   reactotron
   ```

2. **Click "Network" tab** in the app

3. **Use Your React Native App** (make API calls)

4. **Watch Network Tab** for requests to appear

5. **Click Any Request** to see full details

No browser needed, no 426 errors!

## 📱 Example: Testing Network Monitoring

### Step 1: Start Everything
```bash
# Terminal 1
npm start

# Terminal 2
npm run android

# Terminal 3
reactotron
```

### Step 2: In Reactotron App
- Look for "Network" or "Networking" tab
- Leave it open and visible

### Step 3: In Your Phone
- Open the app (should launch automatically)
- Go to login screen
- Enter credentials
- Submit form

### Step 4: In Reactotron
- Watch the POST request appear in Network tab
- Click it to see full request/response

## 🚀 Success Indicators

✅ Reactotron Desktop App opens without errors
✅ Network tab exists and is empty initially
✅ When you make API calls, requests appear
✅ You can click requests to see details
✅ Response bodies are visible and readable

## ⚠️ Common Mistakes

❌ Opening http://localhost:9090 in browser expecting UI
   → Get 426 error
   → Use Reactotron desktop app instead

❌ Checking browser console for app logs
   → Won't show app logs there
   → Use Reactotron app's Logs tab instead

❌ Expecting HTTP connection to work
   → Reactotron uses WebSocket
   → Use desktop app for proper connection

## 💡 Pro Tip

**The 426 error is actually a feature!** It means:
- ✅ Reactotron server is running
- ✅ It's rejecting improper HTTP requests
- ✅ It only accepts proper WebSocket connections
- ✅ Your app is using proper WebSocket protocol

Think of it as a security feature - the server says "No HTTP here, WebSocket only!"

---

## Summary

| Aspect | Details |
|--------|---------|
| **426 Error Meaning** | Server requires WebSocket (normal) |
| **App Connection** | Uses WebSocket (works fine) |
| **Error Impact** | None - purely informational |
| **How to View Data** | Use Reactotron desktop app |
| **Where to Check** | Network tab in Reactotron UI |
| **Browser Usage** | Not needed for debugging |

**Status**: ✅ Everything working as expected
**Setup**: Complete
**Next**: Make API calls and watch them appear in Reactotron!

---
**Last Updated**: October 29, 2025
