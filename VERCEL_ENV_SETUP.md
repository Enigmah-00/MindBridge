# Vercel Environment Variables Setup Guide

## The Error
```
Error: Environment variable not found: mb_POSTGRES_URL
Error: Environment variable not found: mb_PRISMA_DATABASE_URL
```

This means your Vercel deployment doesn't have the required database environment variables.

## Solution: Add Environment Variables to Vercel

### Step 1: Go to Vercel Dashboard
1. Visit https://vercel.com/dashboard
2. Select your **MindBridge** project
3. Click on **Settings** tab
4. Click on **Environment Variables** in the left sidebar

### Step 2: Add Database Variables

You need to add these environment variables from your local `.env` file:

#### Required Variables:

1. **mb_PRISMA_DATABASE_URL**
   - Key: `mb_PRISMA_DATABASE_URL`
   - Value: Your Prisma Accelerate connection string
   - Example: `prisma://accelerate.prisma-data.net/?api_key=your_api_key`

2. **mb_POSTGRES_URL**
   - Key: `mb_POSTGRES_URL`
   - Value: Your direct PostgreSQL connection string
   - Example: `postgres://user:password@hostname:5432/database?sslmode=require`

3. **JWT_SECRET**
   - Key: `JWT_SECRET`
   - Value: Your JWT secret (any random string)
   - Example: `your-secret-key-here-make-it-long-and-random`

4. **GEMINI_API_KEY** (Optional - for AI Chatbot)
   - Key: `GEMINI_API_KEY`
   - Value: Your Google Gemini API key
   - Example: `AIzaSyAgoRnn8YZHSRv29fdtfegr7u9b1lWDg4g`

### Step 3: Find Your Local Values

Run this command in your terminal to see your current values (be careful not to share these publicly):

```bash
cat .env
```

You'll see something like:
```
mb_PRISMA_DATABASE_URL="prisma://accelerate.prisma-data.net/?api_key=..."
mb_POSTGRES_URL="postgres://username:password@hostname:5432/database"
JWT_SECRET="your-secret-here"
GEMINI_API_KEY="AIzaSy..."
```

### Step 4: Copy Values to Vercel

For each variable:
1. Click **Add New** in Vercel Environment Variables
2. Enter the **Name** (e.g., `mb_PRISMA_DATABASE_URL`)
3. Paste the **Value** from your `.env` file
4. Select which environments: ✅ Production ✅ Preview ✅ Development
5. Click **Save**

### Step 5: Redeploy

After adding all variables:
1. Go to **Deployments** tab
2. Click the **three dots** (•••) on your latest deployment
3. Click **Redeploy**
4. Or push a new commit to trigger automatic redeployment

## Alternative: Using Vercel CLI

If you prefer using the command line:

```bash
# Install Vercel CLI (if not already installed)
npm i -g vercel

# Login to Vercel
vercel login

# Link your project
vercel link

# Add environment variables
vercel env add mb_PRISMA_DATABASE_URL production
# Paste your value when prompted

vercel env add mb_POSTGRES_URL production
# Paste your value when prompted

vercel env add JWT_SECRET production
# Paste your value when prompted

vercel env add GEMINI_API_KEY production
# Paste your value when prompted

# Redeploy
vercel --prod
```

## What Happens After Adding Variables

1. ✅ Prisma will be able to connect to your database
2. ✅ Migrations will run automatically during build
3. ✅ Your app will deploy successfully
4. ✅ You can then seed the database using `/api/seed`

## Verifying Setup

After redeployment, check if it worked:

```bash
# Replace with your actual Vercel URL
curl https://your-app.vercel.app/api/seed

# Should return database status
{
  "seeded": false,
  "counts": {
    "doctors": 0,
    "quizzes": 0,
    "questions": 0,
    "specialties": 0
  }
}
```

## Common Issues

### Issue: "Connection pool timeout"
- **Solution**: Make sure you're using Prisma Accelerate URL for `mb_PRISMA_DATABASE_URL`

### Issue: "SSL required"
- **Solution**: Add `?sslmode=require` to the end of `mb_POSTGRES_URL`

### Issue: "Database does not exist"
- **Solution**: Create the database first in your Vercel Postgres dashboard

### Issue: Build fails after adding variables
- **Solution**: Make sure there are no quotes in the Vercel UI - just paste the raw value

## Security Notes

⚠️ **Never commit `.env` file to git!**
✅ `.env` is already in `.gitignore`
✅ Only add environment variables through Vercel Dashboard or CLI
✅ Use different database credentials for production vs development

## Next Steps After Successful Deployment

1. Visit your deployed app: `https://your-app.vercel.app`
2. Seed the database: `curl -X POST https://your-app.vercel.app/api/seed`
3. Create a user account and test the app
4. Login as a doctor to test doctor features (username: `dr_zaman`, password: `doctor123`)

---

Need help? Check Vercel logs:
```bash
vercel logs --follow
```
