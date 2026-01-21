#!/bin/bash

# Script để test webhook từ ngân hàng
# Usage: ./scripts/test-webhook.sh "Nap tien vao vi 1768815930428" 50000

DESCRIPTION=${1:-"Nap tien vao vi $(date +%s)"}
AMOUNT=${2:-50000}
SECRET=${BANK_WEBHOOK_SECRET:-"test-secret-key-change-in-production"}
BASE_URL=${BASE_URL:-"http://localhost:3000"}

echo "🧪 Testing webhook..."
echo "Description: $DESCRIPTION"
echo "Amount: $AMOUNT"
echo "Secret: $SECRET"
echo ""

# Create payload
PAYLOAD=$(cat <<EOF
{
  "description": "$DESCRIPTION",
  "amount": $AMOUNT,
  "transactionId": "TXN-$(date +%s)",
  "accountNumber": "1105200789",
  "timestamp": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "status": "success"
}
EOF
)

# Generate signature using Node.js
SIGNATURE=$(node -e "
const crypto = require('crypto');
const payload = '$PAYLOAD';
const secret = '$SECRET';
const hmac = crypto.createHmac('sha256', secret);
hmac.update(payload);
console.log('sha256=' + hmac.digest('hex'));
")

echo "📝 Payload:"
echo "$PAYLOAD" | jq .
echo ""
echo "🔐 Signature: $SIGNATURE"
echo ""

# Send webhook
echo "📤 Sending webhook..."
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/api/webhooks/bank-payment" \
  -H "Content-Type: application/json" \
  -H "x-signature: $SIGNATURE" \
  -d "$PAYLOAD")

HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | sed '$d')

echo "📥 Response (HTTP $HTTP_CODE):"
echo "$BODY" | jq . 2>/dev/null || echo "$BODY"
echo ""

if [ "$HTTP_CODE" = "200" ]; then
  echo "✅ Webhook test successful!"
else
  echo "❌ Webhook test failed!"
  exit 1
fi
