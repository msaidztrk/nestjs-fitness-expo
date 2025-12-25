#!/bin/sh
set -e

# Run migrations
echo "Running migrations..."
npm run migration:run

# Start application
echo "Starting application..."
exec "$@"
