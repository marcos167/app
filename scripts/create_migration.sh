#!/bin/bash
# Script to create Prisma migration for production indexes

echo "Creating Prisma migration for performance indexes..."

# Generate migration
npx prisma migrate dev --name add_performance_indexes

echo "Migration created successfully!"
echo ""
echo "Next steps:"
echo "1. Review the migration file in prisma/migrations/"
echo "2. Test locally: npx prisma migrate deploy"
echo "3. In production: npx prisma migrate deploy"
