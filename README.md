
# 🧠 MindBridge

**MindBridge is a visionary mental health platform that harnesses the power of AI, data science, and compassionate design to bridge the gap between people and the care they deserve.**

Our mission is to empower individuals, families, and clinicians with intelligent tools for mental wellness, early risk detection, and personalized support—making mental health care accessible, proactive, and stigma-free for all.

---

## ✨ Why MindBridge?

Mental health is complex, deeply personal, and often underserved. MindBridge reimagines the experience with:
- **AI-driven risk assessment** for early intervention
- **Smart doctor matching** for tailored care
- **Secure, real-time messaging** for support and connection
- **Engaging quizzes and insights** for self-awareness
- **A beautiful, intuitive interface** for all users

MindBridge is more than an app—it's a movement to make mental health care modern, data-driven, and truly human.

---

## 🚀 Features (Inspiring & Detailed)

### 1. AI Risk Assessment
- Real-time mental health risk prediction using validated quizzes (GAD-7, PHQ-9, PSS-10, etc.)
- Considers lifestyle factors: sleep, exercise, stress, and more
- Returns risk level (Low / Moderate / High / Critical) with confidence scores
- Explains risk factors and provides actionable recommendations

### 2. Intelligent Doctor Matching
- ML-powered recommendations for the best doctor based on your needs
- Matches by specialty, location, ratings, experience, and telehealth availability
- Shows match percentage and explains the reasoning

### 3. Secure Messaging
- HIPAA-style encrypted chat between patients and doctors
- Real-time, auto-refreshing conversations
- Supports both telehealth and in-person consultations

### 4. Quizzes & Assessments
- Interactive mental health quizzes for anxiety, depression, stress, and more
- Personalized insights and progress tracking
- Data completeness indicators to encourage engagement

### 5. Personalized Insights & Interventions
- AI-generated recommendations for lifestyle changes and interventions
- Identifies protective and risk factors unique to each user
- Urgency level assessment for timely support

### 6. Admin Dashboard
- Manage doctors, users, quizzes, and platform content
- Analytics for engagement, outcomes, and system health

### 7. Beautiful, Modern UI
- Responsive, accessible design for all devices
- Visual dashboards for risk, progress, and doctor matches
- Intuitive navigation and delightful user experience

---


## 🛠️ Tech Stack
- **Frontend**: Next.js 14 (App Router)
- **Backend**: Node.js, Prisma ORM
- **Database**: PostgreSQL
- **ML/AI**: TensorFlow.js, custom models
- **Auth**: JWT (custom, secure)
- **Deployment**: Vercel
- **Docker**: Local development support

---

---


## ⚡ Quick Start

### Local Development
1. Clone the repo:
   ```bash
   git clone https://github.com/Enigmah-00/MindBridge.git
   cd MindBridge
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   - Copy `.env.example` to `.env.local` and fill in:
     - `DATABASE_URL` (local Postgres)
     - `JWT_SECRET` (generate with `openssl rand -base64 32`)
4. Start Docker (for Postgres):
   ```bash
   docker-compose up -d
   ```
5. Run migrations & seed:
   ```bash
   npx prisma migrate dev
   npm run seed:dev
   ```
6. Start the app:
   ```bash
   npm run dev
   ```

### Vercel Deployment
See [`MINDGBRIDGE_ON_VERCEL.md`](./MINDGBRIDGE_ON_VERCEL.md) for full instructions.
- Set `DATABASE_URL`, `JWT_SECRET`, `NEXTAUTH_SECRET` in Vercel dashboard
- Use build command: `npm run vercel-build`
- Seed production DB: `curl -X POST https://<your-app>.vercel.app/api/seed`

---


## 🌱 Database Seeding
- Local: `npm run seed:dev`
- Production: `npm run seed:prod` or use `/api/seed` endpoint
See [`SEED_VERCEL_NOW.md`](./SEED_VERCEL_NOW.md) for details.

---

---


## 🐳 Docker
See [`DOCKER_SETUP_GUIDE.md`](./DOCKER_SETUP_GUIDE.md) for local Docker setup.

---

---


## 🔐 Troubleshooting
- Login issues on Vercel? See [`VERCEL_LOGIN_FIX.md`](./VERCEL_LOGIN_FIX.md)
- Empty quizzes/assessments? See [`SEED_VERCEL_NOW.md`](./SEED_VERCEL_NOW.md)
- Google API restriction? Review your usage and appeal if needed.

---

---


## 🤝 Contributing
MindBridge is a community-driven project. We welcome contributors from all backgrounds—developers, clinicians, designers, and advocates. Your ideas and feedback help us build a better future for mental health.

Pull requests welcome! Please open issues for bugs or feature requests.

---


## 📄 License
MIT
