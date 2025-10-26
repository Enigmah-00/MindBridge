
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


## 🚀 Features & Why They Matter

### 1. AI Risk Assessment
**Why:** Early detection saves lives. Our AI analyzes validated quizzes and lifestyle data to flag risks before they escalate, empowering users and clinicians to act proactively.
- Real-time mental health risk prediction (GAD-7, PHQ-9, PSS-10, etc.)
- Considers sleep, exercise, stress, and more
- Returns risk level (Low / Moderate / High / Critical) with confidence scores
- Explains risk factors and provides actionable recommendations

### 2. Intelligent Doctor Matching
**Why:** Finding the right doctor is critical for effective care. Our ML-powered matching ensures users connect with clinicians best suited to their needs, location, and preferences.
- Recommendations based on specialty, location, ratings, experience, telehealth
- Match percentage and transparent reasoning

### 3. Secure Messaging
**Why:** Support and connection are vital. Secure, real-time chat lets patients and doctors communicate freely, reducing barriers to care and fostering trust.
- HIPAA-style encrypted chat
- Real-time, auto-refreshing conversations
- Telehealth and in-person support

### 4. Quizzes & Assessments
**Why:** Self-awareness is the first step to wellness. Engaging quizzes help users understand their mental health, track progress, and start meaningful conversations with providers.
- Interactive quizzes for anxiety, depression, stress, and more
- Personalized insights and progress tracking
- Data completeness indicators

### 5. Games for Mental Wellbeing
**Why:** Play is powerful for mental health. MindBridge offers mindful games that reduce anxiety, improve focus, and train cognitive skills in a fun, stress-free way.
- Breathing Pacer: Guided relaxation and anxiety reduction
- Reaction Time: Focus and attention training
- Memory Match: Cognitive exercise for memory
- Simon Says: Pattern recognition and working memory
- 2048 & Color Sort: Strategic, meditative puzzles
- [See all games and benefits in](./GAMES_README.md)

### 6. Personalized Insights & Interventions
**Why:** Every user is unique. Our AI delivers tailored recommendations and urgency assessments, helping users take the right steps at the right time.
- Lifestyle and intervention suggestions
- Protective/risk factor identification
- Urgency level for timely support

### 7. Admin Dashboard
**Why:** Quality care needs strong management. Admins can oversee doctors, users, quizzes, and analytics to ensure the platform delivers real impact.
- Manage doctors, users, quizzes, and content
- Engagement and outcome analytics

### 8. Beautiful, Modern UI
**Why:** Design matters for accessibility and engagement. MindBridge is visually appealing, intuitive, and responsive—making mental health care welcoming for all.
- Responsive, accessible design
- Visual dashboards for risk, progress, matches
- Delightful user experience

---

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
