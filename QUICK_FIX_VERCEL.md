# 🚀 Quick Fix: Vercel Deployment Error

## Problem
Your Vercel build is failing with: `Environment variable not found: mb_POSTGRES_URL`

## Solution (5 minutes)

### Step 1: Get Your Local Environment Variables
```bash
cat .env
```

Copy these values (you'll need them):
- `mb_PRISMA_DATABASE_URL`
- `mb_POSTGRES_URL`
- `JWT_SECRET`
- `GEMINI_API_KEY`

### Step 2: Add to Vercel
1. Go to: https://vercel.com/dashboard
2. Click your **MindBridge** project
3. Click **Settings** → **Environment Variables**
4. Click **Add New** for each variable:

| Variable Name | Where to Get Value |
|--------------|-------------------|
| `mb_PRISMA_DATABASE_URL` | From your `.env` file |
| `mb_POSTGRES_URL` | From your `.env` file |
| `JWT_SECRET` | From your `.env` file |
| `GEMINI_API_KEY` | From your `.env` file |

5. For each variable:
   - Paste the name in "Key"
   - Paste the value (without quotes!)
   - Check: Production, Preview, Development
   - Click Save

### Step 3: Redeploy
Go to **Deployments** → Click ⋯ on latest → Click **Redeploy**

### Step 4: Seed Database
Once deployed successfully, run:
```bash
curl -X POST https://your-app-name.vercel.app/api/seed
```

Replace `your-app-name.vercel.app` with your actual Vercel URL.

## ✅ Done!
Your app should now be fully working on Vercel with:
- Database connected
- Migrations applied
- Doctors and quizzes seeded
- All features working

---

**Important**: Don't paste the quotes around values in Vercel! 
❌ Wrong: `"postgres://..."`
✅ Right: `postgres://...`
