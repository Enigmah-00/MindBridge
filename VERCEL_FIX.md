# 🚨 VERCEL DEPLOYMENT FIX

## Problem
Your Vercel deployment failed because of missing environment variables:
```
Error: Environment variable not found: mb_POSTGRES_URL
```

## ✅ Solution Applied

### 1. Fixed Prisma Schema
Changed from:
```prisma
datasource db {
  provider  = "postgresql"
  url       = env("mb_PRISMA_DATABASE_URL")  ❌
  directUrl = env("mb_POSTGRES_URL")         ❌
}
```

To:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")  ✅
}
```

---

## 🚀 Deploy to Vercel - Step by Step

### Step 1: Commit the Fix
```bash
git add prisma/schema.prisma
git commit -m "fix: Update Prisma schema to use standard DATABASE_URL"
git push origin main
```

### Step 2: Set Up Vercel Database

#### Option A: Vercel Postgres (Easiest)
1. Go to your Vercel project dashboard
2. Click **"Storage"** tab
3. Click **"Create Database"**
4. Select **"Postgres"**
5. Name it: `mindbridge-db`
6. Click **"Create"**
7. **Automatic!** Vercel sets `DATABASE_URL` for you ✅

#### Option B: External Database (Neon - Recommended for Free Tier)
1. Go to https://neon.tech
2. Sign up with GitHub
3. Create new project: `MindBridge`
4. Copy the **Connection String**
5. Go to Vercel project → **Settings** → **Environment Variables**
6. Add:
   - Name: `DATABASE_URL`
   - Value: `postgresql://user:pass@host/db?sslmode=require`
   - Environment: **Production, Preview, Development**

### Step 3: Set Other Environment Variables

Go to Vercel → **Settings** → **Environment Variables**

Add these:

```env
# Required
DATABASE_URL=postgresql://...  (from Step 2)
JWT_SECRET=your-strong-random-secret-here
NEXTAUTH_URL=https://your-app.vercel.app

# Optional (for features)
OPENAI_API_KEY=sk-...  (for AI chatbot)
SMTP_HOST=smtp.gmail.com  (for password reset emails)
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=MindBridge <noreply@mindbridge.com>
```

### Step 4: Redeploy
```bash
# In Vercel dashboard
Click "Deployments" → "Redeploy"

# Or push a new commit
git commit --allow-empty -m "trigger redeploy"
git push origin main
```

### Step 5: Run Database Migrations

After successful deployment:

```bash
# Install Vercel CLI
npm install -g vercel

# Link to your project
vercel link

# Pull environment variables
vercel env pull .env.production

# Run migrations
DATABASE_URL="$(grep DATABASE_URL .env.production | cut -d '=' -f2-)" npx prisma migrate deploy

# OR use Vercel's production environment
vercel env ls
# Copy the DATABASE_URL value, then:
DATABASE_URL="your-production-db-url" npx prisma migrate deploy
```

---

## 🔧 Quick Fix Commands

Run these in your terminal:

```bash
# 1. Commit the schema fix
cd /Users/mahadi/Desktop/MindBridge
git add prisma/schema.prisma
git commit -m "fix: Use standard DATABASE_URL for Vercel compatibility"
git push origin main

# 2. Generate Prisma client locally (test)
npx prisma generate

# 3. Test build locally
npm run build
```

---

## 📋 Vercel Environment Variables Checklist

Required for deployment:
- [x] `DATABASE_URL` - PostgreSQL connection string
- [x] `JWT_SECRET` - Random secret for auth (generate: `openssl rand -base64 32`)
- [x] `NEXTAUTH_URL` - Your Vercel app URL

Optional but recommended:
- [ ] `OPENAI_API_KEY` - For AI chatbot
- [ ] `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` - For emails
- [ ] `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` - For location features

---

## 🎯 Expected Result

After these steps, your deployment should succeed:

```
✓ Prisma schema valid
✓ Database connected
✓ Migrations applied
✓ Build successful
✓ Deployed to: https://mindbridge-xxx.vercel.app
```

---

## 🆘 Still Getting Errors?

### Error: "Prisma Client not found"
```bash
# Add to package.json scripts:
"postinstall": "prisma generate"
```

Then commit and push.

### Error: "Database connection failed"
Check your `DATABASE_URL`:
- Must start with `postgresql://`
- Must include `?sslmode=require` at the end
- Test it locally first: `npx prisma db pull`

### Error: "Build timeout"
Your build is taking too long. Vercel free tier has 6000 min/month.
- Check build logs for what's slow
- Consider upgrading to Pro if needed

---

## 💡 Pro Tips

### 1. Use Vercel Postgres for Simplicity
- Free 256MB
- Zero config (DATABASE_URL auto-set)
- Perfect for getting started

### 2. Use Neon for More Storage
- Free 3GB (12x more than Vercel)
- Still serverless
- Easy to set up

### 3. Environment Variables Best Practices
```bash
# Development (.env.local)
DATABASE_URL="postgresql://localhost:5432/mindbridge"
NEXTAUTH_URL="http://localhost:3000"

# Production (Vercel dashboard)
DATABASE_URL="postgresql://neon-or-vercel-url"
NEXTAUTH_URL="https://your-app.vercel.app"
```

### 4. Test Before Deploy
```bash
# Local build test
npm run build

# If successful, deploy
git push origin main
```

---

## 🎉 Summary

**What was wrong:**
- Schema used non-standard env vars: `mb_POSTGRES_URL` and `mb_PRISMA_DATABASE_URL`
- Vercel doesn't auto-create these

**What we fixed:**
- Changed to standard `DATABASE_URL`
- Removed `directUrl` (not needed for most cases)

**What you need to do:**
1. Commit and push the fix ✅
2. Set `DATABASE_URL` in Vercel
3. Set `JWT_SECRET` in Vercel
4. Set `NEXTAUTH_URL` in Vercel
5. Redeploy
6. Run migrations

**Estimated time:** 5-10 minutes

---

**Your app will be live! 🚀**

Need help? Check the full guide: `DEPLOYMENT_GUIDE.md`
