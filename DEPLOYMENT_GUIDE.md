# Deployment Guide - Phase II Todo Application

This guide walks you through deploying your Todo application to production.

---

## 🎯 Deployment Strategy

**Frontend**: Vercel (Recommended - Free tier, automatic deployments)
**Backend**: Vercel Serverless Functions or Railway (Both have free tiers)
**Database**: Neon PostgreSQL (Already configured)

---

## 📦 Pre-Deployment Checklist

### 1. Generate Production Secret

```bash
# Generate a secure 32-character secret for production
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Save this value - you'll need it for both frontend and backend environment variables.

### 2. Verify Environment Files

#### Frontend `.env.local` (for local testing)
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

#### Backend `.env` (for local testing)
```env
DATABASE_URL=postgresql+psycopg://neondb_owner:npg_dmktPA8szK9e@ep-little-frost-ai31irss-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require
BETTER_AUTH_SECRET=dev-secret-key-change-in-production-32chars
ENVIRONMENT=development
LOG_LEVEL=info
```

---

## 🚀 Option 1: Deploy to Vercel (Recommended)

### Step 1: Deploy Backend to Vercel

1. **Install Vercel CLI** (if not already installed)
```bash
npm install -g vercel
```

2. **Create `vercel.json` in backend directory**

```bash
cd backend
```

Create `backend/vercel.json`:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "src/main.py",
      "use": "@vercel/python"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "src/main.py"
    }
  ],
  "env": {
    "ENVIRONMENT": "production"
  }
}
```

3. **Create `backend/requirements.txt` (verify it exists)**

4. **Deploy Backend**
```bash
cd backend
vercel --prod
```

5. **Set Environment Variables in Vercel Dashboard**
   - Go to https://vercel.com/dashboard
   - Select your backend project
   - Go to Settings → Environment Variables
   - Add:
     - `DATABASE_URL`: Your Neon PostgreSQL connection string
     - `BETTER_AUTH_SECRET`: Your production secret (from step 1)
     - `ENVIRONMENT`: `production`
     - `LOG_LEVEL`: `info`

6. **Redeploy after setting environment variables**
```bash
vercel --prod
```

7. **Note your backend URL** (e.g., `https://your-backend.vercel.app`)

### Step 2: Deploy Frontend to Vercel

1. **Update Frontend Environment Variables**

Create `frontend/.env.production`:
```env
NEXT_PUBLIC_API_URL=https://your-backend.vercel.app
NEXT_PUBLIC_APP_URL=https://your-frontend.vercel.app
```

2. **Deploy Frontend**
```bash
cd frontend
vercel --prod
```

3. **Set Environment Variables in Vercel Dashboard**
   - Go to https://vercel.com/dashboard
   - Select your frontend project
   - Go to Settings → Environment Variables
   - Add:
     - `NEXT_PUBLIC_API_URL`: Your backend URL from Step 1
     - `NEXT_PUBLIC_APP_URL`: Your frontend URL (will be provided by Vercel)

4. **Update CORS in Backend**

After deployment, update your backend CORS settings to allow your frontend domain:

Edit `backend/src/main.py`:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://your-frontend.vercel.app",  # Production frontend
        "http://localhost:3000"  # Local development
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

5. **Redeploy Backend**
```bash
cd backend
vercel --prod
```

---

## 🚀 Option 2: Deploy Backend to Railway

### Step 1: Deploy Backend to Railway

1. **Install Railway CLI**
```bash
npm install -g @railway/cli
```

2. **Login to Railway**
```bash
railway login
```

3. **Initialize Railway Project**
```bash
cd backend
railway init
```

4. **Create `railway.json` in backend directory**
```json
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "uvicorn src.main:app --host 0.0.0.0 --port $PORT",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

5. **Set Environment Variables**
```bash
railway variables set DATABASE_URL="your-neon-connection-string"
railway variables set BETTER_AUTH_SECRET="your-production-secret"
railway variables set ENVIRONMENT="production"
railway variables set LOG_LEVEL="info"
```

6. **Deploy**
```bash
railway up
```

7. **Get your Railway URL**
```bash
railway domain
```

### Step 2: Deploy Frontend to Vercel

Follow the same steps as Option 1, Step 2, but use your Railway backend URL.

---

## 🚀 Option 3: Deploy Backend to Render

### Step 1: Deploy Backend to Render

1. **Create `render.yaml` in backend directory**
```yaml
services:
  - type: web
    name: todo-backend
    env: python
    buildCommand: pip install -r requirements.txt
    startCommand: uvicorn src.main:app --host 0.0.0.0 --port $PORT
    envVars:
      - key: DATABASE_URL
        sync: false
      - key: BETTER_AUTH_SECRET
        sync: false
      - key: ENVIRONMENT
        value: production
      - key: LOG_LEVEL
        value: info
```

2. **Push to GitHub**
```bash
git add .
git commit -m "Add Render configuration"
git push origin main
```

3. **Deploy on Render**
   - Go to https://render.com
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the backend directory
   - Set environment variables in Render dashboard
   - Click "Create Web Service"

4. **Note your Render URL** (e.g., `https://your-backend.onrender.com`)

### Step 2: Deploy Frontend to Vercel

Follow the same steps as Option 1, Step 2, but use your Render backend URL.

---

## 🧪 Post-Deployment Testing

### 1. Test Backend Health
```bash
curl https://your-backend-url.com/health
```

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2026-02-10T16:30:00Z",
  "version": "2.1"
}
```

### 2. Test API Documentation
Visit: `https://your-backend-url.com/docs`

### 3. Test Frontend
1. Visit your frontend URL
2. Sign up for a new account
3. Sign in
4. Create a task
5. Update a task
6. Mark task as complete
7. Delete a task
8. Sign out

### 4. Test Authentication Flow
```bash
# Sign up
curl -X POST https://your-backend-url.com/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "SecurePass123!",
    "name": "Test User"
  }' \
  -c cookies.txt

# Get current user
curl https://your-backend-url.com/api/auth/me \
  -b cookies.txt
```

---

## 🎥 Demo Video Script (90 Seconds)

### Timing Breakdown

**[0:00-0:10] Introduction (10s)**
- "Hi, I'm [Your Name], and this is my Phase II Todo Application"
- Show landing page
- "Built with Next.js, FastAPI, and Neon PostgreSQL"

**[0:10-0:25] Authentication (15s)**
- Click "Sign Up"
- Fill in email, password, name
- Submit and show successful signup
- Show automatic redirect to dashboard
- "JWT authentication with httpOnly cookies for security"

**[0:25-0:45] Task Management (20s)**
- Create a new task: "Buy groceries - Milk, eggs, bread"
- Show task appearing in list
- Edit the task: "Buy groceries - Milk, eggs, bread, cheese"
- Mark task as complete (checkbox)
- Create another task
- Delete the first task
- "All 5 required features: Add, View, Update, Complete, Delete"

**[0:45-0:60] Technical Highlights (15s)**
- Show code editor with backend routes
- "6 API endpoints with JWT verification"
- Show database schema in Neon console
- "User data isolation - users only see their own tasks"
- Show frontend components
- "Responsive UI with Tailwind CSS"

**[0:60-0:75] Spec-Driven Development (15s)**
- Show specs folder structure
- "Followed Spec-Driven Development methodology"
- Show CLAUDE.md and constitution
- "Agent delegation for specialized tasks"
- Show PHR documentation
- "Complete traceability from spec to code"

**[0:75-0:90] Closing (15s)**
- Show GitHub repository
- "All code is open source on GitHub"
- Show deployment URLs
- "Live demo at [your-frontend-url]"
- "API documentation at [your-backend-url]/docs"
- "Thank you for watching!"

### Recording Tips

1. **Use OBS Studio or Screen Recording Software**
2. **Practice the flow 2-3 times before recording**
3. **Keep mouse movements smooth and deliberate**
4. **Use a clear, confident voice**
5. **Show, don't just tell - demonstrate features**
6. **Keep it under 90 seconds - judges only watch the first 90 seconds**
7. **Export in 1080p (1920x1080) for clarity**
8. **Upload to YouTube as "Unlisted" or "Public"**

---

## 📝 Submission Checklist

### Before Submitting

- [ ] Backend deployed and accessible
- [ ] Frontend deployed and accessible
- [ ] All features tested in production
- [ ] Demo video recorded (under 90 seconds)
- [ ] Demo video uploaded to YouTube/Vimeo
- [ ] README.md updated with deployment URLs
- [ ] GitHub repository is public
- [ ] All code committed and pushed

### Submission Form Fields

**Form URL**: https://forms.gle/KMKEKaFUD6ZX4UtY8

**Required Information**:
1. **Name**: Your full name
2. **Email**: Your email address
3. **WhatsApp Number**: For presentation invitation
4. **GitHub Repository URL**: https://github.com/yourusername/todo-app-hackaton
5. **Frontend Deployment URL**: https://your-frontend.vercel.app
6. **Backend API URL**: https://your-backend.vercel.app
7. **Demo Video URL**: https://youtube.com/watch?v=...
8. **Phase**: Phase II - Full-Stack Web Application
9. **Additional Notes**: (Optional) Any special features or challenges overcome

---

## 🐛 Common Deployment Issues

### Issue 1: CORS Errors

**Symptom**: Frontend can't connect to backend, CORS errors in browser console

**Solution**:
1. Update backend CORS settings to include production frontend URL
2. Ensure `allow_credentials=True` is set
3. Redeploy backend

### Issue 2: Database Connection Fails

**Symptom**: Backend returns 500 errors, database connection errors in logs

**Solution**:
1. Verify DATABASE_URL is correctly set in deployment platform
2. Ensure connection string includes `?sslmode=require`
3. Check Neon database is active and accessible

### Issue 3: JWT Token Not Working

**Symptom**: Authentication works but protected routes return 401

**Solution**:
1. Verify BETTER_AUTH_SECRET is the same in both frontend and backend
2. Check cookie settings (httpOnly, secure, samesite)
3. Ensure frontend is sending cookies with requests

### Issue 4: Environment Variables Not Loading

**Symptom**: App uses default values instead of production values

**Solution**:
1. Verify environment variables are set in deployment platform
2. Redeploy after setting environment variables
3. Check variable names match exactly (case-sensitive)

### Issue 5: Build Fails on Vercel

**Symptom**: Deployment fails during build step

**Solution**:
1. Check build logs for specific errors
2. Verify all dependencies are in package.json/requirements.txt
3. Ensure Node.js/Python versions are compatible
4. Check for syntax errors in code

---

## 📊 Monitoring and Maintenance

### Vercel Dashboard
- Monitor deployment status
- View build logs
- Check analytics and performance
- Manage environment variables

### Neon Dashboard
- Monitor database usage
- View query performance
- Check connection pool status
- Manage database backups

### Health Checks
Set up monitoring for:
- Backend health endpoint: `GET /health`
- Frontend availability
- Database connectivity
- API response times

---

## 🎓 Next Steps After Deployment

1. **Test thoroughly in production**
2. **Record demo video**
3. **Submit via Google Form**
4. **Join Zoom presentation (Sundays 8:00 PM)**
5. **Prepare for Phase III: AI Chatbot**
   - OpenAI ChatKit
   - OpenAI Agents SDK
   - MCP Protocol
   - Due: December 21, 2025

---

## 📞 Support Resources

- **Hackathon Zoom**: https://us06web.zoom.us/j/84976847088?pwd=Z7t7NaeXwVmmR5fysCv7NiMbfbhIda.1
- **Meeting ID**: 849 7684 7088
- **Passcode**: 305850
- **Presentation Time**: Sundays 8:00 PM

---

**Good luck with your deployment! 🚀**
