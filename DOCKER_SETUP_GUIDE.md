# 🐳 Run MindBridge with Docker Locally

## 📋 Prerequisites

1. **Install Docker Desktop** (if not already installed)
   - Download from: https://www.docker.com/products/docker-desktop
   - For macOS: Download and install the `.dmg` file
   - After installation, open Docker Desktop app

## 🚀 Quick Start (3 Steps)

### Step 1: Start Docker Desktop
1. Open **Docker Desktop** app on your Mac
2. Wait until you see "Docker Desktop is running" in the menu bar (whale icon)
3. You should see a green indicator that says "Engine running"

### Step 2: Start PostgreSQL Database
```bash
# Navigate to your project
cd /Users/mahadi/Desktop/MindBridge

# Start the PostgreSQL container
docker-compose up -d
```

**Expected Output:**
```
Creating network "mindbridge_default" with the default driver
Creating volume "mindbridge_pgdata" with default driver
Creating mindbridge_db_1 ... done
```

### Step 3: Run Database Migrations & Seed
```bash
# Run migrations to create tables
npx prisma migrate dev

# Seed the database with data
npm run seed:dev
```

### Step 4: Start the Next.js App
```bash
npm run dev
```

Your app is now running at: **http://localhost:3000** 🎉

---

## 🔍 Verify Everything is Working

### Check Docker Container Status
```bash
docker ps
```

You should see:
```
CONTAINER ID   IMAGE         STATUS         PORTS                    NAMES
xxxxx          postgres:16   Up 2 minutes   0.0.0.0:5432->5432/tcp  mindbridge_db_1
```

### Check Database Connection
```bash
npx prisma studio
```
This opens Prisma Studio at **http://localhost:5555** to view your database.

---

## 🛠️ Common Docker Commands

### Start Database (if stopped)
```bash
docker-compose up -d
```

### Stop Database (keeps data)
```bash
docker-compose stop
```

### Stop and Remove Database (deletes data)
```bash
docker-compose down
```

### View Database Logs
```bash
docker-compose logs -f db
```

### Restart Database
```bash
docker-compose restart
```

### Check Docker Status
```bash
docker ps -a
```

---

## 📝 Your Local Environment Setup

### 1. Check your `.env` file
Make sure you have:
```env
mb_PRISMA_DATABASE_URL="postgresql://mindbridge:mindbridge@localhost:5432/mindbridge?schema=public&connection_limit=5"
mb_POSTGRES_URL="postgresql://mindbridge:mindbridge@localhost:5432/mindbridge?schema=public"
JWT_SECRET="enigmah"
GEMINI_API_KEY="AIzaSyAgoRnn8YZHSRv29fdtfegr7u9b1lWDg4g"
```

### 2. Complete Setup Commands
```bash
# 1. Start Docker
docker-compose up -d

# 2. Generate Prisma Client
npx prisma generate

# 3. Run migrations
npx prisma migrate dev

# 4. Seed database
npm run seed:dev

# 5. Start app
npm run dev
```

---

## 🐛 Troubleshooting

### Problem: "Cannot connect to Docker daemon"
**Solution:**
1. Open Docker Desktop app
2. Wait for it to fully start (green indicator)
3. Try again

### Problem: Port 5432 already in use
**Solution:**
```bash
# Find process using port 5432
lsof -ti:5432

# Kill that process
lsof -ti:5432 | xargs kill -9

# Or use a different port in docker-compose.yml
# Change "5432:5432" to "5433:5432"
```

### Problem: "Database does not exist"
**Solution:**
```bash
# Recreate the database
docker-compose down -v
docker-compose up -d
npx prisma migrate dev
npm run seed:dev
```

### Problem: "Connection refused"
**Solution:**
```bash
# Check if container is running
docker ps

# Check container logs
docker-compose logs db

# Restart Docker Desktop and try again
```

---

## 🔄 Full Reset (Clean Slate)

If you want to start fresh:

```bash
# 1. Stop and remove everything
docker-compose down -v

# 2. Start fresh
docker-compose up -d

# 3. Setup database
npx prisma migrate dev
npm run seed:dev

# 4. Start app
npm run dev
```

---

## ✅ Verification Checklist

- [ ] Docker Desktop is installed and running (green icon)
- [ ] `docker-compose up -d` runs without errors
- [ ] `docker ps` shows postgres:16 container running
- [ ] `.env` file has correct localhost database URLs
- [ ] `npx prisma migrate dev` completes successfully
- [ ] `npm run seed:dev` adds 8 doctors and 8 quizzes
- [ ] `npm run dev` starts the app on port 3000
- [ ] Can access http://localhost:3000

---

## 🎯 Daily Workflow

### Start Working:
```bash
docker-compose up -d    # Start database
npm run dev             # Start app
```

### Stop Working:
```bash
# Press Ctrl+C to stop npm
docker-compose stop     # Stop database (keeps data)
```

### View Database:
```bash
npx prisma studio       # Opens at localhost:5555
```

---

## 📊 Docker Compose Configuration

Your `docker-compose.yml`:
```yaml
version: "3.9"
services:
  db:
    image: postgres:16              # PostgreSQL version 16
    environment:
      POSTGRES_USER: mindbridge     # Database user
      POSTGRES_PASSWORD: mindbridge # Database password
      POSTGRES_DB: mindbridge       # Database name
    ports:
      - "5432:5432"                 # Expose port 5432
    volumes:
      - pgdata:/var/lib/postgresql/data  # Persist data
volumes:
  pgdata:                           # Named volume for data
```

---

## 🚀 Quick Reference

| Command | What it does |
|---------|--------------|
| `docker-compose up -d` | Start database in background |
| `docker-compose stop` | Stop database |
| `docker-compose down` | Stop and remove containers |
| `docker-compose down -v` | Stop, remove containers AND delete data |
| `docker-compose logs -f db` | View live database logs |
| `docker ps` | Show running containers |
| `npx prisma studio` | Open database GUI |

---

**Your database data is preserved between restarts!** 🎉

The data is stored in a Docker volume named `mindbridge_pgdata` that persists even when you stop the container.
