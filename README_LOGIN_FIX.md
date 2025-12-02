# 🔧 LOGIN FIX - Complete Guide

## 🔴 Error Message
```
Cannot connect to server. Make sure backend is running on http://localhost:5000
```

---

## 🎯 THE FIX (3 Steps)

### Step 1️⃣: Install MongoDB (One-Time Setup)

MongoDB is required for the database.

**Quick Install:**
1. Go to: https://www.mongodb.com/try/download/community
2. Download MongoDB Community Server for Windows
3. Run installer → Choose "Complete" → Install as Service
4. Finish installation

**Verify:**
```bash
mongod --version
```

---

### Step 2️⃣: Start Backend Server

**Double-click:**
```
SIMPLE_FIX.bat
```

**Or manually:**
```bash
cd backend
npm install
node seed.js
npm run dev
```

**Wait for:**
```
MongoDB Connected
Server running on port 5000
```

**✅ Keep this terminal window OPEN!**

---

### Step 3️⃣: Start Frontend

**Double-click:**
```
START_FRONTEND_ONLY.bat
```

**Or manually:**
```bash
cd frontend
npm install
npm run dev
```

**Wait for:**
```
Local: http://localhost:3000
```

**✅ Keep this terminal window OPEN too!**

---

## 🔑 Login Credentials

Open: **http://localhost:3000**

| Role | Email | Password |
|------|-------|----------|
| 👨‍💼 Admin | admin@school.com | admin123 |
| 👨‍🏫 Staff | staff@school.com | staff123 |
| 👨‍🎓 Student | student@school.com | student123 |

---

## 🚀 ONE-CLICK FIX

**Just double-click:**
```
CLICK_HERE_TO_FIX.bat
```

This will:
- ✅ Check if MongoDB is installed
- ✅ Start backend automatically
- ✅ Start frontend automatically
- ✅ Open browser to login page

---

## ❌ Troubleshooting

### "MongoDB is not installed"

**Solution:** Install MongoDB first
- Download: https://www.mongodb.com/try/download/community
- Or use cloud: https://www.mongodb.com/cloud/atlas/register

### "Port 5000 already in use"

**Solution:** Close other apps using port 5000
```bash
# Find what's using port 5000
netstat -ano | findstr :5000

# Kill the process (replace PID)
taskkill /PID <process_id> /F
```

### "Module not found"

**Solution:** Install dependencies
```bash
cd backend
npm install

cd ../frontend
npm install
```

### Backend starts but login still fails

**Solution:** Check if database was seeded
```bash
cd backend
node seed.js
```

---

## 📋 Pre-Login Checklist

Before attempting to login, verify:

- [ ] MongoDB is installed and running
- [ ] Backend terminal shows "Server running on port 5000"
- [ ] Frontend terminal shows "Local: http://localhost:3000"
- [ ] Database was seeded (demo users created)
- [ ] Both terminal windows are OPEN
- [ ] Browser can access http://localhost:3000

If all ✅, login will work!

---

## 💡 Alternative: MongoDB Atlas (No Local Install)

Don't want to install MongoDB locally?

1. **Create free account:** https://www.mongodb.com/cloud/atlas/register
2. **Create free cluster** (M0 Sandbox)
3. **Get connection string**
4. **Update backend/.env:**
   ```
   MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/school_erp
   ```
5. **Run SIMPLE_FIX.bat**

---

## 🎓 What Each File Does

| File | Purpose |
|------|---------|
| `CLICK_HERE_TO_FIX.bat` | One-click fix - checks MongoDB and starts everything |
| `SIMPLE_FIX.bat` | Starts backend server only |
| `START_FRONTEND_ONLY.bat` | Starts frontend only |
| `RUN_ME.txt` | Quick instructions |
| `INSTALL_MONGODB.txt` | MongoDB installation guide |

---

## 🔄 Complete Reset (If Nothing Works)

```bash
# 1. Stop all servers (Ctrl+C in terminals)

# 2. Delete node_modules
cd backend
rmdir /s /q node_modules
cd ../frontend
rmdir /s /q node_modules

# 3. Reinstall
cd ../backend
npm install
cd ../frontend
npm install

# 4. Seed database
cd ../backend
node seed.js

# 5. Start servers
# Terminal 1:
cd backend
npm run dev

# Terminal 2:
cd frontend
npm run dev
```

---

## ✅ Success Indicators

**Backend is working when you see:**
```
MongoDB Connected
Server running on port 5000
```

**Frontend is working when you see:**
```
VITE v4.x.x ready in xxx ms
Local: http://localhost:3000
```

**Login is working when:**
- You can access http://localhost:3000
- Login page loads without errors
- You can enter credentials and click Login
- You get redirected to dashboard after login

---

## 🎉 After Successful Login

You'll have access to:

**Admin Dashboard:**
- Manage students and staff
- View all data
- Create announcements
- Full system control

**Staff Dashboard:**
- Add/update marks
- Mark attendance
- Upload materials
- Changes sync in real-time

**Student Dashboard:**
- View marks (updates instantly)
- Check attendance
- Download materials
- View timetable

---

## 📞 Still Need Help?

1. ✅ Read: `INSTALL_MONGODB.txt`
2. ✅ Run: `CLICK_HERE_TO_FIX.bat`
3. ✅ Check: Both terminals are open
4. ✅ Verify: MongoDB is installed
5. ✅ Confirm: Ports 3000 and 5000 are free

---

## 🎯 Quick Summary

```
1. Install MongoDB (one-time)
2. Run CLICK_HERE_TO_FIX.bat
3. Wait for servers to start
4. Login at http://localhost:3000
```

**That's it!** 🚀
