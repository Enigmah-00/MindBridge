# 🧠 MindBridge

A modern mental health platform with AI-powered risk assessment, doctor matching, secure messaging, and more. Built with Next.js, Prisma, PostgreSQL, and integrated ML features.

---

## 🚀 Features
- **AI Risk Assessment**: Real-time mental health risk prediction using quiz scores and lifestyle factors
- **Doctor Matching**: ML-powered recommendations based on specialty, location, and ratings
- **Secure Messaging**: HIPAA-style chat between patients and doctors
- **Quizzes & Assessments**: GAD-7, PHQ-9, PSS-10, and more
- **Admin Dashboard**: Manage doctors, users, and content
- **Beautiful UI**: Responsive, modern design

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

## 🐳 Docker
See [`DOCKER_SETUP_GUIDE.md`](./DOCKER_SETUP_GUIDE.md) for local Docker setup.

---

## 🔐 Troubleshooting
- Login issues on Vercel? See [`VERCEL_LOGIN_FIX.md`](./VERCEL_LOGIN_FIX.md)
- Empty quizzes/assessments? See [`SEED_VERCEL_NOW.md`](./SEED_VERCEL_NOW.md)
- Google API restriction? Review your usage and appeal if needed.

---

## 🤝 Contributing
Pull requests welcome! Please open issues for bugs or feature requests.

---

## 📄 License
MIT
