#!/bin/bash

# Vercel Database Seeding Script
# Run this after your first Vercel deployment

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}==================================${NC}"
echo -e "${BLUE}MindBridge Database Seeding${NC}"
echo -e "${BLUE}==================================${NC}"
echo ""

# Check if URL is provided
if [ -z "$1" ]; then
    echo -e "${RED}Error: Please provide your Vercel URL${NC}"
    echo ""
    echo "Usage: ./seed-vercel.sh https://your-app.vercel.app"
    echo ""
    echo "Example:"
    echo "  ./seed-vercel.sh https://mind-bridge.vercel.app"
    exit 1
fi

VERCEL_URL=$1

# Remove trailing slash if present
VERCEL_URL=${VERCEL_URL%/}

echo -e "${BLUE}Checking current seed status...${NC}"
STATUS=$(curl -s "${VERCEL_URL}/api/seed")
echo "$STATUS" | jq '.' 2>/dev/null || echo "$STATUS"
echo ""

echo -e "${BLUE}Seeding database at: ${VERCEL_URL}${NC}"
echo ""

# Send POST request to seed endpoint
RESPONSE=$(curl -X POST -s "${VERCEL_URL}/api/seed")

# Check if jq is available for pretty printing
if command -v jq &> /dev/null; then
    echo "$RESPONSE" | jq '.'
else
    echo "$RESPONSE"
fi

echo ""

# Check if successful
if echo "$RESPONSE" | grep -q '"success":true\|"seeded":true\|"message":"Database already seeded"'; then
    echo -e "${GREEN}✅ Database seeded successfully!${NC}"
    echo ""
    echo "You can now:"
    echo "  • Login as a doctor (username: dr_zaman, password: doctor123)"
    echo "  • Take mental health assessments"
    echo "  • Book appointments"
    echo "  • Use all features of MindBridge"
else
    echo -e "${RED}❌ Seeding may have failed. Check the response above.${NC}"
    echo ""
    echo "Troubleshooting:"
    echo "  1. Check Vercel deployment logs"
    echo "  2. Verify database environment variables"
    echo "  3. Ensure migrations ran during build"
fi

echo ""
echo -e "${BLUE}==================================${NC}"
