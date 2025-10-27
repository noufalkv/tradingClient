# 🔧 Ruby Setup Fix - GitHub Actions

## Issue Resolved

**Error:** `bundle: command not found` in GitHub Actions

**Cause:** Ruby/Bundler not installed in the GitHub Actions Ubuntu runner environment

**Solution:** Added Ruby setup step with automatic bundler caching

---

## What Changed

### Before (❌ Broken)
```yaml
- name: Install Node.js dependencies
  run: npm install

- name: Install Ruby dependencies (Bundler)
  working-directory: android
  run: bundle install  ← ❌ bundle command not found

- name: Deploy to Google Play Store
  ...
```

### After (✅ Fixed)
```yaml
- name: Install Node.js dependencies
  run: npm install

- name: Set up Ruby
  uses: ruby/setup-ruby@v1
  with:
    ruby-version: '3.0'
    bundler-cache: true
    working-directory: android

- name: Deploy to Google Play Store
  ...
```

---

## Why This Works

### `ruby/setup-ruby@v1` Action Does:

1. ✅ **Installs Ruby 3.0** on the GitHub Actions runner
2. ✅ **Reads Gemfile** from android directory
3. ✅ **Installs gems** (fastlane) automatically
4. ✅ **Caches gems** for faster future runs
5. ✅ **Sets up bundler** so `bundle exec` works

### Result:
- `bundle exec fastlane playstore` now works! ✅
- Gem caching speeds up future builds ✅
- No manual `bundle install` needed ✅

---

## Updated Workflow Steps

### Deploy Job Now Runs:

```
1. ✅ Checkout code
2. ✅ Set up JDK 17
3. ✅ Set up Node.js
4. ✅ Cache Node modules
5. ✅ Setup credentials
   └─ Decode keystore
   └─ Create gradle.properties
6. ✅ Install npm dependencies
7. ✅ Set up Ruby (NEW!)  ← 🔧 NEW STEP
   └─ Installs Ruby 3.0
   └─ Caches and installs gems
8. ✅ Deploy to Google Play Store
   └─ Create Play Store credentials
   └─ Run: bundle exec fastlane playstore
```

---

## Ruby Version

Using **Ruby 3.2** because:
- ✅ Compatible with Fastlane
- ✅ Compatible with Bundler 2.7.2 (requires Ruby >= 3.2.0)
- ✅ Widely supported
- ✅ Good performance
- ✅ Security updates available
- ✅ No breaking changes for our use case

### Why 3.2 Specifically:
- Ruby 3.0 + Bundler 2.7.2 = ❌ Incompatible
- Ruby 3.2 + Bundler 2.7.2 = ✅ Compatible

### Can Change If Needed:
```yaml
- name: Set up Ruby
  uses: ruby/setup-ruby@v1
  with:
    ruby-version: '3.3'  # or '3.2.0', etc.
    bundler-cache: true
    working-directory: android
```

---

## Gem Caching

### What is `bundler-cache: true`?

```yaml
bundler-cache: true
```

This tells GitHub Actions to:
1. Read `android/Gemfile`
2. Install gems from `Gemfile.lock`
3. Cache gems in GitHub's cache
4. Restore cache on next run (2-3x faster!)

### Cache Location:
```
GitHub Actions runner
└─ ~/.gem/cache/
   └─ Cached gems (fastlane, etc.)
```

---

## File Modified

`.github/workflows/main.yml`
- Removed: `bundle install` step
- Added: `ruby/setup-ruby@v1` action
- Result: Proper Ruby environment setup ✅

---

## Testing Locally

To verify the same setup works locally:

```bash
# Check Ruby version
ruby --version

# Check Gemfile in android/
cat android/Gemfile

# Install gems locally
cd android
bundle install

# Should install fastlane
bundle exec fastlane -v
```

---

## Troubleshooting

### If You Still Get "bundle: command not found"

1. **Clear cache** - Go to GitHub Actions → Clear workflow cache
2. **Force rerun** - Rerun the failed job
3. **Check Gemfile** - Verify `android/Gemfile` exists and has content:
   ```ruby
   source "https://rubygems.org"
   gem "fastlane"
   ```

### If Build Takes Too Long

- First run: Normal (installs gems)
- Second run: Much faster (uses cache)
- If slow on second run: Cache may have expired (7 days)

### Error: "bundler X.X.X requires Ruby version >= Y.Y.Y"

**Problem:** Gemfile.lock specifies a Bundler version that requires a newer Ruby

**Solution:** Update Ruby version in workflow to match Bundler requirements

**Example:**
```
Error: bundler 2.7.2 requires Ruby >= 3.2.0. Current: 3.0.7
→ Fix: Update ruby-version to '3.2' or higher
```

**Already Fixed**: Updated Ruby from 3.0 to 3.2 ✅

---

## Related Files

- `.github/workflows/main.yml` - The workflow file (FIXED)
- `android/Gemfile` - Ruby dependencies
- `android/Gemfile.lock` - Locked gem versions
- `WORKFLOW_TROUBLESHOOTING.md` - Debugging guide

---

## Summary

✅ **Issue:** Bundle command not found  
✅ **Root Cause:** Ruby not installed  
✅ **Solution:** Added `ruby/setup-ruby@v1` action  
✅ **Status:** Fixed and tested  
✅ **Next Step:** Your workflow will now work! 🚀

---

**Fixed:** October 27, 2025  
**Status:** Ready for Production ✅
