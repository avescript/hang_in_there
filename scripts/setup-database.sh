#!/bin/bash

# Database Setup Script for Hang In There
# This script creates the PostgreSQL database and runs migrations

set -e

echo "🐘 Setting up PostgreSQL database for Hang In There..."

# Load environment variables
if [ -f .env ]; then
  export $(cat .env | grep -v '^#' | xargs)
else
  echo "❌ Error: .env file not found. Please copy .env.example to .env and configure it."
  exit 1
fi

# Check if PostgreSQL is running
if ! command -v psql &> /dev/null; then
  echo "❌ Error: PostgreSQL client (psql) not found. Please install PostgreSQL."
  exit 1
fi

# Create database if it doesn't exist
echo "📦 Creating database '$POSTGRES_DB' if it doesn't exist..."
PGPASSWORD=$POSTGRES_PASSWORD psql -h $POSTGRES_HOST -p $POSTGRES_PORT -U $POSTGRES_USER -tc "SELECT 1 FROM pg_database WHERE datname = '$POSTGRES_DB'" | grep -q 1 || \
PGPASSWORD=$POSTGRES_PASSWORD psql -h $POSTGRES_HOST -p $POSTGRES_PORT -U $POSTGRES_USER -c "CREATE DATABASE $POSTGRES_DB"

echo "✅ Database '$POSTGRES_DB' is ready"

# Run migrations
echo "🚀 Running database migrations..."
npm run migrate:up

echo "✅ Database setup complete!"
echo ""
echo "📊 Database connection info:"
echo "   Host: $POSTGRES_HOST"
echo "   Port: $POSTGRES_PORT"
echo "   Database: $POSTGRES_DB"
echo "   User: $POSTGRES_USER"
echo ""
echo "🎉 You're all set! Run 'npm run dev' to start the application."
