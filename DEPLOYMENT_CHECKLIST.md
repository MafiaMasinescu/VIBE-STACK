# 📋 Vercel Deployment Checklist

Copy this checklist and check off items as you complete them.

## Pre-Deployment Setup

### Backend Preparation
- [ ] `vercel.json` exists in backend folder
- [ ] `.vercelignore` exists in backend folder
- [ ] Backend `.env` file has all required variables
- [ ] CORS is configured for production
- [ ] Server exports `app` for Vercel

### Frontend Preparation
- [ ] `src/config/api.js` created
- [ ] `.env.production` created (will add backend URL after deployment)
- [ ] All API calls updated to use `API_URL` variable

### Database Setup
- [ ] MongoDB Atlas account created
- [ ] Database created
- [ ] Network Access allows all IPs (0.0.0.0/0)
- [ ] MongoDB connection string copied to `.env`

### Third-Party Services
- [ ] Cloudinary account setup (if using uploads)
- [ ] Cloudinary credentials in `.env`
- [ ] Upstash Redis setup (for rate limiting)
- [ ] Upstash credentials in `.env`

### Code Repository
- [ ] All code committed to Git
- [ ] Repository pushed to GitHub
- [ ] `.env` files are in `.gitignore` (should NOT be committed)

---

## Backend Deployment

- [ ] Go to vercel.com/dashboard
- [ ] Click "Add New" → "Project"
- [ ] Import GitHub repository
- [ ] Set Root Directory: `backend`
- [ ] Framework Preset: Other
- [ ] Build Command: (leave empty)
- [ ] Output Directory: (leave empty)

### Environment Variables (Backend)
- [ ] `PORT` = 5001
- [ ] `NODE_ENV` = production
- [ ] `MONGODB_URI` = (your MongoDB connection string)
- [ ] `JWT_SECRET` = (your secret key)
- [ ] `CLOUDINARY_CLOUD_NAME` = (if using Cloudinary)
- [ ] `CLOUDINARY_API_KEY` = (if using Cloudinary)
- [ ] `CLOUDINARY_API_SECRET` = (if using Cloudinary)
- [ ] `UPSTASH_REDIS_REST_URL` = (your Upstash URL)
- [ ] `UPSTASH_REDIS_REST_TOKEN` = (your Upstash token)
- [ ] `FRONTEND_URL` = (leave empty for now, will add after frontend deployment)

### Deploy Backend
- [ ] Click "Deploy"
- [ ] Wait for deployment to complete
- [ ] Check deployment logs for errors
- [ ] Test backend health: visit https://your-backend.vercel.app
- [ ] **COPY BACKEND URL**: ___________________________________

---

## Frontend Deployment

### Update Environment Variables
- [ ] Create `frontend/.env.production`
- [ ] Add: `VITE_API_URL=https://your-backend.vercel.app`

### Update API Calls
Choose one method:

**Method A: Run Script**
- [ ] Run `.\update-api-urls.ps1` (Windows) or `./update-api-urls.sh` (Mac/Linux)
- [ ] Verify changes in components

**Method B: Manual Update**
- [ ] Add `import API_URL from '../config/api';` to each component
- [ ] Replace all `"http://localhost:5001"` with `` `${API_URL}` ``
- [ ] Check these files:
  - [ ] src/Components/UserList.jsx
  - [ ] src/Components/ChatBox.jsx
  - [ ] src/Components/GroupList.jsx
  - [ ] src/Components/GroupChatBox.jsx
  - [ ] src/Components/Calendar.jsx
  - [ ] src/Feed.jsx
  - [ ] src/Profile.jsx
  - [ ] src/Login.jsx
  - [ ] src/Signup.jsx
  - [ ] src/Dashboard.jsx

### Commit Changes
- [ ] `git add .`
- [ ] `git commit -m "Configure frontend for production"`
- [ ] `git push origin main`

### Deploy to Vercel
- [ ] Go to vercel.com/dashboard
- [ ] Click "Add New" → "Project"
- [ ] Import same GitHub repository
- [ ] Set Root Directory: `frontend`
- [ ] Framework Preset: Vite
- [ ] Build Command: `npm run build`
- [ ] Output Directory: `dist`

### Environment Variables (Frontend)
- [ ] `VITE_API_URL` = (your backend URL from above)

### Deploy Frontend
- [ ] Click "Deploy"
- [ ] Wait for deployment to complete
- [ ] Check deployment logs for errors
- [ ] **COPY FRONTEND URL**: ___________________________________

---

## Post-Deployment Configuration

### Update Backend with Frontend URL
- [ ] Go to backend project in Vercel
- [ ] Settings → Environment Variables
- [ ] Add `FRONTEND_URL` = (your frontend URL from above)
- [ ] Save changes
- [ ] Deployments tab → Latest deployment → "..." → "Redeploy"
- [ ] Wait for redeployment

---

## Testing

### Authentication
- [ ] Open frontend URL
- [ ] Click "Sign Up"
- [ ] Create a new account
- [ ] Log in with new account
- [ ] Check if redirected to feed

### Posts
- [ ] Create a new post
- [ ] Upload an image/video
- [ ] Like a post
- [ ] Comment on a post
- [ ] Delete your post

### User Interactions
- [ ] View user list on right sidebar
- [ ] Click chat button on a user
- [ ] Send a message
- [ ] Receive messages (test with another account)

### Groups
- [ ] View groups on left sidebar
- [ ] Click "+" to create a group
- [ ] Add members to group
- [ ] Send group message
- [ ] View group members

### Calendar (if implemented)
- [ ] Create an event
- [ ] View events
- [ ] Delete an event

### Profile
- [ ] Click "Profile" button
- [ ] View your profile
- [ ] Edit profile information
- [ ] Update profile picture
- [ ] Update cover photo

---

## Troubleshooting

### If you see CORS errors:
- [ ] Verify `FRONTEND_URL` is set correctly in backend
- [ ] Ensure no trailing slash in URL
- [ ] Redeploy backend after changing env vars

### If MongoDB won't connect:
- [ ] Check MongoDB Atlas Network Access
- [ ] Add 0.0.0.0/0 to allowed IPs
- [ ] Verify connection string in env vars

### If images won't upload:
- [ ] Check Cloudinary credentials
- [ ] Verify API keys are correct
- [ ] Check Cloudinary dashboard for errors

### If 404 errors:
- [ ] Verify Root Directory is set correctly
- [ ] Check that `vercel.json` is in backend folder
- [ ] Review deployment logs

---

## Success! 🎉

- [ ] Backend deployed and working
- [ ] Frontend deployed and working
- [ ] All features tested
- [ ] No console errors
- [ ] Share your app URL!

**Your live app**: ___________________________________

---

## Optional Enhancements

- [ ] Add custom domain in Vercel
- [ ] Set up Vercel Analytics
- [ ] Enable automatic deployments from GitHub
- [ ] Set up preview deployments for pull requests
- [ ] Configure different environment variables for preview vs production
- [ ] Add monitoring and error tracking (e.g., Sentry)
- [ ] Set up database backups
- [ ] Add rate limiting for API endpoints
- [ ] Implement caching strategy
- [ ] Optimize images with Vercel Image Optimization

---

**Deployment Date**: _______________
**Backend URL**: ___________________________________
**Frontend URL**: ___________________________________
**Notes**: 
___________________________________________________
___________________________________________________
___________________________________________________
