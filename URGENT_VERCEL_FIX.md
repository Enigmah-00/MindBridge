# ⚠️ URGENT: Fix Vercel Deployment Error

## 🔴 Current Error:
```
Error: Environment variable not found: mb_POSTGRES_URL
```

## ✅ Quick Fix (5 Minutes):

### Step 1: Go to Vercel Dashboard
1. Open: https://vercel.com/dashboard
2. Click your **MindBridge** project

### Step 2: Add Environment Variables
1. Click **Settings** tab (top menu)
2. Click **Environment Variables** (left sidebar)
3. Add these **4 variables**:

---

### 📝 Variable 1: `mb_PRISMA_DATABASE_URL`
- **Key**: `mb_PRISMA_DATABASE_URL`
- **Value**: You need to get this from your Vercel Postgres database
- **How to get it**:
  1. Go to **Storage** tab in your project
  2. If you don't have a Postgres database:
     - Click **Create Database** → Select **Postgres** → Create
  3. Click on your Postgres database
  4. Click **`.env.local`** tab
  5. Copy the value of `POSTGRES_PRISMA_URL` (the one with `?pgbouncer=true`)
- **Environments**: Check all 3 boxes (Production, Preview, Development)

---

### 📝 Variable 2: `mb_POSTGRES_URL`
- **Key**: `mb_POSTGRES_URL`
- **Value**: From the same place as above
- **How to get it**:
  1. Same database → **`.env.local`** tab
  2. Copy the value of `POSTGRES_URL` (the one with `?sslmode=require`)
- **Environments**: Check all 3 boxes (Production, Preview, Development)

---

### 📝 Variable 3: `JWT_SECRET`
- **Key**: `JWT_SECRET`
- **Value**: `enigmah` (or any strong password you prefer)
- **Environments**: Check all 3 boxes (Production, Preview, Development)

---

### 📝 Variable 4: `GEMINI_API_KEY`
- **Key**: `GEMINI_API_KEY`
- **Value**: `AIzaSyAgoRnn8YZHSRv29fdtfegr7u9b1lWDg4g`
- **Environments**: Check all 3 boxes (Production, Preview, Development)

---

### Step 3: Redeploy
1. Go to **Deployments** tab
2. Click **⋯** (three dots) on the latest deployment
3. Click **Redeploy**
4. **IMPORTANT**: Uncheck "Use existing Build Cache"
5. Click **Redeploy** button

---

## 🎯 What Each Variable Does:

| Variable | Purpose |
|----------|---------|
| `mb_PRISMA_DATABASE_URL` | Database connection with connection pooling (for queries) |
| `mb_POSTGRES_URL` | Direct database connection (for migrations) |
| `JWT_SECRET` | Encrypts authentication tokens |
| `GEMINI_API_KEY` | Powers the AI chatbot |

---

## ❓ Don't Have Vercel Postgres Yet?

### Create Vercel Postgres Database:
1. Go to your project in Vercel
2. Click **Storage** tab
3. Click **Create Database**
4. Select **Postgres**
5. Choose **Region**: Singapore (closest to Bangladesh)
6. Click **Create**
7. Wait 1-2 minutes for creation
8. Now follow Step 2 above to get the URLs

---

## 🔍 How to Find Your Connection Strings:

```
Vercel Dashboard
  └─ Your Project (MindBridge)
      └─ Storage Tab
          └─ Click Your Postgres Database
              └─ .env.local Tab
                  └─ Copy POSTGRES_PRISMA_URL → Use for mb_PRISMA_DATABASE_URL
                  └─ Copy POSTGRES_URL → Use for mb_POSTGRES_URL
```

---

## ✅ After Adding Variables:

Your build will:
1. ✅ Run migrations → Create database tables
2. ✅ Run seed script → Add 8 doctors + 8 quizzes with 110 questions
3. ✅ Build app → Deploy all pages and games
4. ✅ Everything works! 🎉

---

## 🆘 Still Getting Errors?

Check these:
- [ ] All 4 variables are added
- [ ] All 3 environments are checked (Production, Preview, Development)
- [ ] URLs are copied exactly (no extra spaces)
- [ ] You used the Vercel Postgres URLs (NOT localhost URLs)
- [ ] You redeployed with "Use existing Build Cache" **UNCHECKED**

---

## 📸 Visual Guide:

```
Step 1: Settings → Environment Variables
Step 2: Add each variable with all 3 environments checked
Step 3: Deployments → Redeploy (cache OFF)
Step 4: Wait 2-3 minutes → SUCCESS! ✅
```

---

**This is a ONE-TIME setup. After this, just `git push` and everything deploys automatically!** 🚀
