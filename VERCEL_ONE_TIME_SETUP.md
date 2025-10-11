# 🚀 ONE-TIME VERCEL SETUP (Do This Once!)

## ✅ What I Just Fixed
Your seed.ts now has **ALL 8 quizzes** with **94 questions**:
1. PHQ-9 (Depression) - 9 questions
2. GAD-7 (Anxiety) - 7 questions  
3. PSS-10 (Stress) - 10 questions
4. SPIN (Social Phobia) - 17 questions
5. PDSS (Panic Disorder) - 7 questions
6. ASRS (ADHD) - 6 questions
7. OCI-R (OCD) - 18 questions
8. PCL-5 (PTSD) - 20 questions

The build script will now automatically seed everything!

---

## ⚠️ CRITICAL: You MUST Add Environment Variables

Your Vercel app **CANNOT WORK** without these 4 environment variables.

### Step 1️⃣: Go to Your Vercel Dashboard
1. Open https://vercel.com/dashboard
2. Click on your `MindBridge` project
3. Click **Settings** tab
4. Click **Environment Variables** on the left

### Step 2️⃣: Get Your Vercel Postgres Connection Strings

#### Option A: If You Already Have Vercel Postgres
1. Go to **Storage** tab in your Vercel project
2. Click on your Postgres database
3. Click **`.env.local`** tab
4. Copy the values for:
   - `POSTGRES_PRISMA_URL`
   - `POSTGRES_URL`

#### Option B: If You DON'T Have Vercel Postgres Yet
1. Go to **Storage** tab in your Vercel project
2. Click **Create Database**
3. Select **Postgres**
4. Choose a region close to Bangladesh (Singapore is best)
5. Click Create
6. Now follow Option A to get the connection strings

### Step 3️⃣: Add These 4 Environment Variables

| Key | Value | Where to Get It |
|-----|-------|----------------|
| `mb_PRISMA_DATABASE_URL` | `postgres://...?pgbouncer=true&connect_timeout=15` | Copy from Vercel Postgres `.env.local` tab (POSTGRES_PRISMA_URL) |
| `mb_POSTGRES_URL` | `postgres://...?sslmode=require` | Copy from Vercel Postgres `.env.local` tab (POSTGRES_URL) |
| `JWT_SECRET` | `enigmah` | Just type: `enigmah` (or any strong password) |
| `GEMINI_API_KEY` | `AIzaSyAgoRnn8YZHSRv29fdtfegr7u9b1lWDg4g` | Just type this exact value |

**Important:** 
- For `mb_PRISMA_DATABASE_URL`: Use the one ending with `?pgbouncer=true&connect_timeout=15`
- For `mb_POSTGRES_URL`: Use the one ending with `?sslmode=require`

### Step 4️⃣: Apply to All Environments
For each variable, select: **Production, Preview, and Development**

### Step 5️⃣: Trigger Redeploy
After adding all 4 variables:
1. Go to **Deployments** tab
2. Click the **⋯** menu on the latest deployment
3. Click **Redeploy**
4. Check "Use existing Build Cache" is OFF
5. Click **Redeploy**

---

## ✅ What Happens Next

When Vercel rebuilds:
1. **Migrations run** → Database schema created
2. **Seed runs** → ALL 8 quizzes + 5 doctors added automatically
3. **App builds** → Everything works!

You should see in the build logs:
```
✅ Seed complete!
   Doctors: 8
   Quizzes: 8
   Questions: 94
```

---

## 🎉 After Setup Complete

From now on, you just need to:
```bash
git add .
git commit -m "your changes"
git push
```

And everything updates automatically in Vercel! 🚀

---

## 🆘 If Something Goes Wrong

1. **Check build logs** in Vercel Deployments tab
2. **Verify all 4 environment variables** are set correctly
3. **Make sure** you used the Vercel Postgres URLs (not localhost!)
4. **Redeploy** with cache disabled

---

## 📝 Quick Checklist

- [ ] Created Vercel Postgres database (if not already done)
- [ ] Added `mb_PRISMA_DATABASE_URL` 
- [ ] Added `mb_POSTGRES_URL`
- [ ] Added `JWT_SECRET`
- [ ] Added `GEMINI_API_KEY`
- [ ] Applied to all environments (Production, Preview, Development)
- [ ] Redeployed with cache disabled
- [ ] Checked build logs for "Seed complete"
- [ ] Verified /quizzes page shows all 8 assessments

---

**You only need to do this ONCE!** After that, just `git push` and everything works! 🎊
