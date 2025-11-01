# 🔧 Cloudinary Integration - Troubleshooting Guide

## ✅ Changes Applied

### 1. Environment Variables (.env)
- ✅ Added JWT_SECRET (was missing - this could cause authentication issues)
- ✅ Cloudinary credentials configured

### 2. Backend Configuration
- ✅ `multer.js` - Updated to use Cloudinary storage with dynamic resource_type
- ✅ `postController.js` - Updated to save Cloudinary URLs
- ✅ `authController.js` - Updated to handle profile photos via Cloudinary
- ✅ Routes properly configured

### 3. Frontend Updates
- ✅ `Feed.jsx` - All image URLs updated to use direct Cloudinary URLs
- ✅ `Profile.jsx` - All image URLs updated to use direct Cloudinary URLs

---

## 🐛 Common Issues & Solutions

### Issue 1: "Failed to create post"

**Possible Causes:**
1. **JWT_SECRET missing** - ✅ FIXED - Added to .env
2. **Cloudinary credentials incorrect** - Check your dashboard
3. **File type not supported** - Check the file format
4. **Backend not restarted** - Restart after .env changes

**Solution:**
```bash
# Stop your backend server (Ctrl+C)
# Then restart:
cd backend
npm run dev
```

### Issue 2: "Profile picture upload fails"

**Possible Causes:**
1. File size > 100MB
2. Invalid file format
3. Cloudinary quota exceeded

**Check Cloudinary Dashboard:**
- Go to: https://cloudinary.com/console
- Check "Usage" tab for quota
- Check "Media Library" to see if uploads are working

### Issue 3: "Images not displaying"

**Possible Causes:**
1. Old posts still have local URLs (`/uploads/...`)
2. New posts should have Cloudinary URLs (`https://res.cloudinary.com/...`)

**Check in MongoDB:**
- New posts should have URLs like: `https://res.cloudinary.com/diyamlg2d/image/upload/v1234567890/vibe-stack/abc123.jpg`
- Old posts will have URLs like: `/uploads/123456-image.jpg` (these still work via express static)

---

## 🧪 How to Test

### Test 1: Check Backend Configuration
```bash
# In backend terminal, you should see:
# "Server started on port: 5001"
# No errors about JWT_SECRET or Cloudinary
```

### Test 2: Create a Post Without Image
1. Open feed
2. Type some text
3. Click "Post"
4. **Expected:** Post appears immediately

### Test 3: Create a Post With Image
1. Open feed
2. Type some text
3. Select an image file
4. Click "Post"
5. **Expected:** Post appears with image from Cloudinary

### Test 4: Update Profile Picture
1. Go to your profile
2. Click "Edit Profile"
3. Click "📷" on profile photo
4. Select an image
5. Click "Save Changes"
6. **Expected:** New profile picture appears from Cloudinary

### Test 5: Check Image URL
1. Create a post with an image
2. Right-click on the image → "Open image in new tab"
3. **Expected URL format:** `https://res.cloudinary.com/diyamlg2d/image/upload/...`

---

## 🔍 Debugging Steps

### Step 1: Check Backend Logs
Look for errors in the terminal running your backend:
- Authentication errors
- Cloudinary upload errors
- File validation errors

### Step 2: Check Browser Console
1. Open browser DevTools (F12)
2. Go to Console tab
3. Try creating a post
4. Look for:
   - Network errors (401, 400, 500)
   - CORS errors
   - Upload errors

### Step 3: Check Network Tab
1. Open DevTools → Network tab
2. Try creating a post
3. Find the POST request to `/api/posts`
4. Check:
   - Status code (should be 201)
   - Request payload (should include FormData)
   - Response (should include the new post with Cloudinary URL)

### Step 4: Check Cloudinary Dashboard
1. Go to: https://cloudinary.com/console
2. Click "Media Library"
3. Look for folder: "vibe-stack"
4. **Expected:** Your uploaded files should appear here

---

## 📝 Expected Behavior

### Creating a Post:
```javascript
// Frontend sends:
FormData {
  content: "Hello world",
  tag: "General",
  media: File
}

// Backend saves to Cloudinary and returns:
{
  _id: "...",
  content: "Hello world",
  tag: "General",
  image: "https://res.cloudinary.com/diyamlg2d/image/upload/v1234567890/vibe-stack/abc123.jpg",
  mediaType: "image",
  author: { name: "...", profilePhoto: "..." }
}
```

### Updating Profile:
```javascript
// Frontend sends:
FormData {
  name: "John Doe",
  about: "Developer",
  tag: "Developer",
  position: "Software Engineer",
  profilePhoto: File,
  coverPhoto: File
}

// Backend returns:
{
  user: {
    name: "John Doe",
    profilePhoto: "https://res.cloudinary.com/diyamlg2d/image/upload/...",
    coverPhoto: "https://res.cloudinary.com/diyamlg2d/image/upload/..."
  }
}
```

---

## ✅ Verification Checklist

- [ ] Backend server running without errors
- [ ] JWT_SECRET exists in .env
- [ ] Cloudinary credentials correct in .env
- [ ] Can create posts without images
- [ ] Can create posts with images
- [ ] Images appear in Cloudinary dashboard
- [ ] Image URLs are Cloudinary URLs (not /uploads/...)
- [ ] Can update profile picture
- [ ] Can update cover photo
- [ ] Profile photos display correctly
- [ ] Old posts (if any) still display

---

## 🆘 If Still Not Working

### Check These Files:
1. `backend/.env` - All credentials present and correct
2. `backend/src/config/multer.js` - Cloudinary config correct
3. Browser Console - Any JavaScript errors?
4. Backend Terminal - Any Node.js errors?

### Get More Details:
Add console.logs to debug:

**In `backend/src/controllers/postController.js`:**
```javascript
export const createPost = async (req, res) => {
    console.log("Creating post...");
    console.log("Content:", req.body.content);
    console.log("File:", req.file);
    // ... rest of code
};
```

**In `frontend/src/Feed.jsx`:**
```javascript
const handleCreatePost = async (e) => {
    console.log("Submitting post...");
    console.log("Content:", newPostContent);
    console.log("File:", selectedFile);
    // ... rest of code
};
```

---

## 📞 Need Help?

Check these URLs:
- Cloudinary Dashboard: https://cloudinary.com/console
- Cloudinary Docs: https://cloudinary.com/documentation
- MongoDB Atlas: https://cloud.mongodb.com/
