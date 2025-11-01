# 🚀 Quick Deployment Steps - VIBE-STACK to Vercel

## ⚡ Quick Start (5 Steps)

### 1️⃣ Prepare Backend (Already Done!)
- ✅ `vercel.json` created
- ✅ `.vercelignore` created
- ✅ CORS updated for production
- ✅ Server exports added

### 2️⃣ Create Environment Files

**Backend `.env`** (keep your existing one, add):
```env
NODE_ENV=production
FRONTEND_URL=https://your-frontend.vercel.app
```

**Frontend `.env.production`** (create new):
```env
VITE_API_URL=https://your-backend.vercel.app
```

### 3️⃣ Update Frontend API Calls

**Option A: Run Script (Easiest)**
```powershell
cd frontend
.\update-api-urls.ps1
```

**Option B: Manual Update**
1. Import API config in each component:
   ```javascript
   import API_URL from '../config/api';
   ```
2. Replace `"http://localhost:5001"` with `` `${API_URL}` ``

### 4️⃣ Deploy Backend
1. Go to [vercel.com](https://vercel.com)
2. New Project → Import your repo
3. Root Directory: `backend`
4. Add all environment variables
5. Deploy!
6. **Copy the backend URL**

### 5️⃣ Deploy Frontend
1. New Project (same repo)
2. Root Directory: `frontend`
3. Add `VITE_API_URL` = your backend URL
4. Deploy!
5. **Copy the frontend URL**
6. Go back to backend → Add `FRONTEND_URL` → Redeploy

---

## 📋 Environment Variables Needed

### Backend (Vercel Dashboard → Settings → Environment Variables)
```
PORT=5001
NODE_ENV=production
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
UPSTASH_REDIS_REST_URL=your_upstash_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_token
FRONTEND_URL=https://your-frontend.vercel.app
```

### Frontend (Vercel Dashboard → Settings → Environment Variables)
```
VITE_API_URL=https://your-backend.vercel.app
```

---

## ✅ Final Checklist

Before deploying:
- [ ] All code pushed to GitHub
- [ ] Backend `.env` has all values
- [ ] Frontend API URLs updated
- [ ] MongoDB allows all IPs (0.0.0.0/0)

After backend deployed:
- [ ] Backend URL copied
- [ ] Frontend `.env.production` has backend URL

After frontend deployed:
- [ ] Frontend URL copied
- [ ] Backend `FRONTEND_URL` updated
- [ ] Backend redeployed

Testing:
- [ ] Open frontend URL
- [ ] Try to sign up/login
- [ ] Create a post
- [ ] Send a message
- [ ] Create a group

---

## 🆘 Common Issues

### "CORS Error"
→ Add `FRONTEND_URL` to backend env vars and redeploy

### "Cannot connect to database"
→ MongoDB Atlas → Network Access → Add 0.0.0.0/0

### "404 Not Found"
→ Check `vercel.json` is in backend folder

### "Module not found"
→ Delete `node_modules`, run `npm install`, then redeploy

---

## 📞 Help

Read full guide: `VERCEL_DEPLOYMENT_GUIDE.md`
Vercel Docs: https://vercel.com/docs
