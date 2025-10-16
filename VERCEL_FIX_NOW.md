# 🚨 URGENT: Fix Vercel Deployment Error

## Error: `DATABASE_URL` not found

Your deployment is failing because environment variables aren't set in Vercel yet.

---

## ✅ Quick Fix (5 minutes)

### Step 1: Set Up Database on Vercel

#### Option A: Vercel Postgres (Easiest - 2 minutes)

1. Go to your Vercel project: https://vercel.com/enigmah-00/mindbridge
2. Click **"Storage"** tab
3. Click **"Create Database"**
4. Select **"Postgres"**
5. Click **"Continue"**
6. Database name: `mindbridge-db`
7. Click **"Create"**

✅ **DATABASE_URL will be automatically added to your environment variables!**

#### Option B: Neon Database (More Storage - 3 minutes)

1. Go to https://neon.tech
2. Sign up with GitHub
3. Click **"Create Project"**
4. Project name: `mindbridge`
5. Region: Choose closest to you
6. Click **"Create Project"**
7. Copy the **Connection String** (looks like: `postgresql://user:pass@host/db?sslmode=require`)

---

### Step 2: Add Environment Variables to Vercel

1. Go to your Vercel project
2. Click **"Settings"** → **"Environment Variables"**
3. Add these variables:

```env
# Database (Required)
DATABASE_URL=postgresql://... (from Vercel Postgres or Neon)

# Auth (Required)
NEXTAUTH_SECRET=your-secret-here (generate below)
NEXTAUTH_URL=https://your-project.vercel.app

# OpenAI (Required for chatbot)
OPENAI_API_KEY=sk-proj-... (your OpenAI key)

# Optional
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-google-maps-key
```

#### Generate NEXTAUTH_SECRET:
Run this in your terminal:
```bash
openssl rand -base64 32
```

---

### Step 3: Redeploy

After adding environment variables:

1. Go to **"Deployments"** tab
2. Find the latest deployment
3. Click **"..."** menu
4. Click **"Redeploy"**

OR just push a new commit:
```bash
git commit --allow-empty -m "trigger deploy"
git push origin main
```

---

## 🎯 Complete Environment Variables Needed

### Minimum (Required):
```env
DATABASE_URL=postgresql://...
NEXTAUTH_SECRET=generated-secret
NEXTAUTH_URL=https://your-app.vercel.app
OPENAI_API_KEY=sk-proj-...
```

### Full (Recommended):
```env
# Database
DATABASE_URL=postgresql://username:password@host:5432/database?sslmode=require

# Auth
NEXTAUTH_SECRET=your-long-random-secret-here
NEXTAUTH_URL=https://mindbridge.vercel.app

# OpenAI (for AI chatbot)
OPENAI_API_KEY=sk-proj-your-openai-api-key-here

# Google Maps (optional, for location features)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSy...

# Email (optional, for password reset)
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=your-email@gmail.com
EMAIL_SERVER_PASSWORD=your-app-password
EMAIL_FROM=noreply@mindbridge.com
```

---

## 🔧 After Setting Environment Variables

### Run Database Migrations:

You need to apply migrations to your production database. Here's how:

#### Option 1: Using Vercel CLI (Recommended)
```bash
# Install Vercel CLI
npm install -g vercel

# Link to your project
vercel link

# Pull environment variables
vercel env pull .env.production

# Run migrations
DATABASE_URL=$(grep DATABASE_URL .env.production | cut -d '=' -f2-) npx prisma migrate deploy

# Seed database (optional)
DATABASE_URL=$(grep DATABASE_URL .env.production | cut -d '=' -f2-) npx prisma db seed
```

#### Option 2: Using Vercel Dashboard
1. Go to your project settings
2. Go to **Functions** tab
3. Add a new function endpoint: `/api/migrate`
4. Create file: `src/app/api/migrate/route.ts`

```typescript
import { exec } from 'child_process';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  // Only allow in development or with secret key
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');
  
  if (secret !== process.env.MIGRATION_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return new Promise((resolve) => {
    exec('npx prisma migrate deploy', (error, stdout, stderr) => {
      if (error) {
        resolve(NextResponse.json({ error: stderr }, { status: 500 }));
        return;
      }
      resolve(NextResponse.json({ success: true, output: stdout }));
    });
  });
}
```

Then visit: `https://your-app.vercel.app/api/migrate?secret=your-secret`

---

## 📋 Deployment Checklist

Before deploying, ensure:

- [ ] Database created (Vercel Postgres or Neon)
- [ ] `DATABASE_URL` added to Vercel env vars
- [ ] `NEXTAUTH_SECRET` generated and added
- [ ] `NEXTAUTH_URL` set to your Vercel URL
- [ ] `OPENAI_API_KEY` added (if using chatbot)
- [ ] Pushed latest code to GitHub
- [ ] Migrations applied to production database
- [ ] Test deployment successful

---

## 🚀 Quick Commands

### Generate NEXTAUTH_SECRET:
```bash
openssl rand -base64 32
```

### Test build locally:
```bash
npm run build
```

### Check environment variables:
```bash
vercel env ls
```

### Pull production env vars:
```bash
vercel env pull .env.production
```

### Deploy manually:
```bash
vercel --prod
```

---

## 🐛 Common Issues

### Issue 1: "DATABASE_URL not found"
**Fix:** Add DATABASE_URL to Vercel environment variables

### Issue 2: "Prisma Client not generated"
**Fix:** Add this to `package.json`:
```json
{
  "scripts": {
    "postinstall": "prisma generate"
  }
}
```

### Issue 3: "Migration failed"
**Fix:** Apply migrations manually using Vercel CLI (see above)

### Issue 4: "NEXTAUTH_SECRET missing"
**Fix:** Generate secret with `openssl rand -base64 32` and add to env vars

---

## 🎯 Recommended: Use Neon for Free Database

Why Neon over Vercel Postgres:
- ✅ **3GB storage** (vs Vercel's 256MB)
- ✅ **Unlimited databases**
- ✅ **Branching** for dev/staging
- ✅ **Better free tier**

Setup Neon:
1. https://neon.tech
2. Sign up → Create project
3. Copy connection string
4. Add to Vercel env vars
5. Deploy!

---

## 📞 Need Help?

If deployment still fails:
1. Check Vercel deployment logs
2. Verify all env vars are set
3. Test build locally: `npm run build`
4. Check Prisma schema is valid: `npx prisma validate`

---

## ✅ After Successful Deployment

Your app will be live at: `https://mindbridge.vercel.app`

Test these features:
1. Sign up / Login
2. Complete profile
3. Daily check-in
4. Browse doctors
5. AI chatbot
6. Mental health assessments

🎉 **You're live!**

