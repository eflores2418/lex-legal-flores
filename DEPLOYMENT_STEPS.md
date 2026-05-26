# Deployment Steps for Fixes

## Overview
You have made changes to both **backend** and **frontend** code, so you need to deploy to:
- **Backend**: Render (where your API is hosted)
- **Frontend**: Vercel (where your React app is hosted)

---

## Step 1: Commit Changes to Git

First, commit all the changes to your Git repository:

```bash
cd lawyer-client-manager

# Check what files changed
git status

# Add all changed files
git add .

# Commit with a descriptive message
git commit -m "Fix: Route order issue and boolean types for PostgreSQL"

# Push to GitHub
git push origin main
```

---

## Step 2: Deploy Backend to Render

### Option A: Automatic Deployment (Recommended)
If you have auto-deploy enabled on Render:

1. Go to https://dashboard.render.com
2. Find your backend service (lex-legal-flores)
3. Render will automatically detect the new commit and start deploying
4. Wait for the deployment to complete (usually 2-5 minutes)
5. Check the logs for any errors

### Option B: Manual Deployment
If auto-deploy is not enabled:

1. Go to https://dashboard.render.com
2. Click on your backend service
3. Click "Manual Deploy" → "Deploy latest commit"
4. Wait for deployment to complete

### Step 2.1: Run Database Migration (IMPORTANT!)

After the backend is deployed, you need to run the migration script:

1. In Render dashboard, go to your service
2. Click on "Shell" tab (or use Render's SSH access)
3. Run the migration:
   ```bash
   cd /opt/render/project/src/backend
   node migrate-to-boolean.js
   ```

**OR** if you can't access the shell, you can run it locally against the production database:

```bash
cd lawyer-client-manager/backend
# Make sure .env has the production DATABASE_URL
NODE_ENV=production node migrate-to-boolean.js
```

---

## Step 3: Deploy Frontend to Vercel

### Option A: Automatic Deployment (Recommended)
If you have auto-deploy enabled on Vercel:

1. Vercel will automatically detect your Git push
2. Go to https://vercel.com/dashboard
3. Find your project
4. Wait for the deployment to complete
5. Check the deployment logs

### Option B: Manual Deployment via Vercel CLI

```bash
cd lawyer-client-manager

# Install Vercel CLI if you haven't
npm install -g vercel

# Login to Vercel
vercel login

# Deploy to production
vercel --prod
```

### Option C: Manual Deployment via Vercel Dashboard

1. Go to https://vercel.com/dashboard
2. Click on your project
3. Go to "Deployments" tab
4. Click "Redeploy" on the latest deployment
5. Select "Use existing Build Cache" → NO (to ensure fresh build)
6. Click "Redeploy"

---

## Step 4: Verify Deployment

### Backend Verification:

1. **Test the health endpoint:**
   ```bash
   curl https://lex-legal-flores.onrender.com/api/health
   ```
   Should return: `{"status":"OK","message":"Server is running with PostgreSQL"}`

2. **Test the upcoming appointments endpoint:**
   ```bash
   curl https://lex-legal-flores.onrender.com/api/appointments/upcoming
   ```
   Should return: `{"appointments":[...]}`

3. **Check Render logs:**
   - Go to Render dashboard
   - Click on your service
   - Check "Logs" tab for any errors

### Frontend Verification:

1. **Open your Vercel app URL** (e.g., https://your-app.vercel.app)

2. **Check the Dashboard page:**
   - Should load without errors
   - Stats cards should show numbers
   - Upcoming appointments should display

3. **Open browser console (F12):**
   - Look for "Loading dashboard data..." log
   - Check for any error messages
   - Verify API calls are successful

---

## Step 5: Troubleshooting

### If Dashboard Still Doesn't Load:

1. **Clear browser cache:**
   - Press Ctrl+Shift+R (Windows/Linux) or Cmd+Shift+R (Mac)
   - Or clear cache manually in browser settings

2. **Check API URL in frontend:**
   - Verify `src/services/api.ts` has correct production URL
   - Should be: `https://lex-legal-flores.onrender.com/api`

3. **Check CORS settings:**
   - Backend should allow requests from your Vercel domain
   - Check `server.js` has `app.use(cors())`

4. **Check Render logs:**
   - Look for 404 errors on `/api/appointments/upcoming`
   - Look for database connection errors

5. **Check Vercel logs:**
   - Go to Vercel dashboard → Deployments → Click on latest
   - Check "Functions" tab for any errors

### If Migration Fails:

If you can't run the migration script, you can manually update the database:

```sql
-- Connect to your PostgreSQL database
-- Then run these commands:

ALTER TABLE appointments 
ALTER COLUMN reminder_sent TYPE BOOLEAN 
USING CASE WHEN reminder_sent = 0 THEN FALSE ELSE TRUE END;

ALTER TABLE reminders 
ALTER COLUMN sent TYPE BOOLEAN 
USING CASE WHEN sent = 0 THEN FALSE ELSE TRUE END;
```

---

## Quick Checklist

- [ ] Committed changes to Git
- [ ] Pushed to GitHub
- [ ] Backend deployed on Render
- [ ] Migration script executed
- [ ] Frontend deployed on Vercel
- [ ] Tested health endpoint
- [ ] Tested upcoming appointments endpoint
- [ ] Dashboard loads correctly
- [ ] Browser console shows no errors
- [ ] Stats cards display data
- [ ] Upcoming appointments list works

---

## Expected Results

After successful deployment:

✅ Dashboard page loads and shows data
✅ Stats cards display correct numbers
✅ Upcoming appointments list populates
✅ No errors in browser console
✅ Backend responds to all API calls
✅ Database uses BOOLEAN types correctly

---

**Made with Bob** 🤖