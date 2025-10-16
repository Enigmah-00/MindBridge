# 🚀 Deploy to Vercel - Quick Visual Guide

## 🎯 Your Issue: DATABASE_URL Missing

```
❌ Error: Environment variable not found: DATABASE_URL
```

---

## ✅ Fix in 3 Steps (5 Minutes)

### Step 1: Create Database (Choose One)

#### Option A: Vercel Postgres (Easiest) ⭐

```
1. Open: https://vercel.com/enigmah-00/mindbridge
2. Click: "Storage" tab
3. Click: "Create Database" button
4. Select: "Postgres"
5. Name: mindbridge-db
6. Click: "Create"

✅ DATABASE_URL automatically added!
```

#### Option B: Neon (More Free Storage)

```
1. Open: https://neon.tech
2. Sign up with GitHub
3. Create new project: "mindbridge"
4. Copy connection string
   Example: postgresql://user:pass@ep-cool-dawn-123456.us-east-2.aws.neon.tech/mindbridge?sslmode=require
```

---

### Step 2: Add Environment Variables

Go to Vercel project → Settings → Environment Variables

Add these **4 required variables**:

```env
┌─────────────────────────────────────────────────────┐
│ Name: DATABASE_URL                                  │
│ Value: postgresql://user:pass@host:5432/db         │
│ [✓] Production [✓] Preview [✓] Development         │
│ [Save]                                              │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ Name: NEXTAUTH_SECRET                               │
│ Value: (generate with: openssl rand -base64 32)    │
│ [✓] Production [✓] Preview [✓] Development         │
│ [Save]                                              │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ Name: NEXTAUTH_URL                                  │
│ Value: https://mindbridge.vercel.app               │
│ [✓] Production [✓] Preview [✓] Development         │
│ [Save]                                              │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ Name: OPENAI_API_KEY                                │
│ Value: sk-proj-your-openai-key                     │
│ [✓] Production [✓] Preview [✓] Development         │
│ [Save]                                              │
└─────────────────────────────────────────────────────┘
```

**Generate NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
# Copy the output and paste as NEXTAUTH_SECRET
```

---

### Step 3: Redeploy

```
Option A: Automatic (Push to GitHub)
─────────────────────────────────────
git add .
git commit -m "Add environment configuration"
git push origin main

✅ Vercel auto-deploys on push!


Option B: Manual (Vercel Dashboard)
────────────────────────────────────
1. Go to "Deployments" tab
2. Click "..." on latest deployment
3. Click "Redeploy"

✅ Deployment starts immediately!
```

---

## 📊 Visual Deployment Flow

```
┌─────────────────────────────────────────────────┐
│  1. You Push to GitHub                          │
│     git push origin main                        │
└────────────────┬────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────┐
│  2. Vercel Detects Push                         │
│     - Clones your code                          │
│     - Reads environment variables               │
└────────────────┬────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────┐
│  3. Build Process                               │
│     npm install                                 │
│     prisma generate  ← Needs DATABASE_URL       │
│     next build                                  │
└────────────────┬────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────┐
│  4. Deploy                                      │
│     ✅ Your app goes live!                      │
│     https://mindbridge.vercel.app               │
└─────────────────────────────────────────────────┘
```

---

## 🎯 Checklist Before Deploy

```
Environment Variables in Vercel:
├─ [✓] DATABASE_URL (from Vercel Postgres or Neon)
├─ [✓] NEXTAUTH_SECRET (generated with openssl)
├─ [✓] NEXTAUTH_URL (your Vercel app URL)
└─ [✓] OPENAI_API_KEY (from OpenAI dashboard)

Code Ready:
├─ [✓] Latest code pushed to GitHub
├─ [✓] package.json has "postinstall": "prisma generate"
└─ [✓] prisma/schema.prisma uses env("DATABASE_URL")

After First Deploy:
└─ [✓] Run migrations (see below)
```

---

## 🔧 After First Successful Deploy

### Apply Database Migrations

Your database is empty! You need to apply the schema:

```bash
# Install Vercel CLI
npm install -g vercel

# Link to your project
vercel link

# Pull production environment variables
vercel env pull .env.production

# Apply migrations to production
source .env.production && npx prisma migrate deploy

# Optional: Seed with demo data
source .env.production && npx prisma db seed
```

---

## 🎨 Visual: What Happens When You Deploy

```
┌──────────────────────────────────────────────────┐
│           Your GitHub Repository                 │
│  ┌────────────────────────────────────────┐      │
│  │ - src/                                 │      │
│  │ - prisma/schema.prisma                 │      │
│  │ - package.json                         │      │
│  │ - next.config.js                       │      │
│  └────────────────────────────────────────┘      │
└────────────────┬─────────────────────────────────┘
                 │ git push
                 ▼
┌──────────────────────────────────────────────────┐
│              Vercel Platform                     │
│  ┌────────────────────────────────────────┐      │
│  │  Build Environment                     │      │
│  │  - Reads DATABASE_URL ✅               │      │
│  │  - Reads NEXTAUTH_SECRET ✅            │      │
│  │  - Runs: prisma generate ✅            │      │
│  │  - Runs: next build ✅                 │      │
│  └────────────────────────────────────────┘      │
│                                                   │
│  ┌────────────────────────────────────────┐      │
│  │  Production Deployment                 │      │
│  │  URL: mindbridge.vercel.app ✅         │      │
│  │  HTTPS: Auto-configured ✅             │      │
│  │  CDN: Global edge network ✅           │      │
│  └────────────────────────────────────────┘      │
└──────────────────────────────────────────────────┘
                 │
                 ▼
┌──────────────────────────────────────────────────┐
│           Your Database (Neon/Vercel)            │
│  ┌────────────────────────────────────────┐      │
│  │  Tables: User, Profile, Doctor...      │      │
│  │  Data: Users, check-ins, bookings      │      │
│  │  Migrations: Applied ✅                 │      │
│  └────────────────────────────────────────┘      │
└──────────────────────────────────────────────────┘
```

---

## 🐛 Troubleshooting

### Problem: Build fails with "DATABASE_URL not found"
```
✅ Solution:
1. Go to Vercel → Settings → Environment Variables
2. Add DATABASE_URL
3. Redeploy
```

### Problem: "Prisma Client not generated"
```
✅ Solution:
Check package.json has:
"postinstall": "prisma generate"

Then push to GitHub (triggers rebuild)
```

### Problem: App works but database is empty
```
✅ Solution:
Run migrations:
vercel env pull .env.production
source .env.production && npx prisma migrate deploy
```

### Problem: "NEXTAUTH_SECRET missing"
```
✅ Solution:
Generate secret:
openssl rand -base64 32

Add to Vercel env vars
Redeploy
```

---

## 🎉 Success! What's Next?

After successful deployment:

```
1. Visit your app: https://mindbridge.vercel.app
2. Sign up for an account
3. Complete your profile
4. Fill out daily check-in
5. Browse doctors
6. Try the AI chatbot
7. Take mental health assessments
```

---

## 📊 Monitoring Your App

```
Vercel Dashboard → Your Project:
├─ Analytics: View traffic, performance
├─ Logs: Check for runtime errors
├─ Deployments: See deployment history
└─ Domains: Add custom domain (optional)

Your Database (Neon):
├─ Dashboard: View tables, data
├─ Metrics: Check connections, queries
└─ Branches: Create dev/staging copies
```

---

## 🔑 Environment Variables Summary

```
Required (Minimum):
┌─────────────────────────────────────┐
│ DATABASE_URL          (Database)    │
│ NEXTAUTH_SECRET       (Auth)        │
│ NEXTAUTH_URL          (Auth)        │
│ OPENAI_API_KEY        (Chatbot)     │
└─────────────────────────────────────┘

Optional (Enhanced):
┌─────────────────────────────────────┐
│ NEXT_PUBLIC_GOOGLE_MAPS_API_KEY    │
│ EMAIL_SERVER_HOST                  │
│ EMAIL_SERVER_PORT                  │
│ EMAIL_SERVER_USER                  │
│ EMAIL_SERVER_PASSWORD              │
│ EMAIL_FROM                         │
└─────────────────────────────────────┘
```

---

## 🚀 Deploy Commands Reference

```bash
# Generate NEXTAUTH_SECRET
openssl rand -base64 32

# Link to Vercel project
vercel link

# Pull environment variables
vercel env pull .env.production

# Deploy manually
vercel --prod

# Run migrations
source .env.production && npx prisma migrate deploy

# Seed database
source .env.production && npx prisma db seed

# View logs
vercel logs

# Open project in browser
vercel open
```

---

## ✅ Final Checklist

Before declaring success:

- [ ] Vercel project created
- [ ] Database created (Vercel Postgres or Neon)
- [ ] All 4 env vars added to Vercel
- [ ] Latest code pushed to GitHub
- [ ] Deployment succeeded (green checkmark)
- [ ] Migrations applied to database
- [ ] App accessible at vercel.app URL
- [ ] Can sign up / login
- [ ] Features working (check-in, doctors, chatbot)

---

**Your mental health platform is live! 🎉**

Share your app: `https://mindbridge.vercel.app`

