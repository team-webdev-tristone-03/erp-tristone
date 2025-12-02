# 🔴 FIX: "Cannot connect to server"

## Problem
Backend server is not running on http://localhost:5000

## Root Cause
MongoDB is not installed on your system.

---

## ✅ SOLUTION

### Step 1: Install MongoDB

**Download & Install:**
```
https://www.mongodb.com/try/download/community
```

**Installation Steps:**
1. Click "Download" for Windows
2. Run the installer (.msi file)
3. Choose "Complete" installation
4. Check "Install MongoDB as a Service"
5. Click "Next" → "Install"
6. Wait for installation to complete

**Verify Installation:**
```bash
mongod --version
```

---

### Step 2: Start Backend

**Double-click this file:**
```
SIMPLE_FIX.bat
```

This will:
- ✅ Check MongoDB is running
- ✅ Install dependencies
- ✅ Seed database
- ✅ Start backend server

**Keep the window OPEN!**

---

### Step 3: Start Frontend

**Open NEW terminal and double-click:**
```
START_FRONTEND_ONLY.bat
```

**Keep this window OPEN too!**

---

### Step 4: Login

Open browser: **http://localhost:3000**

**Credentials:**
- Admin: admin@school.com / admin123
- Staff: staff@school.com / staff123
- Student: student@school.com / student123

---

## 🚀 Quick Commands

```bash
# Terminal 1 - Backend
cd backend
npm install
node seed.js
npm run dev

# Terminal 2 - Frontend  
cd frontend
npm install
npm run dev
```

---

## ❌ Still Not Working?

### Error: "MongoDB not installed"
→ Install MongoDB from link above

### Error: "Port 5000 already in use"
→ Close other apps or change port in backend/.env

### Error: "Module not found"
→ Run `npm install` in backend and frontend folders

---

## 📋 Checklist

Before trying to login:

- [ ] MongoDB installed
- [ ] Backend terminal shows "Server running on port 5000"
- [ ] Frontend terminal shows "Local: http://localhost:3000"
- [ ] Can access http://localhost:3000 in browser
- [ ] Both terminal windows are OPEN

If all checked ✅, login will work!

---

## 💡 Alternative: Use MongoDB Atlas (Cloud)

Don't want to install MongoDB locally? Use cloud version:

1. Go to: https://www.mongodb.com/cloud/atlas/register
2. Create free account
3. Create free cluster (M0)
4. Get connection string
5. Update `backend/.env`:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/school_erp
   ```
6. Run SIMPLE_FIX.bat

---

## 🎯 Summary

1. **Install MongoDB** (one-time setup)
2. **Run SIMPLE_FIX.bat** (starts backend)
3. **Run START_FRONTEND_ONLY.bat** (starts frontend)
4. **Login at http://localhost:3000**

That's it! 🎉
