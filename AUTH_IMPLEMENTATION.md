# Authentication System Setup

## What was implemented:

### Backend:
1. ✅ **User Model** (`backend/src/models/User.js`)
   - Username (unique, required)
   - Email (unique, required)
   - Password (hashed with bcrypt)

2. ✅ **Auth Controller** (`backend/src/controllers/authController.js`)
   - `registerUser()` - Creates new users with hashed passwords
   - `loginUser()` - Authenticates users
   - Checks for duplicate usernames/emails
   - Password validation (minimum 6 characters)

3. ✅ **Auth Routes** (`backend/src/routes/authRoutes.js`)
   - POST `/api/auth/register` - Register new user
   - POST `/api/auth/login` - Login existing user

4. ✅ **Server Updates** (`backend/src/server.js`)
   - Added CORS support
   - Integrated auth routes

### Frontend:
1. ✅ **Updated Login Page** (`frontend/src/pages/Login.jsx`)
   - Toggle between Login and Register modes
   - Form validation
   - API calls to backend
   - User feedback messages
   - Stores user data in localStorage on successful login

## How to Test:

### 1. Start the Backend Server:
```powershell
cd backend
npm run dev
```
Backend should run on `http://localhost:3000`

### 2. Start the Frontend:
```powershell
cd frontend
npm run dev
```
Frontend should run on `http://localhost:5173` (or another port if 5173 is busy)

### 3. Testing the Features:

#### Register a New User:
1. Click "Need an account? Register" button
2. Fill in Username, Email, and Password
3. Click "Register"
4. You should see "✓ User registered successfully"

#### Login:
1. Click "Have an account? Login" button
2. Enter Email and Password (no username needed for login)
3. Click "Login"
4. You should see "✓ Login successful"

### 4. Verify in MongoDB:
Check your MongoDB database - you should see a new `users` collection with your registered users.

## API Endpoints:

### Register User
- **URL:** `POST http://localhost:3000/api/auth/register`
- **Body:**
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "mypassword123"
}
```

### Login User
- **URL:** `POST http://localhost:3000/api/auth/login`
- **Body:**
```json
{
  "email": "john@example.com",
  "password": "mypassword123"
}
```

## Security Features:
- ✅ Passwords are hashed with bcrypt (10 salt rounds)
- ✅ Duplicate email/username checking
- ✅ Input validation
- ✅ Passwords never returned in responses
- ✅ CORS enabled for frontend-backend communication

## Notes:
- Make sure MongoDB is running and connected
- Check your `.env` file has the correct `MONGO_URI` and `PORT`
- The login page layout remains unchanged - only functionality was added
