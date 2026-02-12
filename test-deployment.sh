#!/bin/bash
# Script to test if Hugging Face Space has been updated with bcrypt 4.0.1

echo "Testing Hugging Face Space Backend..."
echo "======================================"
echo ""

# Test 1: Health Check
echo "1. Health Check:"
curl -s https://radiya345-todo-app.hf.space/health | python -m json.tool
echo ""
echo ""

# Test 2: Signup (this will show if bcrypt is fixed)
echo "2. Testing Signup (checking for bcrypt error):"
SIGNUP_RESPONSE=$(curl -s -X POST https://radiya345-todo-app.hf.space/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"bcrypttest@example.com","password":"test12345","name":"Bcrypt Test"}')

echo "$SIGNUP_RESPONSE" | python -m json.tool
echo ""

if echo "$SIGNUP_RESPONSE" | grep -q "password cannot be longer than 72 bytes"; then
    echo "❌ BCRYPT STILL NOT UPDATED - Space needs manual update"
    echo ""
    echo "Action Required:"
    echo "1. Go to: https://huggingface.co/spaces/radiya345/todo-app"
    echo "2. Click 'Files' → 'backend' → 'requirements.txt'"
    echo "3. Click 'Edit' button"
    echo "4. Change line 11: bcrypt==3.2.0 → bcrypt==4.0.1"
    echo "5. Click 'Commit changes to main'"
    echo "6. Wait 2-5 minutes for rebuild"
elif echo "$SIGNUP_RESPONSE" | grep -q "Email already registered"; then
    echo "✅ BCRYPT IS FIXED! (User already exists)"
    echo "Backend is working correctly now."
elif echo "$SIGNUP_RESPONSE" | grep -q "id"; then
    echo "✅ BCRYPT IS FIXED! (New user created successfully)"
    echo "Backend is working correctly now."
else
    echo "⚠️  Unexpected response - check manually"
fi

echo ""
echo "======================================"
