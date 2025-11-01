# 🚀 Vercel Deployment Guide for VIBE-STACK

This guide will help you deploy both your backend and frontend to Vercel.

## 📋 Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub Repository**: Push your code to GitHub
3. **MongoDB Atlas**: Ensure your MongoDB is accessible from anywhere (for production)
4. **Cloudinary Account**: If you're using image uploads
5. **Upstash Redis**: For rate limiting

---

## 🔧 Pre-Deployment Changes Made

### Backend Changes:
- ✅ Created `vercel.json` configuration
- ✅ Created `.vercelignore` file
- ✅ Updated CORS to support production URLs
- ✅ Added `export default app` for Vercel
- ✅ Created `.env.example` template

### Frontend Changes:
- ✅ Created API configuration file (`src/config/api.js`)
- ✅ Created `.env.example` template

---

## 📝 Step-by-Step Deployment

### Part 1: Deploy Backend to Vercel

#### 1. Create Local .env File (if not exists)
In `backend/` folder, create `.env` with your actual values:
```env
PORT=5001
NODE_ENV=production
MONGODB_URI=your_actual_mongodb_uri
JWT_SECRET=your_actual_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
UPSTASH_REDIS_REST_URL=your_upstash_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_token
FRONTEND_URL=https://your-frontend.vercel.app
```

#### 2. Push Code to GitHub
```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

#### 3. Deploy Backend on Vercel
1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository
4. Configure Project:
   - **Framework Preset**: Other
   - **Root Directory**: `backend`
   - **Build Command**: Leave empty (not needed for Node.js)
   - **Output Directory**: Leave empty
   - **Install Command**: `npm install`

5. **Add Environment Variables** (click "Environment Variables"):
   - Add all variables from your `.env` file
   - **Important**: Set `NODE_ENV` to `production`
   - **Important**: Leave `FRONTEND_URL` empty for now (add later)

6. Click **"Deploy"**
7. Wait for deployment to complete
8. **Copy your backend URL** (e.g., `https://your-backend.vercel.app`)

---

### Part 2: Deploy Frontend to Vercel

#### 1. Update Frontend to Use Backend API

**IMPORTANT**: Before deploying frontend, you need to update all API calls.

You have two options:

**Option A: Update API Config File (Recommended)**

Create `frontend/.env.production`:
```env
VITE_API_URL=https://your-backend.vercel.app
```

Then update all your components to use the API_URL from config.

**Option B: Find and Replace**

Search your frontend code for `http://localhost:5001` and prepare to replace with your Vercel backend URL.

Files that need updating (search for "localhost:5001"):
- `src/Components/UserList.jsx`
- `src/Components/ChatBox.jsx`
- `src/Components/GroupList.jsx`
- `src/Components/GroupChatBox.jsx`
- `src/Components/Calendar.jsx`
- `src/Feed.jsx`
- `src/Profile.jsx`
- `src/Login.jsx`
- `src/Signup.jsx`
- Any other files making API calls

#### 2. Create Frontend .env Files

Create `frontend/.env.local` (for local development):
```env
VITE_API_URL=http://localhost:5001
```

Create `frontend/.env.production` (for production):
```env
VITE_API_URL=https://your-backend.vercel.app
```

#### 3. Push Updated Code
```bash
git add .
git commit -m "Configure for production deployment"
git push origin main
```

#### 4. Deploy Frontend on Vercel
1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository (same repo)
4. Configure Project:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

5. **Add Environment Variable**:
   - `VITE_API_URL` = `https://your-backend.vercel.app`

6. Click **"Deploy"**
7. Wait for deployment to complete
8. **Copy your frontend URL** (e.g., `https://your-frontend.vercel.app`)

---

### Part 3: Update Backend with Frontend URL

1. Go to your **backend project** in Vercel dashboard
2. Go to **Settings** → **Environment Variables**
3. Add or update:
   - `FRONTEND_URL` = `https://your-frontend.vercel.app`
4. Go to **Deployments** tab
5. Click **"..."** on the latest deployment → **"Redeploy"**

---

## 🔄 Quick Update Script

After making the environment variable changes, here's what you need to do:

### Update All API URLs in Frontend

Run this in your frontend folder to update API calls:

**For Windows (PowerShell):**
```powershell
# Replace localhost URLs with environment variable
(Get-Content src/Components/UserList.jsx) -replace 'http://localhost:5001', 'import.meta.env.VITE_API_URL' | Set-Content src/Components/UserList.jsx
```

Or manually replace each occurrence.

---

## 📱 Alternative: Use API Config (RECOMMENDED)

Instead of replacing URLs everywhere, import the config file:

1. In each component/page that makes API calls, add at the top:
```javascript
import API_URL from '../config/api';
```

2. Replace all instances of `"http://localhost:5001"` with template literals:
```javascript
// Before:
axios.get("http://localhost:5001/api/posts", ...)

// After:
axios.get(`${API_URL}/api/posts`, ...)
```

This way, the URL automatically switches based on environment!

---

## ✅ Post-Deployment Checklist

- [ ] Backend deployed and running
- [ ] Frontend deployed and running
- [ ] Environment variables set in both deployments
- [ ] CORS configured correctly (frontend URL in backend env)
- [ ] MongoDB accessible from Vercel (allow all IPs in MongoDB Atlas)
- [ ] Cloudinary credentials working
- [ ] Test user registration
- [ ] Test user login
- [ ] Test creating posts
- [ ] Test chat functionality
- [ ] Test group creation
- [ ] Test file uploads

---

## 🐛 Troubleshooting

### CORS Errors
- Ensure `FRONTEND_URL` is set correctly in backend
- Check that your frontend URL matches exactly (no trailing slash)
- Redeploy backend after changing environment variables

### MongoDB Connection Issues
- Go to MongoDB Atlas → Network Access
- Add IP address `0.0.0.0/0` (allows all IPs)
- Or add Vercel's IP ranges

### File Upload Issues
- Ensure Cloudinary credentials are correct
- Check that multer configuration works with serverless

### API Not Found (404)
- Verify your backend URL is correct
- Check that routes are properly exported
- Check Vercel function logs

---

## 🔗 Useful Commands

### View Logs
```bash
# Install Vercel CLI
npm i -g vercel

# View logs
vercel logs [deployment-url]
```

### Local Testing
```bash
# Test backend locally
cd backend
npm run dev

# Test frontend locally
cd frontend
npm run dev
```

---

## 📊 Monitoring

- View logs in Vercel Dashboard → Your Project → Deployments → [Click deployment] → Logs
- Monitor performance in Vercel Analytics
- Set up alerts for errors

---

## 🎉 Success!

Once deployed:
- Your backend will be at: `https://your-backend.vercel.app`
- Your frontend will be at: `https://your-frontend.vercel.app`
- Share your frontend URL with users!

---

## 💡 Pro Tips

1. **Custom Domain**: Add a custom domain in Vercel settings
2. **Auto Deploy**: Vercel auto-deploys on git push (enable in settings)
3. **Preview Deployments**: Every PR gets a preview URL
4. **Environment Branches**: Set different env vars for preview vs production
5. **Edge Functions**: Consider using Vercel Edge Functions for better performance

---

## 📞 Need Help?

- Vercel Docs: https://vercel.com/docs
- Vercel Discord: https://vercel.com/discord
- Check deployment logs for specific errors

---

**Note**: Vercel's free tier has limitations:
- 100GB bandwidth per month
- Serverless function timeout: 10 seconds
- Max file size: 4.5MB per file
- Consider upgrading for production apps with high traffic
