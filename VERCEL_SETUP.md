# Vercel Deployment Setup Guide

## 🔴 Why Auth Fails on Vercel (But Works Locally)

Your project works locally but fails on Vercel because:

1. **Missing Environment Variables** - Vercel doesn't have access to your `.env` file
2. **Database Connection** - Your local PostgreSQL database isn't accessible from Vercel
3. **Silent Failures** - Missing `JWT_SECRET` causes auth to fail without clear errors

## ✅ Step-by-Step Fix

### Step 1: Set Up a Cloud Database

Choose one of these options:

#### Option A: Vercel Postgres (Recommended - Easiest) ⭐

1. Go to your [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to **Storage** tab
4. Click **Create Database** → **Postgres**
5. Follow the wizard (it's free to start)
6. Vercel will automatically add `DATABASE_URL` to your environment variables

#### Option B: Neon (Serverless Postgres - Free Tier)

1. Go to [neon.tech](https://neon.tech)
2. Sign up and create a new project
3. Copy your connection string (looks like: `postgresql://user:pass@ep-xxx.us-east-2.aws.neon.tech/neondb`)
4. Add it to Vercel (see Step 2 below)

#### Option C: Supabase (Full Backend Platform - Free Tier)

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Go to Project Settings → Database
4. Copy the connection string (Connection pooling mode)
5. Add it to Vercel (see Step 2 below)

### Step 2: Add Environment Variables to Vercel

1. Go to your Vercel project dashboard
2. Click **Settings** → **Environment Variables**
3. Add these variables:

```
JWT_SECRET=enigmah
DATABASE_URL=<your-cloud-database-url-from-step-1>
NEXT_PUBLIC_APP_NAME=MindBridge
```

**Important:** Make sure to add them for all environments (Production, Preview, Development)

### Step 3: Run Database Migrations

After setting up your cloud database, you need to run migrations:

#### If using Vercel Postgres:
```bash
# Install Vercel CLI if you haven't
npm i -g vercel

# Pull environment variables
vercel env pull .env.production

# Run migrations using the production DATABASE_URL
DATABASE_URL="<your-vercel-postgres-url>" npx prisma migrate deploy

# Seed the database (optional)
DATABASE_URL="<your-vercel-postgres-url>" npx prisma db seed
```

#### If using Neon or Supabase:
```bash
# Update your .env temporarily with the cloud database URL
DATABASE_URL="<your-cloud-database-url>" npx prisma migrate deploy

# Seed the database
DATABASE_URL="<your-cloud-database-url>" npx prisma db seed
```

### Step 4: Redeploy

1. Push your latest code changes to GitHub/GitLab/Bitbucket
2. Vercel will automatically redeploy
3. Or manually trigger a redeploy from the Vercel dashboard

### Step 5: Test Your Deployment

After deployment, test the auth endpoints:

```bash
# Replace YOUR-VERCEL-URL with your actual Vercel URL
curl -X POST https://YOUR-VERCEL-URL.vercel.app/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"testpass123"}'

curl -X POST https://YOUR-VERCEL-URL.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"usernameOrEmail":"testuser","password":"testpass123"}'
```

## 🔍 Debugging on Vercel

### Check Logs
1. Go to your Vercel project
2. Click on a deployment
3. Go to **Functions** tab
4. Click on the function logs to see errors

### Common Issues

#### "JWT_SECRET environment variable is not set"
- **Fix:** Add `JWT_SECRET` in Vercel environment variables

#### Database connection errors
- **Fix:** Make sure `DATABASE_URL` points to a cloud database, not `localhost`

#### "prisma generate" errors
- **Fix:** Add a build script in `package.json`:
  ```json
  {
    "scripts": {
      "build": "prisma generate && next build"
    }
  }
  ```

#### CORS errors
- **Fix:** Add proper CORS headers (already handled in Next.js API routes)

## 📝 Environment Variables Checklist

Make sure these are set in Vercel:

- ✅ `JWT_SECRET` - For authentication tokens
- ✅ `DATABASE_URL` - Cloud database connection string
- ✅ `NEXT_PUBLIC_APP_NAME` - App name (optional but recommended)

## 🎉 Success!

Once everything is set up, your auth should work on Vercel just like it does locally!

## 📚 Additional Resources

- [Vercel Postgres Docs](https://vercel.com/docs/storage/vercel-postgres)
- [Neon Documentation](https://neon.tech/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Prisma with Vercel](https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-vercel)
