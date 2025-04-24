#!/bin/sh
set -e

echo "Waiting for database to be ready..."
while ! nc -z db 5432; do
  sleep 1
done
echo "Database is ready!"

echo "Dropping and recreating database..."
npx sequelize-cli db:drop
npx sequelize-cli db:create

echo "Running migrations..."
npx sequelize-cli db:migrate

echo "Running seeders..."
npx sequelize-cli db:seed:all

echo "Starting the application..."
exec npm run dev 