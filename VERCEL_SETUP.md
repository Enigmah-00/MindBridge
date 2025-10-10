# Vercel Setup Instructions

## Database Setup (Vercel Postgres)

### 1. Create Vercel Postgres Database

1. Go to your Vercel project: https://vercel.com/dashboard
2. Select your project
3. Go to **Storage** tab
4. Click **Create Database**
5. Select **Postgres**
6. Click **Continue**
7. Name your database (e.g., "mindbridge-db")
8. Select a region close to your users
9. Click **Create**

### 2. Connect Database to Project

After creating the database, Vercel will automatically add these environment variables to your project:

- `POSTGRES_URL` (pooled connection)
- `POSTGRES_URL_NON_POOLING` (direct connection)
- `POSTGRES_PRISMA_URL` (optimized for Prisma)
- `POSTGRES_URL_NO_SSL`
- `POSTGRES_USER`
- `POSTGRES_HOST`
- `POSTGRES_PASSWORD`
- `POSTGRES_DATABASE`

### 3. Add Required Environment Variables

Go to **Settings** → **Environment Variables** and add:

**Required:**
- `DATABASE_URL` = Copy from `POSTGRES_PRISMA_URL`
- `DIRECT_URL` = Copy from `POSTGRES_URL_NON_POOLING`
- `JWT_SECRET` = Generate a secure random string (e.g., use: `openssl rand -base64 32`)

**Optional:**
- `NEXT_PUBLIC_APP_NAME` = `MindBridge`

### 4. Run Database Migrations

After setting up environment variables, you need to run migrations on your production database.

**Option A: Using Vercel CLI (Recommended)**

```bash
# Install Vercel CLI if you haven't
npm i -g vercel

# Login to Vercel
vercel login

# Pull environment variables
vercel env pull .env.production

# Run migrations against production database
DATABASE_URL="<your-production-database-url>" npx prisma migrate deploy

# Run seed (optional, to populate initial data)
DATABASE_URL="<your-production-database-url>" npx tsx prisma/seed.ts
```

**Option B: Using Vercel Dashboard**

1. Go to your project **Settings** → **Functions**
2. Add a temporary API route to run migrations (we'll delete it after)

Create a file at `src/app/api/setup-db/route.ts`:

```typescript
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Test database connection
    await prisma.$connect();
    
    return NextResponse.json({ 
      success: true, 
      message: 'Database connected successfully' 
    });
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: String(error) 
    }, { status: 500 });
  }
}
```

After deployment, visit: `https://your-app.vercel.app/api/setup-db`

### 5. Redeploy

After setting all environment variables:

```bash
# Commit your changes
git add .
git commit -m "Configure for Vercel deployment"
git push

# Or manually redeploy in Vercel dashboard
```

## Troubleshooting

### Error: "Can't reach database server"

**Check:**
1. ✅ All environment variables are set in Vercel
2. ✅ `DATABASE_URL` is set to the pooled connection URL
3. ✅ `DIRECT_URL` is set to the direct connection URL
4. ✅ Migrations have been run on production database

### Error: "Table does not exist"

You need to run migrations:

```bash
# Use the DIRECT_URL for migrations
DIRECT_URL="<your-direct-url>" npx prisma migrate deploy
```

### Database Connection Issues

Make sure you're using the correct Vercel Postgres URLs:
- `DATABASE_URL` → Use `POSTGRES_PRISMA_URL` (pooled)
- `DIRECT_URL` → Use `POSTGRES_URL_NON_POOLING` (direct)

## Quick Setup Command

```bash
# 1. Pull environment variables from Vercel
vercel env pull

# 2. Run migrations
npx prisma migrate deploy

# 3. (Optional) Seed the database
npx tsx prisma/seed.ts

# 4. Redeploy
vercel --prod
```
