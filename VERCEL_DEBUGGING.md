# Vercel Deployment Debugging Guide

## 🔍 Step-by-Step Debugging for "Signup Failed" Error

Since you've already set up Vercel Postgres and environment variables, let's debug why it's still failing.

### Step 1: Check Vercel Function Logs (MOST IMPORTANT)

1. **Go to your Vercel Dashboard**
   - https://vercel.com/dashboard
   - Click on your **MindBridge** project

2. **Go to Recent Deployment**
   - Click on **"Deployments"** tab
   - Click on the most recent deployment (top one)

3. **View Function Logs**
   - Scroll down to the **"Functions"** section
   - Click on **"View Function Logs"**
   - OR click on **"Runtime Logs"** tab

4. **Look for Error Messages**
   - Filter by the `/api/auth/signup` route
   - Look for red error messages
   - Common errors you might see:
     - "JWT_SECRET environment variable is not set"
     - "Prisma Client not generated"
     - "Database connection error"
     - "Module not found"

5. **Take a Screenshot or Copy the Error**
   - This will tell us exactly what's wrong

---

### Step 2: Verify Environment Variables Are Actually Set

1. **In Vercel Dashboard → Settings → Environment Variables**
   - Make sure you see:
     - ✅ `JWT_SECRET` = `enigmah`
     - ✅ `DATABASE_URL` = (your Vercel Postgres URL)
     - ✅ `POSTGRES_PRISMA_URL` = (auto-added by Vercel)

2. **Check which environments they're set for**
   - They should show: **Production**, **Preview**, **Development**
   - If they only show "Production", that's the problem!

3. **If missing or incomplete:**
   - Delete the variable
   - Add it again, checking ALL THREE environments

---

### Step 3: Check Database Connection

Vercel Postgres should have automatically added these variables:
- `POSTGRES_URL`
- `POSTGRES_PRISMA_URL`
- `POSTGRES_URL_NON_POOLING`

**Important:** For Prisma, you should use `POSTGRES_PRISMA_URL`, not `DATABASE_URL`!

#### Fix: Update Your Environment Variables

If you manually added `DATABASE_URL`, you need to either:

**Option A: Use the Vercel-provided URL**
1. Go to **Storage** tab in Vercel
2. Click on your database
3. Go to **".env.local"** tab
4. Copy the value for `POSTGRES_PRISMA_URL`
5. Go back to **Settings → Environment Variables**
6. Update `DATABASE_URL` to use the same value as `POSTGRES_PRISMA_URL`

**Option B: Use POSTGRES_PRISMA_URL directly**
1. Update your code to use `POSTGRES_PRISMA_URL` instead of `DATABASE_URL`
2. OR add this to Vercel env vars:
   - Key: `DATABASE_URL`
   - Value: Same as `POSTGRES_PRISMA_URL`

---

### Step 4: Verify Database Schema Is Deployed

Your Vercel Postgres database might be empty (no tables)!

#### Check if migrations ran:

1. **In Vercel Dashboard → Storage**
   - Click on your Postgres database
   - Click on **"Query"** or **"Data"** tab
   - Look for tables like: `User`, `Doctor`, `Appointment`, etc.

2. **If tables are missing, run migrations:**

```bash
# First, get your database URL from Vercel
# Go to Storage → Your Database → .env.local tab
# Copy the POSTGRES_PRISMA_URL value

# Then run migrations locally pointing to that database:
DATABASE_URL="your-vercel-postgres-url" npx prisma migrate deploy

# Generate Prisma Client
npx prisma generate

# (Optional) Seed the database
DATABASE_URL="your-vercel-postgres-url" npx prisma db seed
```

---

### Step 5: Force Redeploy with Cache Clear

Sometimes Vercel caches old builds:

1. **Go to Deployments tab**
2. **Click on latest deployment**
3. **Click the three dots (⋯) menu**
4. **Select "Redeploy"**
5. **IMPORTANT: Check "Use existing Build Cache" = OFF**
6. **Click "Redeploy"**

This forces a fresh build with your new environment variables.

---

### Step 6: Check Build Logs

1. **In the redeploying screen**
2. **Click "Building"** to see live logs
3. **Look for these lines:**
   ```
   ✓ Prisma Client generated
   ✓ Environment variables loaded
   ✓ Build completed
   ```

4. **Common build errors:**
   - `Prisma Client not generated` → Add postinstall script (see below)
   - `Module not found: argon2` → Check package.json
   - `JWT_SECRET is not defined` → Env var not set correctly

---

### Step 7: Test the Deployment

After successful deployment, test with curl:

```bash
# Replace YOUR-VERCEL-URL with your actual URL
curl -v -X POST https://YOUR-VERCEL-URL.vercel.app/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser123","password":"testpass123"}'
```

Look for:
- **200 or 201** = Success! ✅
- **400** = Bad request (missing fields)
- **500** = Server error (check logs)

---

## 🔧 Common Fixes

### Fix 1: Add Postinstall Script

Edit `package.json` and make sure you have:

```json
{
  "scripts": {
    "postinstall": "prisma generate",
    "build": "prisma generate && next build"
  }
}
```

### Fix 2: Add Vercel Build Configuration

Create `vercel.json` in your root directory:

```json
{
  "buildCommand": "prisma generate && npm run build",
  "env": {
    "SKIP_ENV_VALIDATION": "1"
  }
}
```

### Fix 3: Check Prisma Binary Target

In `schema.prisma`, add this if missing:

```prisma
generator client {
  provider = "prisma-client-js"
  binaryTargets = ["native", "rhel-openssl-1.0.x"]
}
```

---

## 🚨 Most Common Issues & Solutions

### Issue: "Signup Failed" with no details
**Solution:** The error is being caught but not logged properly. Check Vercel Function Logs.

### Issue: "Prisma Client not initialized"
**Solution:** Run `DATABASE_URL="vercel-url" npx prisma migrate deploy`

### Issue: "Database connection error"
**Solution:** Use `POSTGRES_PRISMA_URL` instead of `POSTGRES_URL`

### Issue: "Module not found: argon2"
**Solution:** Check `package.json` has `argon2` in dependencies, redeploy with no cache

### Issue: "JWT_SECRET is not set"
**Solution:** Double-check env vars are set for ALL environments (Prod, Preview, Dev)

---

## 📊 What to Send Me for Further Help

If still not working, please provide:

1. **Function Logs from Vercel** (the actual error message)
2. **Build Logs** (any warnings or errors during build)
3. **Environment Variables Screenshot** (hide sensitive values)
4. **Your Vercel URL** so I can test it

---

## ✅ Success Checklist

- [ ] Environment variables set for ALL environments
- [ ] Database tables created (check in Vercel Storage → Data)
- [ ] Redeployed with cache cleared
- [ ] Build logs show "Prisma Client generated"
- [ ] Function logs show no errors
- [ ] Test curl command returns success

If you've done all this and it still fails, **the Vercel Function Logs will tell us exactly why!**
