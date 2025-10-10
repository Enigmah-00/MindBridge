#!/bin/bash

# Setup Cloud Database Script
# Run this after setting up your cloud database

echo "🚀 MindBridge Cloud Database Setup"
echo "===================================="
echo ""

# Check if DATABASE_URL is provided
if [ -z "$DATABASE_URL" ]; then
  echo "❌ Error: DATABASE_URL not provided"
  echo ""
  echo "Usage: DATABASE_URL='your-cloud-db-url' ./setup-cloud-database.sh"
  echo ""
  echo "Example:"
  echo "DATABASE_URL='postgresql://user:pass@host:5432/db' ./setup-cloud-database.sh"
  exit 1
fi

echo "✅ Database URL provided"
echo ""

# Run Prisma migrations
echo "📦 Running database migrations..."
npx prisma migrate deploy

if [ $? -ne 0 ]; then
  echo "❌ Migration failed!"
  exit 1
fi

echo "✅ Migrations completed successfully!"
echo ""

# Generate Prisma Client
echo "🔧 Generating Prisma Client..."
npx prisma generate

if [ $? -ne 0 ]; then
  echo "❌ Prisma generate failed!"
  exit 1
fi

echo "✅ Prisma Client generated!"
echo ""

# Optional: Seed the database
read -p "Do you want to seed the database with sample data? (y/n) " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
  echo "🌱 Seeding database..."
  npx prisma db seed
  
  if [ $? -ne 0 ]; then
    echo "⚠️  Seeding failed (this is optional)"
  else
    echo "✅ Database seeded successfully!"
  fi
fi

echo ""
echo "🎉 Database setup complete!"
echo ""
echo "Next steps:"
echo "1. Make sure environment variables are set in Vercel"
echo "2. Redeploy your application"
echo "3. Test the auth endpoints"
