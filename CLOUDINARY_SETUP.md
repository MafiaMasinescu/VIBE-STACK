# 🚀 Cloudinary Setup Guide

## All Changes Have Been Applied! ✅

Your application is now configured to use **Cloudinary** for storing images and videos. Here's what was changed:

### Backend Changes Made:
1. ✅ Installed `cloudinary` and `multer-storage-cloudinary` packages
2. ✅ Updated `backend/src/config/multer.js` to use Cloudinary storage
3. ✅ Updated `backend/src/controllers/postController.js` to save Cloudinary URLs
4. ✅ Updated `backend/src/controllers/authController.js` to handle profile photos via Cloudinary
5. ✅ Added Cloudinary environment variables to `.env`

### Frontend Changes Made:
1. ✅ Updated `Feed.jsx` to use direct Cloudinary URLs (removed localhost prefix)
2. ✅ Updated `Profile.jsx` to use direct Cloudinary URLs
3. ✅ All profile photos, cover photos, post images, and videos now use Cloudinary

---

## 📝 Next Steps - Create Your Cloudinary Account

### Step 1: Sign Up for Cloudinary
1. Go to [https://cloudinary.com/users/register/free](https://cloudinary.com/users/register/free)
2. Sign up for a **FREE account** (25GB storage, 25GB bandwidth/month)
3. Verify your email

### Step 2: Get Your API Credentials
1. Log in to your Cloudinary dashboard
2. On the **Dashboard** page, you'll see:
   - **Cloud Name**
   - **API Key**
   - **API Secret**

### Step 3: Update Your `.env` File
Open `backend/.env` and replace the placeholder values:

```env
# Replace these with your actual Cloudinary credentials:
CLOUDINARY_CLOUD_NAME=your_actual_cloud_name
CLOUDINARY_API_KEY=your_actual_api_key
CLOUDINARY_API_SECRET=your_actual_api_secret
```

**Example:**
```env
CLOUDINARY_CLOUD_NAME=dj123abc45
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=AbCdEfGhIjKlMnOpQrStUvWxYz
```

### Step 4: Restart Your Backend Server
```bash
cd backend
npm run dev
```

---

## ✨ How It Works Now

### For New Uploads:
- Users upload images/videos → Cloudinary stores them → Database saves Cloudinary URL
- Images are served directly from Cloudinary's CDN (fast worldwide)
- Automatic optimization and transformation

### For Existing Uploads:
- Old uploads in `backend/uploads/` will still work
- New uploads will go to Cloudinary
- You can manually upload old files to Cloudinary if needed

---

## 🔍 Testing Your Setup

1. **Start your servers:**
   ```bash
   # Terminal 1 - Backend
   cd backend
   npm run dev

   # Terminal 2 - Frontend
   cd frontend
   npm run dev
   ```

2. **Test uploading:**
   - Create a new post with an image
   - Upload a profile photo
   - Check the Cloudinary dashboard to see your uploads

3. **Check the database:**
   - New posts should have URLs like: `https://res.cloudinary.com/your_cloud_name/image/upload/...`
   - NOT like: `/uploads/123456-image.jpg`

---

## 📦 Cloudinary Features You Get

- ✅ **CDN Delivery**: Fast loading worldwide
- ✅ **Automatic Optimization**: Images compressed automatically
- ✅ **Responsive Images**: Auto-resize based on device
- ✅ **Video Support**: MP4, WebM, MOV, etc.
- ✅ **Transformations**: Crop, resize, filters on-the-fly
- ✅ **Free Tier**: 25GB storage + 25GB bandwidth/month

---

## 🛠️ Troubleshooting

### "Invalid Cloudinary credentials"
- Double-check your `.env` values
- Make sure there are no spaces or quotes around the values
- Restart your backend server after changing `.env`

### "Upload failed"
- Check your Cloudinary dashboard quota
- Ensure file size is under 100MB
- Check file format is supported

### Images not showing
- Open browser console and check for errors
- Verify the URL in the database is a Cloudinary URL
- Check Cloudinary dashboard to see if upload succeeded

---

## 🎉 You're All Set!

Once you add your Cloudinary credentials to `.env`, your app will:
- Store all new images/videos on Cloudinary
- Serve them via fast CDN
- Work perfectly for all users
- Scale to thousands of users

No more local storage issues! 🚀
