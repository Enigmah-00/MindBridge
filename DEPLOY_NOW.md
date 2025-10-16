# ✅ VERCEL DEPLOYMENT - QUICK REFERENCE

## 🚨 Fix Applied ✅
- **Problem:** Prisma schema used non-standard env vars
- **Solution:** Changed to standard `DATABASE_URL`
- **Status:** Fixed and pushed to GitHub

---

## 🚀 Deploy Now - 3 Steps

### Step 1: Set Environment Variables in Vercel

Go to: **Vercel Dashboard → Your Project → Settings → Environment Variables**

**Required (Minimum):**
```env
DATABASE_URL=postgresql://user:pass@host:port/db?sslmode=require
JWT_SECRET=put-random-32-char-string-here
NEXTAUTH_URL=https://your-app-name.vercel.app
```

**Generate JWT_SECRET:**
```bash
openssl rand -base64 32
# Copy the output to Vercel
```

### Step 2: Choose Database Option

**Option A - Vercel Postgres (Easiest):**
1. Vercel Dashboard → **Storage** → **Create Database**
2. Select **Postgres** → Name it → Create
3. `DATABASE_URL` is auto-set ✅
4. Free: 256MB

**Option B - Neon (More Storage):**
1. Go to https://neon.tech → Sign up
2. Create Project → Copy connection string
3. Add to Vercel as `DATABASE_URL`
4. Free: 3GB

### Step 3: Redeploy

**Method 1 - Vercel Dashboard:**
- Click **Deployments** → Latest → **Redeploy**

**Method 2 - Git Push:**
```bash
git commit --allow-empty -m "trigger redeploy"
git push origin main
```

---

## 📋 Post-Deployment

### Run Migrations:
```bash
# Install Vercel CLI
npm i -g vercel

# Get production DATABASE_URL
vercel env pull

# Run migrations
npx prisma migrate deploy
```

### Seed Database (Optional):
```bash
npx prisma db seed
```

---

## 🔧 Optional Features

Add these env vars for full functionality:

**AI Chatbot:**
```env
OPENAI_API_KEY=sk-proj-...
```

**Password Reset Emails:**
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=MindBridge <noreply@mindbridge.com>
```

**Google Maps (Location):**
```env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-key-here
```

---

## ✅ Success Checklist

After deployment:
- [ ] Visit https://your-app.vercel.app
- [ ] Sign up works
- [ ] Login works
- [ ] Dashboard loads
- [ ] Database stores data
- [ ] Check-in system works

---

## 🆘 Common Issues

### Build Fails
❌ **Error:** "Prisma Client not found"
✅ **Fix:** Add to `package.json`:
```json
"scripts": {
  "postinstall": "prisma generate"
}
```

### Database Connection Fails
❌ **Error:** "Can't reach database"
✅ **Fix:** Check `DATABASE_URL`:
- Must start with `postgresql://`
- Must end with `?sslmode=require`
- Test locally: `npx prisma db pull`

### Migrations Fail
❌ **Error:** "Migration failed"
✅ **Fix:** Run migrations manually:
```bash
DATABASE_URL="your-prod-url" npx prisma migrate deploy
```

---

## 📊 Deployment Status

**Current Status:** ✅ **READY TO DEPLOY**

**Code Status:**
- ✅ Prisma schema fixed
- ✅ Pushed to GitHub
- ✅ Build tested locally

**Next Action:**
1. Set 3 env vars in Vercel (DATABASE_URL, JWT_SECRET, NEXTAUTH_URL)
2. Click Redeploy
3. Run migrations
4. **LIVE!** 🎉

---

## 🎯 Quick Commands

```bash
# Local test
npm run build

# Deploy trigger
git push origin main

# Check deployment
vercel ls

# View logs
vercel logs your-app-url

# Run migrations
DATABASE_URL="prod-url" npx prisma migrate deploy
```

---

## 💡 Pro Tips

1. **Use Preview Deployments:**
   - Every PR gets a preview URL
   - Test before merging to main

2. **Set Env Vars for All Environments:**
   - Production ✅
   - Preview ✅
   - Development ✅

3. **Monitor Your App:**
   - Vercel Analytics (free)
   - Check error logs regularly

4. **Database Backups:**
   - Vercel Postgres: Auto-backup
   - Neon: Manual backup available

---

**Time to Deploy:** 5-10 minutes ⏱️
**Cost:** $0 (Free tier) 💰
**Difficulty:** Easy 🟢

**Go deploy your mental health platform! 🚀**
