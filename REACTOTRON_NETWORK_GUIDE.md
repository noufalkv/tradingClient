# How to See Network Calls in Reactotron

## 🌐 Network Monitoring in Reactotron

Reactotron can monitor and display all network requests made by your React Native app in real-time. Here's how to use it:

## 📊 Accessing Network Calls in Reactotron

### Step 1: Open Reactotron
- **Browser**: http://localhost:9090
- **macOS App**: Look for Reactotron in your Applications/Dock

### Step 2: Find the Network Tab
In the Reactotron interface, look for the **"Network"** or **"Networking"** tab in the sidebar. It usually displays:
- 🔵 All network requests made by your app
- 🟢 Successful responses (status 200-299)
- 🔴 Failed requests (errors, 4xx, 5xx)

### Step 3: Interact with Your App
Make API calls in your React Native app:
- Login/Logout calls
- Data fetching
- Form submissions
- Real-time updates

You'll see each request appear in Reactotron with:
- **URL** - The endpoint being called
- **Method** - GET, POST, PUT, DELETE, etc.
- **Status** - HTTP status code (200, 404, 500, etc.)
- **Duration** - How long the request took
- **Headers** - Request and response headers
- **Payload** - Request body and response data
- **Timestamp** - When the request was made

## 📋 What Information You Can See

Each network entry shows:

```
Method: GET
URL: https://api.example.com/users
Status: 200 OK
Duration: 245ms
Size: 4.2 KB
Headers:
  Content-Type: application/json
  Authorization: Bearer token...
Response: 
  { "users": [...], "total": 100 }
```

## 🔍 Filtering & Searching

In Reactotron's Network tab:
- **Search** by URL, method, or status
- **Filter** by:
  - Status code (2xx, 4xx, 5xx)
  - Request method (GET, POST, etc.)
  - Domain
  - Success/Failure

## 📸 Network Tab Features

### View Request Details
Click on any request to see:
- Full URL with query parameters
- All headers (sent and received)
- Request body (for POST, PUT, PATCH)
- Complete response body
- Timing breakdown

### Copy/Export
- Copy URL, headers, or body as JSON
- Export network logs for analysis
- Share with team members

### Timeline View
See all requests in chronological order with:
- Duration of each request
- Waterfall timeline
- Parallel requests
- Network waterfall diagram

## 🛠️ Configuration in Your App

Your app is already configured to monitor:

✅ **Fetch API calls** - All fetch() requests
✅ **XHR requests** - XMLHttpRequest
✅ **Network timing** - Request/response duration
✅ **Headers** - All HTTP headers
✅ **Payloads** - Request and response bodies
✅ **Errors** - Failed requests with error messages

### Current Config (reactotronConfig.js)
```javascript
networking: {
  ignoreUrls: /symbolicate/,        // Ignore source map lookups
  ignoreContentTypes: /^(image)\//, // Ignore image requests
  enableXHR: true,                  // Enable XHR monitoring
},
```

## 🚀 Making Your First Network Call

### Example: Login API Call
1. Go to login screen in your app
2. Enter credentials and submit
3. Watch Reactotron's Network tab
4. You'll see:
   ```
   POST /api/auth/login
   Status: 200
   Response: { token: "...", user: {...} }
   ```

### Example: Fetching Data
1. Navigate to a screen that loads data
2. Reactotron shows:
   ```
   GET /api/stocks?page=1&limit=10
   Status: 200
   Duration: 156ms
   Response: { stocks: [...], total: 250 }
   ```

## 📱 Common Issues & Solutions

### Network Calls Not Showing?

**Problem**: No network calls appear in Reactotron
**Solutions**:
1. Verify app is running: `npm run android`
2. Check ADB connection: `adb devices`
3. Verify port forwarding: `adb reverse tcp:9090 tcp:9090`
4. Restart Reactotron: `reactotron`
5. Check Metro bundler is running: `npm start`

### Can't See Request Body?

Make sure your axios/fetch is using the correct content-type:
```javascript
// ✅ Correct
axios.post('/api/login', data, {
  headers: { 'Content-Type': 'application/json' }
});

// ✅ Also correct (axios auto-detects)
axios.post('/api/login', data);
```

### Network Calls Showing as Failed?

1. Check the **Status code** (should be 2xx for success)
2. Look at the **Response body** for error message
3. Check **Headers** for missing Authorization, CORS issues
4. Use browser DevTools to verify the same API works

## 💡 Pro Tips

1. **Search by URL**: Use Reactotron search to find specific API calls
2. **Monitor in Real-Time**: Keep Reactotron open while testing
3. **Copy Responses**: Right-click on response to copy and paste into testing tools
4. **Compare Requests**: Open multiple network entries to compare
5. **Timing Analysis**: Use duration to identify slow API calls

## 🎯 Next Steps

1. **Build Features** - Make API calls in your app
2. **Monitor Requests** - Watch them appear in Reactotron
3. **Debug Issues** - Inspect failed requests for error details
4. **Optimize** - Identify slow requests to optimize
5. **Share Data** - Export network logs for team discussion

---

**Last Updated**: October 29, 2025
**Setup**: ✅ Configured and Ready to Use
**Port**: 9090
**Host**: 192.168.70.150
