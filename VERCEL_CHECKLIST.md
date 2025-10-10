# Vercel Deployment Quick Checklist

## ❌ Current Issues
- [ ] No cloud database configured (using localhost PostgreSQL)
- [ ] Missing environment variables on Vercel
- [ ] Auth endpoints failing silently

## ✅ Steps to Fix

### 1. Database Setup (Choose ONE)
- [ ] **Option A:** Set up Vercel Postgres (easiest)
- [ ] **Option B:** Set up Neon database (free tier)
- [ ] **Option C:** Set up Supabase (free tier)

### 2. Vercel Environment Variables
- [ ] Add `JWT_SECRET=enigmah`
- [ ] Add `DATABASE_URL=<your-cloud-db-url>`
- [ ] Add `NEXT_PUBLIC_APP_NAME=MindBridge`

### 3. Database Migrations
- [ ] Run `npx prisma migrate deploy` with cloud DATABASE_URL
- [ ] Run `npx prisma db seed` to populate initial data

### 4. Deployment
- [ ] Push latest code to Git repository
- [ ] Verify Vercel auto-deploys
- [ ] Check deployment logs for errors

### 5. Testing
- [ ] Test signup endpoint
- [ ] Test login endpoint
- [ ] Test authenticated routes

## 📝 Quick Commands

```bash
# Pull Vercel env vars locally
vercel env pull .env.production

# Run migrations on cloud DB
DATABASE_URL="<cloud-url>" npx prisma migrate deploy

# Test endpoints (replace YOUR-URL)
curl -X POST https://YOUR-URL.vercel.app/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"test123"}'
```

## 🎯 Expected Result

After completing all steps:
- ✅ Signup should create users
- ✅ Login should return auth token
- ✅ Auth cookie should be set
- ✅ Protected routes should work

See **VERCEL_SETUP.md** for detailed instructions!
