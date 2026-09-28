#!/usr/bin/env bash
# ==============================================================================
# ForeverJewellStudio - Hostinger VPS 1-Click Zero-Downtime Deployment Script
# ==============================================================================
set -e

echo "🚀 [1/5] Starting production deployment..."

# Ensure we are in the application root directory
cd "$(dirname "$0")"

# Create logs directory if missing
mkdir -p logs

echo "📦 [2/5] Installing production dependencies..."
npm ci --legacy-peer-deps

echo "💎 [3/5] Generating Prisma client & running database migrations..."
npx prisma generate
npx prisma db push --skip-generate

echo "⚡ [4/5] Building optimized Next.js production bundle..."
npm run build

echo "🔄 [5/5] Reloading PM2 cluster with zero downtime..."
if pm2 list | grep -q "forever-jewell-studio"; then
  pm2 reload ecosystem.config.js --env production --update-env
else
  pm2 start ecosystem.config.js --env production
fi

pm2 save

echo "=============================================================================="
echo "🎉 SUCCESS: ForeverJewellStudio is LIVE on Hostinger with 0 downtime!"
echo "=============================================================================="
