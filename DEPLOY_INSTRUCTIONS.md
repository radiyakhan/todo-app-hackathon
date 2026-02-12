# How to Fix Deployed Backend on Hugging Face

## Problem
The deployed backend has bcrypt 3.2.0 which causes all authentication to fail with 500 errors.

## Solution Steps

### 1. Update Hugging Face Space

**Option A: Via Git (Recommended)**
```bash
# Make sure you've committed the updated requirements.txt
git add backend/requirements.txt
git commit -m "Update bcrypt to 4.0.1 for compatibility"
git push origin main

# Then sync your Hugging Face Space with GitHub
# Go to: https://huggingface.co/spaces/radiya345/todo-app/settings
# Click "Sync with GitHub" or "Pull from GitHub"
```

**Option B: Manual Upload**
1. Go to https://huggingface.co/spaces/radiya345/todo-app
2. Click "Files" tab
3. Navigate to `backend/requirements.txt`
4. Click "Edit" button
5. Change line 11 from:
   ```
   bcrypt==3.2.0  # Pin to 3.2.0 for compatibility with passlib 1.7.4
   ```
   to:
   ```
   bcrypt==4.0.1  # Updated for better compatibility
   ```
6. Click "Commit changes to main"
7. Wait for the Space to rebuild (check the "Logs" tab)

### 2. Verify Environment Variables

Make sure these are set in your Hugging Face Space settings:
- `DATABASE_URL` - Your Neon PostgreSQL connection string
- `BETTER_AUTH_SECRET` - Your JWT secret (same as in backend/.env)
- `ENVIRONMENT` - Set to "production"

### 3. Test After Deployment

Once the Space rebuilds, test:
```bash
# Test health endpoint
curl https://radiya345-todo-app.hf.space/health

# Test signup (should work now)
curl -X POST https://radiya345-todo-app.hf.space/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"testpass123","name":"Test User"}'

# Test signin (should work now)
curl -X POST https://radiya345-todo-app.hf.space/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"testpass123"}'
```

## Temporary Workaround (If You Can't Update Immediately)

Use local backend for testing:

1. Edit `frontend/.env.local`:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```

2. Restart frontend:
   ```bash
   # Stop current frontend (Ctrl+C)
   cd frontend
   npm run dev
   ```

3. Make sure backend is running:
   ```bash
   cd backend
   python -m uvicorn src.main:app --reload --port 8000
   ```

## Expected Timeline

- Manual file edit: ~2-5 minutes for Space to rebuild
- Git sync: ~2-5 minutes after pushing to GitHub
- You can monitor progress in the "Logs" tab of your Space
