# 🚨 URGENT: Add Environment Variables to Vercel NOW

## Your Error:
```
Environment variable not found: mb_POSTGRES_URL
```

This means Vercel **DOES NOT HAVE** your environment variables set!

---

## 📋 STEP-BY-STEP SOLUTION:

### ✅ Step 1: Open Vercel Dashboard
Click this link: https://vercel.com/dashboard

Or run this command to open it:
```bash
open https://vercel.com/dashboard
```

### ✅ Step 2: Navigate to Your Project
1. Find and click on **"MindBridge"** project
2. Click **"Settings"** tab (top menu)
3. Click **"Environment Variables"** (left sidebar)

### ✅ Step 3: Get Your Vercel Postgres URLs
1. Click **"Storage"** tab (top menu)
2. Click on your **Postgres** database
3. Click **".env.local"** tab
4. You'll see values like:
   ```
   POSTGRES_PRISMA_URL="prisma://accelerate..."
   POSTGRES_URL_NON_POOLING="postgres://default:..."
   ```

### ✅ Step 4: Add Environment Variables

Go back to **Settings** → **Environment Variables** and click **"Add New"** for each:

#### Variable 1: mb_PRISMA_DATABASE_URL
- **Key:** `mb_PRISMA_DATABASE_URL`
- **Value:** Paste your `POSTGRES_PRISMA_URL` value
- **Environments:** ✅ Production ✅ Preview ✅ Development
- Click **Save**

#### Variable 2: mb_POSTGRES_URL
- **Key:** `mb_POSTGRES_URL`
- **Value:** Paste your `POSTGRES_URL_NON_POOLING` value
- **Environments:** ✅ Production ✅ Preview ✅ Development
- Click **Save**

#### Variable 3: JWT_SECRET
- **Key:** `JWT_SECRET`
- **Value:** `enigmah` (or any random string)
- **Environments:** ✅ Production ✅ Preview ✅ Development
- Click **Save**

#### Variable 4: GEMINI_API_KEY
- **Key:** `GEMINI_API_KEY`
- **Value:** `AIzaSyAgoRnn8YZHSRv29fdtfegr7u9b1lWDg4g`
- **Environments:** ✅ Production ✅ Preview ✅ Development
- Click **Save**

### ✅ Step 5: Redeploy
1. Go to **"Deployments"** tab
2. Click the **⋯** (three dots) on the latest deployment
3. Click **"Redeploy"**
4. Wait 2-3 minutes for build to complete

---

## 🎯 IMPORTANT NOTES:

### ⚠️ Common Mistakes to Avoid:
1. **Don't include quotes** when pasting values in Vercel
   - ❌ Wrong: `"postgres://..."`
   - ✅ Right: `postgres://...`

2. **Make sure you're using VERCEL Postgres URLs**, not localhost
   - ❌ Wrong: `postgresql://mindbridge@localhost:5432/...`
   - ✅ Right: `postgres://default:xxx@ep-xxx.postgres.vercel-storage.com:5432/...`

3. **Check all 3 environments** are selected for each variable

### 📍 Where to Find Things:
- **Vercel Dashboard:** https://vercel.com/dashboard
- **Your Project Settings:** https://vercel.com/[your-username]/mind-bridge/settings
- **Environment Variables:** Settings → Environment Variables (left sidebar)
- **Database URLs:** Storage → [Your Postgres DB] → .env.local tab

---

## ✅ After Adding Variables:

Once redeployment succeeds, seed your database:
```bash
curl -X POST https://your-app.vercel.app/api/seed
```

This will add:
- ✅ 5 doctors
- ✅ 8 quizzes with 94 questions total
- ✅ 3 specialties

---

## 🆘 Still Having Issues?

Run this command to verify your variables are set:
```bash
vercel env ls
```

Or check the build logs:
```bash
vercel logs --follow
```
