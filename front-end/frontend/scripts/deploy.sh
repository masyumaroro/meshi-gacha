#!/bin/bash
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ENV_FILE="$SCRIPT_DIR/../.env.deploy"

if [ -f "$ENV_FILE" ]; then
  export $(grep -v '^#' "$ENV_FILE" | xargs)
fi

if [ -z "$S3_BUCKET" ] || [ -z "$CF_DISTRIBUTION_ID" ]; then
  echo "Error: .env.deploy が見つからないか、S3_BUCKET / CF_DISTRIBUTION_ID が未設定です。"
  echo ""
  echo "front-end/frontend/.env.deploy を作成してください："
  echo "  S3_BUCKET=meshi-gacha-frontend"
  echo "  CF_DISTRIBUTION_ID=your-distribution-id"
  exit 1
fi

echo "▶ Build..."
npm run build

echo "▶ S3 sync → s3://$S3_BUCKET"
aws s3 sync dist/ "s3://$S3_BUCKET" --delete

echo "▶ CloudFront invalidation ($CF_DISTRIBUTION_ID)..."
aws cloudfront create-invalidation --distribution-id "$CF_DISTRIBUTION_ID" --paths "/*"

echo "✓ Deploy complete!"
