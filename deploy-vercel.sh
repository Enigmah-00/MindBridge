#!/bin/bash

# 🚀 MindBridge Vercel Deployment Script
# This script helps you deploy MindBridge to Vercel in minutes

set -e  # Exit on error

echo "================================"
echo "🚀 MindBridge Deployment Helper"
echo "================================"
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if Git repo
if [ ! -d .git ]; then
    echo -e "${RED}❌ Not a Git repository!${NC}"
    echo "Initialize Git first:"
    echo "  git init"
    echo "  git add ."
    echo "  git commit -m 'Initial commit'"
    exit 1
fi

# Check if committed
if [ -n "$(git status --porcelain)" ]; then
    echo -e "${YELLOW}⚠️  You have uncommitted changes!${NC}"
    echo "Commit your changes first:"
    echo "  git add ."
    echo "  git commit -m 'Your message'"
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo -e "${BLUE}📦 Vercel CLI not found. Installing...${NC}"
    npm install -g vercel
    echo -e "${GREEN}✅ Vercel CLI installed!${NC}"
    echo ""
fi

# Build locally first
echo -e "${BLUE}🔨 Testing build locally...${NC}"
npm run build
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Build successful!${NC}"
else
    echo -e "${RED}❌ Build failed! Fix errors before deploying.${NC}"
    exit 1
fi
echo ""

# Check for required environment variables
echo -e "${BLUE}🔍 Checking environment variables...${NC}"
if [ ! -f .env.local ]; then
    echo -e "${YELLOW}⚠️  .env.local not found${NC}"
    echo "Create .env.local with:"
    echo "  DATABASE_URL="
    echo "  NEXTAUTH_SECRET="
    echo "  NEXTAUTH_URL="
    echo "  OPENAI_API_KEY="
fi
echo ""

# Login to Vercel
echo -e "${BLUE}🔐 Logging in to Vercel...${NC}"
vercel login
echo ""

# Deploy
echo -e "${BLUE}🚀 Deploying to Vercel...${NC}"
echo "Choose deployment type:"
echo "  1. Preview (test before production)"
echo "  2. Production (live deployment)"
read -p "Enter choice (1 or 2): " choice

if [ "$choice" = "2" ]; then
    vercel --prod
else
    vercel
fi

echo ""
echo -e "${GREEN}================================${NC}"
echo -e "${GREEN}✅ Deployment Complete!${NC}"
echo -e "${GREEN}================================${NC}"
echo ""
echo -e "${YELLOW}📝 Next Steps:${NC}"
echo "1. Set up environment variables in Vercel dashboard"
echo "2. Create/connect database (Vercel Postgres or Neon)"
echo "3. Run database migrations:"
echo "   ${BLUE}npx prisma migrate deploy${NC}"
echo "4. (Optional) Seed database:"
echo "   ${BLUE}npx prisma db seed${NC}"
echo ""
echo -e "${GREEN}🎉 Your app is live!${NC}"
echo ""
