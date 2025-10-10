#!/bin/bash

# Test Vercel Deployment Script
# This script helps you test your Vercel deployment endpoints

echo "🧪 Testing Vercel Deployment"
echo "=============================="
echo ""

# Prompt for Vercel URL
read -p "Enter your Vercel URL (without https://): " VERCEL_URL

if [ -z "$VERCEL_URL" ]; then
  echo "❌ No URL provided"
  exit 1
fi

BASE_URL="https://$VERCEL_URL"

echo ""
echo "Testing: $BASE_URL"
echo ""

# Test 1: Homepage
echo "1️⃣  Testing Homepage..."
HOMEPAGE_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL")
if [ "$HOMEPAGE_STATUS" = "200" ]; then
  echo "   ✅ Homepage works (Status: $HOMEPAGE_STATUS)"
else
  echo "   ❌ Homepage failed (Status: $HOMEPAGE_STATUS)"
fi
echo ""

# Test 2: Signup
echo "2️⃣  Testing Signup..."
SIGNUP_RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" -X POST "$BASE_URL/api/auth/signup" \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser'$(date +%s)'","password":"testpass123"}')

SIGNUP_BODY=$(echo "$SIGNUP_RESPONSE" | sed -e 's/HTTP_STATUS\:.*//g')
SIGNUP_STATUS=$(echo "$SIGNUP_RESPONSE" | tr -d '\n' | sed -e 's/.*HTTP_STATUS://')

echo "   Status: $SIGNUP_STATUS"
echo "   Response: $SIGNUP_BODY"

if [ "$SIGNUP_STATUS" = "200" ] || [ "$SIGNUP_STATUS" = "201" ]; then
  echo "   ✅ Signup works!"
  
  # Extract username from the request
  TEST_USERNAME="testuser$(date +%s)"
  
  # Test 3: Login with the account we just created
  echo ""
  echo "3️⃣  Testing Login..."
  LOGIN_RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" -X POST "$BASE_URL/api/auth/login" \
    -H "Content-Type: application/json" \
    -d "{\"usernameOrEmail\":\"$TEST_USERNAME\",\"password\":\"testpass123\"}")
  
  LOGIN_BODY=$(echo "$LOGIN_RESPONSE" | sed -e 's/HTTP_STATUS\:.*//g')
  LOGIN_STATUS=$(echo "$LOGIN_RESPONSE" | tr -d '\n' | sed -e 's/.*HTTP_STATUS://')
  
  echo "   Status: $LOGIN_STATUS"
  echo "   Response: $LOGIN_BODY"
  
  if [ "$LOGIN_STATUS" = "200" ]; then
    echo "   ✅ Login works!"
  else
    echo "   ❌ Login failed"
  fi
  
elif [ "$SIGNUP_STATUS" = "409" ]; then
  echo "   ⚠️  User already exists (this is OK)"
  
  # Test with a different username
  echo ""
  echo "   Trying with random username..."
  RANDOM_USER="user$(openssl rand -hex 4)"
  
  SIGNUP_RESPONSE2=$(curl -s -w "\nHTTP_STATUS:%{http_code}" -X POST "$BASE_URL/api/auth/signup" \
    -H "Content-Type: application/json" \
    -d "{\"username\":\"$RANDOM_USER\",\"password\":\"testpass123\"}")
  
  SIGNUP_BODY2=$(echo "$SIGNUP_RESPONSE2" | sed -e 's/HTTP_STATUS\:.*//g')
  SIGNUP_STATUS2=$(echo "$SIGNUP_RESPONSE2" | tr -d '\n' | sed -e 's/.*HTTP_STATUS://')
  
  echo "   Status: $SIGNUP_STATUS2"
  echo "   Response: $SIGNUP_BODY2"
  
  if [ "$SIGNUP_STATUS2" = "200" ] || [ "$SIGNUP_STATUS2" = "201" ]; then
    echo "   ✅ Signup works with random username!"
  else
    echo "   ❌ Signup still failed"
  fi
else
  echo "   ❌ Signup failed with status $SIGNUP_STATUS"
  echo ""
  echo "🔍 Common issues:"
  echo "   - Check Vercel Function Logs"
  echo "   - Verify DATABASE_URL is set"
  echo "   - Verify JWT_SECRET is set"
  echo "   - Check if database tables exist"
fi

echo ""

# Test 4: Doctors List
echo "4️⃣  Testing Doctors List..."
DOCTORS_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/api/doctors/list")
echo "   Status: $DOCTORS_STATUS"
if [ "$DOCTORS_STATUS" = "200" ]; then
  echo "   ✅ Doctors list works"
else
  echo "   ❌ Doctors list failed"
fi

echo ""
echo "=============================="
echo "🏁 Testing Complete"
echo ""
echo "Next steps if tests failed:"
echo "1. Check Vercel Dashboard → Deployments → Function Logs"
echo "2. Verify environment variables are set"
echo "3. Check database has tables (Storage → Data)"
echo "4. Redeploy with cache cleared"
