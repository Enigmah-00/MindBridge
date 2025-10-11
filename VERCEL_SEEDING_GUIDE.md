# Database Seeding for Vercel Deployment

## Problem
After deploying to Vercel, the database is empty - no doctors, quizzes, or assessment questions exist.

## Solution
Use the `/api/seed` endpoint to populate the database with initial data.

## How to Seed Your Vercel Database

### Option 1: Using curl (Recommended)
After your Vercel deployment is successful, run this command:

```bash
curl -X POST https://your-app-name.vercel.app/api/seed
```

Replace `your-app-name.vercel.app` with your actual Vercel domain.

### Option 2: Using Browser
Simply visit this URL in your browser:
```
https://your-app-name.vercel.app/api/seed
```

Click the POST button or use a tool like Postman to send a POST request.

### Option 3: Check Seed Status
To check if your database is already seeded:
```bash
curl https://your-app-name.vercel.app/api/seed
```

This will return:
```json
{
  "seeded": true,
  "counts": {
    "doctors": 5,
    "quizzes": 8,
    "questions": 100+,
    "specialties": 3
  }
}
```

## What Gets Seeded

### Doctors (5 total)
- Dr. Mohammad Zaman (Dhaka) - Psychiatry, CBT
- Dr. Farhana Ahmed (Chittagong) - Psychiatry
- Dr. Kamal Hossain (Dhaka) - Therapy
- Dr. Nasrin Sultana (Sylhet) - Psychiatry, Sleep Medicine
- Dr. Abdul Rahman (Dhaka) - Therapy

**Login credentials for doctors:**
- Username: `dr_zaman`, `dr_ahmed`, `dr_hossain`, `dr_sultana`, `dr_rahman`
- Password: `doctor123`

### Specialties
- Psychiatry
- Therapy (CBT)
- Sleep Medicine

### Quizzes/Assessments (8 total)
1. **PHQ-9** - Depression Questionnaire (9 questions)
2. **GAD-7** - Anxiety Questionnaire (7 questions)
3. **PSS-10** - Perceived Stress Scale (10 questions)
4. **SPIN** - Social Phobia Inventory
5. **PDSS** - Panic Disorder Severity Scale
6. **ASRS** - Adult ADHD Self-Report Scale
7. **OCI-R** - Obsessive-Compulsive Inventory
8. **PCL-5** - PTSD Checklist

## Important Notes

1. **Run Once**: The endpoint checks if data exists and won't duplicate it
2. **Safe to Re-run**: If data already exists, it will return a message saying "Database already seeded"
3. **Automatic**: This happens automatically during build via `prisma migrate deploy`

## After Seeding

Once seeded, users can:
- ✅ View and book appointments with 5 Bangladesh-based doctors
- ✅ Take 8 different mental health assessments
- ✅ Get personalized doctor suggestions based on location and needs
- ✅ See assessment results stored in their profile

## Troubleshooting

### If seed fails:
1. Check Vercel logs for detailed error messages
2. Ensure database environment variables are set correctly:
   - `mb_PRISMA_DATABASE_URL`
   - `mb_POSTGRES_URL`
3. Verify migrations ran successfully during build

### If doctors/quizzes don't appear:
1. Check seed status: `GET /api/seed`
2. Re-run seed: `POST /api/seed`
3. Check database connection in Vercel dashboard

## Security Note

⚠️ **Production Recommendation**: 
After initial seeding, you may want to:
1. Disable this endpoint
2. Add authentication to prevent unauthorized seeding
3. Remove the route file entirely

For now, it's safe because:
- It checks if data exists before seeding
- It only creates data, doesn't delete
- It uses `upsert` to avoid duplicates
