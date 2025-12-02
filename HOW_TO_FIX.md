# 🔧 How to Fix "Cannot connect to server" Error

## The Problem
When you click Login, you see: **"Cannot connect to server. Make sure backend is running on http://localhost:5000"**

This means the **backend server is NOT running**.

---

## ✅ The Solution

### You Need to Start the Backend Server!

The School ERP has TWO parts:
1. **Backend** (runs on port 5000) - Handles data and authentication
2. **Frontend** (runs on port 3000) - The UI you see

**Both must be running for login to work!**

---

## 🚀 Quick Fix (3 Steps)

### Step 1: Install MongoDB (Required - One Time Only)

1. Go to: **https://www.mongodb.com/try/download/community**
2. Download MongoDB Community Server for Windows
3. Run the installer
4. Choose **"Complete"** installation
5. Check **"Install MongoDB as a Service"**
6. Click Install and wait

### Step 2: Start Backend Server

Open Command Prompt and run:
```bash
cd d:\dummy\school-erp\backend
npm run dev
```

**Keep this window OPEN!** You should see:
```
MongoDB Connected
Server running on port 5000
```

### Step 3: Start Frontend (Already Running)

Your frontend is already running. Just refresh the page and try logging in again.

---

## 🎯 Even Easier Way

After installing MongoDB, just double-click:
```
START_EVERYTHING.bat
```

This starts both servers automatically!

---

## 🔑 Login Credentials

- **Admin**: admin@school.com / admin123
- **Staff**: staff@school.com / staff123
- **Student**: student@school.com / student123

---

## ❌ Troubleshooting

### "MongoDB connection error"
→ MongoDB is not installed. Install it from the link above.

### "Port 5000 already in use"
→ Another app is using port 5000. Close it or restart your computer.

### Backend starts but login still fails
→ Run this in backend folder:
```bash
node seed.js
```

---

## 📋 Checklist Before Login

- [ ] MongoDB is installed
- [ ] Backend terminal shows "Server running on port 5000"
- [ ] Frontend is accessible at http://localhost:3000
- [ ] Both terminal windows are OPEN

If all checked ✅, login will work!

---

## 💡 Summary

**The error happens because you only started the frontend, not the backend.**

**To fix:**
1. Install MongoDB (one-time)
2. Start backend: `cd backend && npm run dev`
3. Keep it running
4. Try login again

**That's it!** 🎉
