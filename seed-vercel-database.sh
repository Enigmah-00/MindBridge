#!/bin/bash

# Seed Vercel Database with All 8 Assessments
# This script will populate your Vercel database with doctors and quizzes

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🌱 SEEDING VERCEL DATABASE"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check if URL is provided
if [ -z "$1" ]; then
    echo "❌ Error: Please provide your Vercel URL"
    echo ""
    echo "Usage:"
    echo "  ./seed-vercel-database.sh https://your-app.vercel.app"
    echo ""
    echo "Example:"
    echo "  ./seed-vercel-database.sh https://mind-bridge-xyz.vercel.app"
    exit 1
fi

VERCEL_URL=$1
# Remove trailing slash
VERCEL_URL=${VERCEL_URL%/}

echo "🎯 Target: $VERCEL_URL"
echo ""

# Check if the URL is reachable
echo "📡 Checking if server is reachable..."
if curl -f -s -o /dev/null "$VERCEL_URL"; then
    echo "✅ Server is reachable"
else
    echo "❌ Cannot reach server. Please check your URL."
    exit 1
fi

echo ""
echo "🌱 Starting database seed..."
echo ""

# Send POST request to seed endpoint
RESPONSE=$(curl -X POST -s "$VERCEL_URL/api/seed" -H "Content-Type: application/json")

# Check if jq is available for pretty printing
if command -v jq &> /dev/null; then
    echo "📊 Response:"
    echo "$RESPONSE" | jq '.'
else
    echo "📊 Response:"
    echo "$RESPONSE"
fi

echo ""

# Check if successful
if echo "$RESPONSE" | grep -q '"success":true\|"seeded":true\|"Database already seeded"'; then
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "✅ DATABASE SEEDED SUCCESSFULLY!"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "Your database now has:"
    echo "  ✓ 5 Doctors (Dhaka, Chittagong, Sylhet)"
    echo "  ✓ 8 Mental Health Assessments:"
    echo "    • GAD-7 (Anxiety) - 7 questions"
    echo "    • PHQ-9 (Depression) - 9 questions"
    echo "    • PSS-10 (Stress) - 10 questions"
    echo "    • SPIN (Social Anxiety) - 17 questions"
    echo "    • PDSS (Panic Disorder) - 7 questions"
    echo "    • ASRS (ADHD) - 6 questions"
    echo "    • OCI-R (OCD) - 18 questions"
    echo "    • PCL-5 (PTSD) - 20 questions"
    echo ""
    echo "🎉 You can now:"
    echo "  • Visit $VERCEL_URL"
    echo "  • Create a user account"
    echo "  • Take all 8 assessments"
    echo "  • Book appointments with doctors"
    echo "  • Use the AI chatbot"
    echo ""
else
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "⚠️  SEEDING MAY HAVE FAILED"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "Possible issues:"
    echo "  1. Environment variables not set in Vercel"
    echo "  2. Database connection issue"
    echo "  3. Migrations not run"
    echo ""
    echo "📋 Check Vercel logs:"
    echo "  vercel logs --follow"
    echo ""
    echo "📋 Or visit Vercel dashboard:"
    echo "  https://vercel.com/dashboard"
fi

echo ""
