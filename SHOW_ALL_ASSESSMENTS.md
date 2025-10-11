# 🎯 HOW TO SHOW ALL 8 ASSESSMENTS IN VERCEL

## The Problem
Your Vercel deployment only shows 2 assessments (GAD-7 and PHQ-9) instead of all 8.

## The Solution
You need to **seed your Vercel database** with all quiz questions.

---

## ✅ QUICK FIX (3 Steps)

### Step 1: Make sure your Vercel app is deployed
Visit your Vercel URL to confirm it's working (even if assessments are missing).

Example: `https://mind-bridge-xyz.vercel.app`

### Step 2: Run the seed command

Replace `YOUR-VERCEL-URL` with your actual Vercel URL:

```bash
curl -X POST https://YOUR-VERCEL-URL/api/seed
```

**Real example:**
```bash
curl -X POST https://mind-bridge-jxpgbdj9c-enigmah-00s-projects.vercel.app/api/seed
```

### Step 3: Verify
Visit your Vercel app → Go to "Quizzes" page

You should now see all 8 assessments:
1. ✅ GAD-7 (Anxiety)
2. ✅ PHQ-9 (Depression)
3. ✅ PSS-10 (Stress)
4. ✅ SPIN (Social Anxiety)
5. ✅ PDSS (Panic Disorder)
6. ✅ ASRS (ADHD)
7. ✅ OCI-R (OCD)
8. ✅ PCL-5 (PTSD)

---

## 🔧 Alternative: Use the Script

If you prefer, use the included script:

```bash
chmod +x seed-vercel-database.sh
./seed-vercel-database.sh https://YOUR-VERCEL-URL
```

---

## ❓ What if it doesn't work?

### Issue 1: "Environment variables not found"
**Solution:** Add environment variables in Vercel dashboard
1. Go to: https://vercel.com/dashboard
2. Click your project → Settings → Environment Variables
3. Add these 4 variables:
   - `mb_PRISMA_DATABASE_URL`
   - `mb_POSTGRES_URL`
   - `JWT_SECRET`
   - `GEMINI_API_KEY`
4. Redeploy

### Issue 2: "Connection timeout"
**Solution:** Your database might not be connected
1. Go to Vercel → Storage tab
2. Create or connect a Postgres database
3. Update environment variables with new database URLs
4. Redeploy

### Issue 3: "Already seeded but still showing 2 quizzes"
**Solution:** Clear and re-seed
1. Go to your Vercel Postgres dashboard
2. Delete all data from `Question` and `Quiz` tables
3. Run the seed command again

---

## 📋 Check Seed Status

To check if your database is already seeded:

```bash
curl https://YOUR-VERCEL-URL/api/seed
```

Response will show:
```json
{
  "seeded": true,
  "counts": {
    "doctors": 5,
    "quizzes": 8,
    "questions": 94,
    "specialties": 3
  }
}
```

---

## 🎯 Expected Result

After successful seeding, your `/quizzes` page should display:

```
📋 Mental Health Assessments

😰 Anxiety
GAD-7 Anxiety Questionnaire
Screening for generalized anxiety
7 questions • ~4 min
[Start Assessment]

😔 Depression
PHQ-9 Depression Questionnaire
Screening for depression symptoms
9 questions • ~5 min
[Start Assessment]

😰 Stress
PSS-10 Perceived Stress Scale
Measure your stress levels
10 questions • ~6 min
[Start Assessment]

... and 5 more assessments!
```

---

## 🚀 Quick Command (Copy-Paste Ready)

**Replace YOUR-URL with your actual Vercel URL:**

```bash
# Seed database
curl -X POST https://YOUR-URL/api/seed

# Check status
curl https://YOUR-URL/api/seed
```

---

## 💡 Pro Tip

Bookmark this command with your actual URL for easy re-seeding:

```bash
alias seed-mindbridge="curl -X POST https://mind-bridge-xyz.vercel.app/api/seed"
```

Then just run: `seed-mindbridge`

---

## ✅ Success Indicators

You'll know it worked when:
- ✅ API returns `"success": true`
- ✅ Shows 8 quizzes count
- ✅ Shows 94 questions count
- ✅ Vercel app displays all 8 assessments
- ✅ Each assessment is clickable and has questions

---

**Need more help?** Check:
- `VERCEL_SETUP_NOW.md` - Environment variables guide
- `QUICK_FIX_VERCEL.md` - Quick troubleshooting
- Vercel logs: `vercel logs --follow`
