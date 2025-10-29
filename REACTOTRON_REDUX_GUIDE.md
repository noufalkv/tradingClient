# How to View Redux Store in Reactotron

## 🔴 Redux State Monitoring

Reactotron can display your Redux store state, track actions, and show state changes in real-time. Here's how to use it:

## 📊 Accessing Redux State in Reactotron

### Step 1: Make Sure Everything is Running
```bash
# Terminal 1: Start Metro bundler
npm start

# Terminal 2: Build and run app
npm run android

# Terminal 3: Start Reactotron
reactotron
```

### Step 2: Open Reactotron App
- Look for the **Reactotron** desktop application window
- It should be running on port 9090

### Step 3: Find the Redux Tab
In the Reactotron interface, look for:
- **"State"** or **"Redux"** tab in the sidebar
- OR **"Timeline"** tab which shows Redux actions in chronological order

## 📋 What You Can See

### Current State
The **State** tab shows:
```json
{
  "user": {
    "name": "John Doe",
    "email": "john@example.com",
    "token": "eyJhbGc...",
    "isLoggedIn": true
  },
  "stock": {
    "stocks": [...],
    "loading": false,
    "error": null
  }
}
```

### State Changes Timeline
The **Timeline** tab shows:
- 🔄 Redux action dispatched
- 📝 Action type (e.g., `SET_USER_DATA`)
- 🧩 Action payload
- 📊 State before action
- 📊 State after action
- ⏱️ When it happened

### Example Timeline Entry:
```
Action: SET_USER_DATA
Payload: { email: "user@example.com", ... }
Previous State: { user: null, ... }
New State: { user: { email: "user@example.com", ... }, ... }
Time: 13:45:22.123
```

## 🎯 Viewing Redux Store Step by Step

### Method 1: View Current State
1. Open Reactotron
2. Click **"State"** or **"Redux"** tab
3. See full store state as JSON
4. Expand/collapse sections to inspect specific parts
5. Search for specific values

### Method 2: Track State Changes
1. Open Reactotron
2. Click **"Timeline"** tab
3. Use your app (login, navigate, etc.)
4. Watch Redux actions appear
5. Click any action to see before/after state
6. See exact differences highlighted

### Method 3: Search State
1. In State tab, use search/filter
2. Find specific keys or values
3. See only matching state slices

## 🛠️ Configuration in Your App

Your app is already configured with Redux integration:

✅ **Redux Enhancer**: Connectsre Redux store to Reactotron
✅ **State Logging**: All state changes captured
✅ **Action Tracking**: Every action is logged
✅ **Payload Details**: Full action payloads displayed
✅ **Diff View**: Before/after state comparison

### Configuration File: `src/redux/store.tsx`
```typescript
// Reactotron enhancer is added to the store
enhancers: (getDefaultEnhancers) => {
  const enhancers = getDefaultEnhancers();
  if (reactotronEnhancer) {
    enhancers.push(reactotronEnhancer);
  }
  return enhancers;
},
```

## 🚀 Example: Tracking a Login Action

### In Your App:
1. Go to login screen
2. Enter credentials
3. Click submit

### In Reactotron:
1. **Timeline** shows:
   ```
   ✓ API Request: POST /api/login
   ✓ Action: SET_USER_DATA
   ✓ Action: SET_LOADING (false)
   ```

2. Click on `SET_USER_DATA` action to see:
   ```
   Previous State:
   {
     user: null,
     isLoggedIn: false
   }
   
   Action Payload:
   {
     id: "12345",
     name: "John Doe",
     email: "john@example.com"
   }
   
   New State:
   {
     user: {
       id: "12345",
       name: "John Doe",
       email: "john@example.com"
     },
     isLoggedIn: true
   }
   ```

3. See the exact changes highlighted in the diff

## 📱 Common Redux Actions to Observe

Watch Reactotron for these actions in your app:

| Action | When It Happens | State Changes |
|--------|-----------------|---------------|
| `SET_USER_DATA` | After login | `user` object populated |
| `SET_LOADING` | During API call | `loading: true/false` |
| `SET_ERROR` | When API fails | `error` message set |
| `SET_STOCKS` | Data loaded | `stocks` array updated |
| `CLEAR_USER` | After logout | `user: null` |

## 💡 Tips for Redux Debugging

### 1. Watch State Changes
- Keep Timeline tab open
- Perform actions in app
- See exactly what changed and when

### 2. Inspect Large State
- Use State tab search/filter
- Collapse unnecessary sections
- Focus on relevant parts

### 3. Compare Before/After
- Click any action in Timeline
- See side-by-side comparison
- Identify unwanted state changes

### 4. Replay Actions
Some Reactotron versions allow:
- Right-click action → "Replay"
- Re-dispatch action with same payload
- Test action handling

### 5. Check State Mutations
- Look for unexpected state changes
- Verify immutability (Redux requires)
- Catch bugs early

## 🔍 Troubleshooting Redux in Reactotron

### Problem: Redux State Not Appearing

**Solution 1: Verify Store Initialization**
```bash
# Check logs when app starts
npm run android
# Look for: "✅ Reactotron Redux enhancer added"
```

**Solution 2: Restart Everything**
```bash
npm run android
reactotron
```

**Solution 3: Check Redux Actions Are Dispatching**
- In app, perform actions (login, navigate)
- Check Reactotron Timeline tab
- See if actions appear

### Problem: Actions Appear But No State

**Solution**:
1. Click on the action in Timeline
2. State tab on right should show before/after
3. If blank, verify reducer is updating state
4. Check Redux DevTools in browser (if web)

### Problem: State Shows Old Values

**Solution**:
- Reload app (pull down to refresh)
- Or navigate to trigger state change
- Reactotron updates in real-time

## 📊 Real-Time Monitoring

Keep these open while developing:

1. **Reactotron State Tab**: See current state
2. **Reactotron Timeline**: Watch actions
3. **Your App**: Use features, trigger actions
4. **Watch Both**: See correlations

## 🎓 Learning Redux Through Reactotron

### Good Exercises:
1. Login → Watch user state populate
2. Fetch data → See loading states change
3. Error → Catch in state
4. Logout → See state reset
5. Navigate → Track related state changes

### What to Look For:
- ✅ State updates when expected
- ✅ No unexpected mutations
- ✅ Proper loading/error states
- ✅ Correct data in store
- ✅ Clean logout resets state

## 🚀 Advanced Features

### Export State
- Right-click in State tab
- Copy state as JSON
- Paste into testing tools

### Search Actions
- Use Timeline search
- Find specific action types
- Filter by date/time

### Filter by Action Type
- Some versions allow filtering
- Show only specific actions
- Hide noise from other actions

---

## Quick Checklist

✅ Redux store configured
✅ Reactotron enhancer added to store
✅ App running with Redux actions
✅ Reactotron connected and listening
✅ State tab showing data
✅ Timeline tab tracking actions
✅ Actions visible when you use app

## Summary

| Task | How To |
|------|--------|
| **View Current State** | Open Reactotron → State tab |
| **Track State Changes** | Open Timeline tab → Perform actions |
| **See Action Details** | Click action in Timeline → View payload & diff |
| **Search State** | Use search bar in State tab |
| **Debug Reducers** | Compare before/after state in actions |
| **Monitor Loading** | Track SET_LOADING actions in Timeline |

---

**Status**: ✅ Redux Monitoring Configured
**Last Updated**: October 29, 2025
**Next**: Use your app and watch the Redux state change in Reactotron!
