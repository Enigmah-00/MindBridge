# 🔐 Vercel Login Issue - Complete Fix Guide

## 🎯 Problem: Login Failing on Vercel

Users can't log in on the deployed Vercel app even though it works locally.

---

## ✅ Root Causes & Solutions

### Issue 1: Missing JWT_SECRET Environment Variable

**Symptom:** Login returns 500 error or "Invalid credentials" even with correct username/password

**Root Cause:** The app uses `JWT_SECRET` (or `NEXTAUTH_SECRET`) to sign authentication tokens. If this variable is missing or misconfigured in Vercel, login will fail.

**Fix Applied:**
- Updated code to accept BOTH `JWT_SECRET` and `NEXTAUTH_SECRET`
- Now checks for either variable as fallback
- Files updated:
  - `src/lib/auth.ts`
  - `src/middleware.ts`
  - `src/app/api/migrate/route.ts`

**Action Required in Vercel:**

1. Go to: https://vercel.com/enigmah-00/mindbridge/settings/environment-variables

2. Add this environment variable:

```
Name:  JWT_SECRET
Value: (generate with command below)
Environments: ✓ Production ✓ Preview ✓ Development
```

**Generate Secret:**
```bash
openssl rand -base64 32
```

Copy the output and paste as the value.

**Alternative:** You can also use `NEXTAUTH_SECRET` instead of `JWT_SECRET` (the code now supports both).

---

### Issue 2: Cookie Settings in Production

**Symptom:** Login seems successful but user is immediately logged out or redirected back to login

**Root Cause:** Cookie security settings or domain mismatch

**Fix Applied:**
- Cleaned up cookie configuration
- Set `secure: true` only in production (HTTPS required)
- `sameSite: 'lax'` allows cookies across same-site navigations
- `httpOnly: true` prevents JavaScript access (security)

**Cookie Configuration:**
```typescript
{
  httpOnly: true,
  sameSite: "lax",
  secure: isProd,      // HTTPS in production
  path: "/",
  maxAge: 604800,      // 7 days in seconds
}
```

No action required - this is already fixed in the code.

---

### Issue 3: Database Connection

**Symptom:** Login fails with database errors

**Root Cause:** `DATABASE_URL` not set or incorrect in Vercel

**Check:**
```
Vercel Dashboard → Settings → Environment Variables → DATABASE_URL
```

Should look like:
```
postgresql://user:password@host:5432/database?sslmode=require
```

If missing, see `VERCEL_FIX_NOW.md` for database setup.

---

## 🧪 Test Your Fix

### 1. Check Environment Variables

In Vercel Dashboard, ensure you have:

```
✓ DATABASE_URL          (from Vercel Postgres or Neon)
✓ JWT_SECRET            (generated with openssl)
✓ NEXTAUTH_URL          (https://your-app.vercel.app)
✓ OPENAI_API_KEY        (optional, for chatbot)
```

### 2. Trigger Redeploy

After adding `JWT_SECRET`:

**Option A: Automatic**
```bash
git commit --allow-empty -m "trigger redeploy"
git push origin main
```

**Option B: Manual**
1. Go to Vercel → Deployments
2. Click "..." on latest deployment
3. Click "Redeploy"

### 3. Test Login

1. Visit: `https://your-app.vercel.app/auth/login`
2. Try logging in with existing credentials
3. Check browser console for errors (F12 → Console)
4. Check Vercel logs for server errors

---

## 🐛 Debugging Steps

### Check Vercel Logs

1. Go to: https://vercel.com/enigmah-00/mindbridge/deployments
2. Click on latest deployment
3. Click "View Function Logs"
4. Look for errors related to:
   - `JWT_SECRET not found`
   - `Invalid token`
   - `Database connection`

### Test Locally

```bash
# Set the same environment variables locally
export JWT_SECRET="your-vercel-secret"
export DATABASE_URL="your-vercel-database-url"

# Run the app
npm run dev

# Try logging in at http://localhost:3000/auth/login
```

### Check Cookie in Browser

After attempting login:

1. Open DevTools (F12)
2. Go to Application → Cookies
3. Look for cookie named: `mb_token`
4. Check:
   - ✓ Domain matches your site
   - ✓ Secure flag (should be checked in production)
   - ✓ HttpOnly flag (should be checked)
   - ✓ SameSite = Lax

---

## 📋 Quick Checklist

Before declaring victory:

- [ ] `JWT_SECRET` (or `NEXTAUTH_SECRET`) added to Vercel
- [ ] `DATABASE_URL` set in Vercel
- [ ] Latest code deployed (commit `bd16b43` or later)
- [ ] Database migrations applied
- [ ] Can visit login page without errors
- [ ] Can submit login form
- [ ] Cookie `mb_token` is set after login
- [ ] Redirected to dashboard after login
- [ ] Can access protected routes

---

## 🔧 Environment Variable Summary

All required environment variables for Vercel:

### Required (Authentication won't work without these):

```bash
DATABASE_URL=postgresql://user:pass@host:5432/db?sslmode=require
JWT_SECRET=your-generated-secret-here
NEXTAUTH_URL=https://your-app.vercel.app
```

### Optional (Enhanced features):

```bash
OPENAI_API_KEY=sk-proj-your-key
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-maps-key
```

---

## 🚨 Common Errors & Solutions

### Error: "JWT_SECRET not found in environment"

**Solution:**
```bash
# In Vercel Dashboard, add:
JWT_SECRET = (output of: openssl rand -base64 32)
```

### Error: "Invalid credentials" (but password is correct)

**Possible causes:**
1. Database not seeded with users
2. Password hash mismatch
3. Database connection issue

**Solution:**
```bash
# Check if database has users
# In Vercel Dashboard → Storage → Browse Data
# Look for "User" table
# Should have at least one user

# If no users, you need to seed:
# See VERCEL_SEEDING_GUIDE.md
```

### Error: Cookie not being set

**Check:**
1. Browser blocks third-party cookies? (Should work with sameSite: lax)
2. HTTPS working? (Required in production)
3. Domain correct? (Should be your-app.vercel.app)

**Debug:**
```javascript
// Check in browser console after login attempt:
document.cookie
// Should show: mb_token=...
```

---

## 📖 Related Guides

- `VERCEL_FIX_NOW.md` - Complete Vercel setup
- `VERCEL_VISUAL_GUIDE.md` - Visual deployment guide
- `VERCEL_SEEDING_GUIDE.md` - Database seeding
- `DEPLOYMENT_GUIDE.md` - Full deployment documentation

---

## ✅ Success Indicators

Your login is working when:

1. ✅ Login form submits without errors
2. ✅ Browser DevTools shows 200 response from `/api/auth/login`
3. ✅ Cookie `mb_token` appears in Application → Cookies
4. ✅ Redirected to `/dashboard` after login
5. ✅ Dashboard loads with user data
6. ✅ Can navigate to protected routes
7. ✅ Logout works and clears cookie

---

## 🎉 After Fix

Once login works:

1. **Test all auth flows:**
   - Login
   - Logout
   - Signup
   - Password reset (if implemented)

2. **Test protected routes:**
   - Dashboard
   - Profile
   - Appointments
   - Messages

3. **Monitor logs:**
   - Check for any authentication errors
   - Verify no token expiration issues

4. **Security check:**
   - Cookie is HttpOnly ✓
   - Cookie is Secure (HTTPS) ✓
   - JWT secret is strong ✓

---

**Your MindBridge app should now have working authentication on Vercel! 🚀**

If login still fails after following this guide, check Vercel logs and browser console for specific error messages.
