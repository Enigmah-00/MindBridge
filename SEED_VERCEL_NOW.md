# 🌱 Seed Database on Vercel - Quick Guide

## Problem: "No quizzes available. Please run the database seed."

Your Vercel database is empty and needs to be populated with initial data (quizzes, doctors, specialties).

---

## ✅ Solution: Use the `/api/seed` Endpoint

### Option 1: Seed via Browser (Easiest)

1. **Visit the seed endpoint:**
   ```
   https://your-app.vercel.app/api/seed
   ```

2. **Replace with your actual URL:**
   - Find your Vercel URL in the Vercel dashboard
   - Example: `https://mindbridge-xyz123.vercel.app/api/seed`

3. **You should see:**
   ```json
   {
     "message": "Database seeded successfully",
     "created": {
       "doctors": 5,
       "specialties": 3,
       "quizzes": 6,
       "questions": 150
     }
   }
   ```

### Option 2: Seed via Terminal (CLI)

```bash
# Replace YOUR-APP-URL with your Vercel deployment URL
curl -X POST https://YOUR-APP-URL.vercel.app/api/seed
```

**Example:**
```bash
curl -X POST https://mindbridge.vercel.app/api/seed
```

### Option 3: Seed via Vercel Dashboard (Using cURL)

1. Open terminal
2. Run:
   ```bash
   # Get your Vercel URL first
   vercel ls
   
   # Then seed
   curl -X POST https://$(vercel ls --json | jq -r '.[0].url')/api/seed
   ```

---

## 🔍 What Gets Seeded?

The `/api/seed` endpoint creates:

### **Doctors** (5 doctors in Bangladesh)
- Dr. Mohammad Zaman (Dhaka) - Psychiatry, Therapy
- Dr. Farhana Ahmed (Chittagong) - Psychiatry
- Dr. Kamal Hossain (Dhaka) - Therapy
- Dr. Nasrin Sultana (Sylhet) - Psychiatry, Sleep Medicine
- Dr. Abdul Rahman (Dhaka) - Therapy

**Doctor login credentials:**
- Username: `dr_zaman` (or any doctor username)
- Password: `doctor123`

### **Specialties** (3 types)
- Psychiatry
- Therapy (CBT)
- Sleep Medicine

### **Quizzes** (6 mental health assessments)
- PHQ-9 (Depression)
- GAD-7 (Anxiety)
- PSS-10 (Stress)
- SPIN (Social Anxiety)
- PDSS (Panic Disorder)
- ASRS (ADHD)

Each quiz includes ~25 questions with scoring logic.

---

## 🧪 Verify Seeding Worked

### Check Quizzes Page
```
https://your-app.vercel.app/quizzes
```
Should show all 6 assessment quizzes.

### Check Doctors Page
```
https://your-app.vercel.app/doctors
```
Should show 5 doctors in Bangladesh.

### Check Database Directly

**If using Vercel Postgres:**
1. Go to Vercel Dashboard → Storage → Your Database
2. Click "Data" tab
3. Browse tables: `Quiz`, `Doctor`, `Specialty`

**If using Neon:**
1. Go to Neon Dashboard
2. Click "Tables"
3. Check: `Quiz`, `Doctor`, `Specialty` tables have data

---

## 🐛 Troubleshooting

### Error: "Database already seeded"

**Good news!** Your database is already populated. The seed script prevents duplicate data.

**Response:**
```json
{
  "message": "Database already seeded",
  "doctors": 5,
  "quizzes": 6
}
```

**Action:** No action needed. You're good to go!

### Error: "Environment variable not found: DATABASE_URL"

**Problem:** Database not connected.

**Fix:**
1. Check Vercel → Settings → Environment Variables
2. Ensure `DATABASE_URL` is set
3. Redeploy

### Error: "Unauthorized" or 401

**Problem:** Some seed endpoints have authentication.

**Fix:** Check if the route requires a secret parameter:
```bash
curl -X POST https://your-app.vercel.app/api/seed?secret=YOUR_JWT_SECRET
```

### Error: "Cannot POST /api/seed"

**Problem:** Using GET instead of POST.

**Fix:** Use POST method:
```bash
# ✅ Correct
curl -X POST https://your-app.vercel.app/api/seed

# ❌ Wrong (using GET)
curl https://your-app.vercel.app/api/seed
```

### Timeout or No Response

**Problem:** Seeding takes time (10-30 seconds).

**Fix:** Be patient. Large seed operations can take time. Try:
```bash
curl -X POST https://your-app.vercel.app/api/seed --max-time 60
```

---

## 📋 Quick Checklist

After seeding, verify these work:

- [ ] Visit `/quizzes` - Shows 6 assessments
- [ ] Click any quiz - Shows questions
- [ ] Visit `/doctors` - Shows 5 doctors
- [ ] Click doctor - Shows profile with specialties
- [ ] Can log in as doctor (username: `dr_zaman`, password: `doctor123`)
- [ ] Can take a quiz and see results

---

## 🔐 Security Note

**⚠️ Important:** The `/api/seed` endpoint is public by default for easy initial setup.

**After seeding once, you should:**

1. **Disable the endpoint** (add authentication)
2. **Or remove it entirely** from production

**To protect it, edit:** `src/app/api/seed/route.ts`

Add authentication:
```typescript
export async function POST(req: NextRequest) {
  // Add authentication check
  const { searchParams } = new URL(req.url);
  const secret = searchParams.get('secret');
  
  if (secret !== process.env.JWT_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  // ... rest of seed logic
}
```

Then use:
```bash
curl -X POST "https://your-app.vercel.app/api/seed?secret=YOUR_SECRET"
```

---

## 🎯 Next Steps After Seeding

1. **Create your user account:**
   - Visit: `/auth/signup`
   - Sign up with your email

2. **Take a quiz:**
   - Visit: `/quizzes`
   - Complete PHQ-9 or GAD-7

3. **Book a doctor:**
   - Visit: `/doctors`
   - Find a nearby doctor
   - Book appointment

4. **Try the chatbot:**
   - Visit: `/chatbot`
   - Ask mental health questions

---

## 📖 Related Commands

### Local Development
```bash
# Seed local database with TypeScript seeder (safest for dev)
npm run seed:dev

# Or manually with Prisma
npx prisma db seed
```

### Production (Vercel)
```bash
# Quick seed via API
curl -X POST https://YOUR-APP.vercel.app/api/seed

# Run production seed script (uses prisma/seed-production.js)
npm run seed:prod --if-present

# With your actual URL
VERCEL_URL="https://mindbridge.vercel.app"
curl -X POST $VERCEL_URL/api/seed

# Save as alias for easy reuse
alias seed-vercel="curl -X POST https://mindbridge.vercel.app/api/seed"
```

---

## ✅ Success!

Once seeded, your MindBridge app is ready with:
- ✅ 6 mental health assessments
- ✅ 5 doctors across Bangladesh
- ✅ 3 medical specialties
- ✅ ~150 assessment questions
- ✅ Login credentials for testing

**Your mental health platform is live! 🎉**
