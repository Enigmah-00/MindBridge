# MindBridge on Vercel: A Complete Guide

This document provides a comprehensive guide to deploying, configuring, and managing the MindBridge application on Vercel.

## 1. Initial Deployment & Configuration

### Environment Variables

The following environment variables are **required** for the application to run correctly on Vercel. Set these in your Vercel project settings:

-   `DATABASE_URL`: The connection string for your PostgreSQL database. It's highly recommended to use Vercel Postgres.
-   `JWT_SECRET`: A long, random, and secret string used for signing authentication tokens. You can generate one using `openssl rand -base64 32`.
-   `NEXTAUTH_SECRET`: Can be the same value as `JWT_SECRET`. This is included for compatibility.

### Build Command

Vercel should automatically detect the `vercel-build` script in `package.json`. Ensure your build command in Vercel's settings is either empty (to use the script) or set to:

```bash
npm run vercel-build
```

The `vercel-build` script automatically runs database migrations: `prisma generate && prisma migrate deploy && next build`.

## 2. Seeding the Production Database

After a successful deployment, the database will be empty. You must manually seed it to populate quizzes, initial data, etc.

**There are two ways to do this:**

### Option A: Using the Seeding API Endpoint (Recommended)

This is the safest and easiest method.

1.  **Get your deployment URL:** Find the URL of your latest production deployment from the Vercel dashboard. It will look something like `https://your-project-name-xxxx.vercel.app`.

2.  **Run the following `curl` command** in your local terminal, replacing the placeholder with your actual URL:

    ```bash
    curl -X POST https://<your-app-name>.vercel.app/api/seed
    ```

    -   **Note:** This process can take up to 60 seconds. The terminal might not show any output until it's complete.

3.  **Verify:** Refresh the "Assessments" or "Quizzes" page in your application. The data should now be visible.

### Option B: Using Vercel CLI

This method is for more advanced use cases.

1.  **Install Vercel CLI:**
    ```bash
    npm i -g vercel
    ```

2.  **Link your project:**
    ```bash
    vercel link
    ```

3.  **Run the production seed script:**
    ```bash
    vercel run seed:prod
    ```

## 3. Troubleshooting

### Login Issues ("Login Failed")

-   **Cause:** This is almost always due to a missing or mismatched `JWT_SECRET` or `NEXTAUTH_SECRET` environment variable in Vercel.
-   **Solution:**
    1.  Go to your Vercel project settings.
    2.  Navigate to "Environment Variables".
    3.  Ensure `JWT_SECRET` is set to a strong, random secret.
    4.  Add `NEXTAUTH_SECRET` with the same value.
    5.  Redeploy the application for the new variables to take effect.

### Empty Assessments/Quizzes

-   **Cause:** The production database has not been seeded.
-   **Solution:** Follow the steps in the "Seeding the Production Database" section above.

### Migration Issues

-   The `prisma migrate deploy` command is automatically run during the build process.
-   If you need to create a **new migration**, you must do it in your **local development environment**:
    1.  Make changes to your `prisma/schema.prisma` file.
    2.  Run `npx prisma migrate dev --name your-migration-name`.
    3.  Commit the new migration file from the `prisma/migrations` directory and push it to your Git repository.
    4.  The new migration will be applied automatically on the next Vercel deployment.
