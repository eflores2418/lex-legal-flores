#!/bin/bash

echo "🔍 Testing Render Backend Deployment..."
echo ""

echo "1️⃣ Testing Health Endpoint:"
HEALTH=$(curl -s https://lex-legal-flores.onrender.com/api/health)
echo "$HEALTH"
echo ""

echo "2️⃣ Testing Upcoming Appointments Endpoint (THE FIX):"
UPCOMING=$(curl -s https://lex-legal-flores.onrender.com/api/appointments/upcoming)
echo "$UPCOMING"
echo ""

if echo "$UPCOMING" | grep -q "invalid input syntax"; then
    echo "❌ ERROR: Backend still has the old code!"
    echo "   The route order fix is NOT deployed yet."
    echo "   Wait for Render deployment to complete."
elif echo "$UPCOMING" | grep -q "appointments"; then
    echo "✅ SUCCESS: Backend has the new code!"
    echo "   The route order fix is working!"
    echo ""
    echo "Now refresh your Vercel app:"
    echo "https://lex-legal-flores.vercel.app"
    echo ""
    echo "Press Ctrl+Shift+R to clear cache and reload."
else
    echo "⚠️  UNKNOWN RESPONSE"
    echo "   Check the output above."
fi

echo ""
echo "3️⃣ Testing Stats Endpoint:"
STATS=$(curl -s https://lex-legal-flores.onrender.com/api/stats)
echo "$STATS"

# Made with Bob
