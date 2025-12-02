# Troubleshooting Guide - Login Issues

## Quick Fix (Run This First!)

```bash
# Run this script to fix everything:
FIX_AND_START.bat
```

---

## Common Login Issues & Solutions

### ❌ Issue 1: "Cannot connect to server"

**Cause**: Backend server is not running

**Solution**:
```bash
# Check if backend is running
# Open http://localhost:5000/api/auth/login in browser
# If it doesn't load, start backend:

cd backend
npm run dev
```

---

### ❌ Issue 2: "MongoDB connection error"

**Cause**: MongoDB is not running

**Solution**:
```bash
# Check MongoDB status:
CHECK_MONGODB.bat

# Start MongoDB:
net start MongoDB

# If MongoDB is not installed:
# Download from: https://www.mongodb.com/try/download/community
```

---

### ❌ Issue 3: "Invalid credentials"

**Cause**: Database not seeded or wrong credentials

**Solution**:
```bash
# Seed the database:
cd backend
node seed.js

# Use these credentials:
Admin:   admin@school.com / admin123
Staff:   staff@school.com / staff123
Student: student@school.com / student123
```

---

### ❌ Issue 4: "Module not found"

**Cause**: Dependencies not installed

**Solution**:
```bash
# Install backend dependencies:
cd backend
npm install

# Install frontend dependencies:
cd frontend
npm install
```

---

## Step-by-Step Fix

### 1. Check MongoDB
```bash
CHECK_MONGODB.bat
```

If not running:
```bash
net start MongoDB
```

### 2. Install Dependencies
```bash
cd backend
npm install

cd ../frontend
npm install
```

### 3. Seed Database
```bash
cd backend
node seed.js
```

### 4. Start Backend
```bash
cd backend
npm run dev
```

Wait for: "Server running on port 5000"

### 5. Start Frontend (New Terminal)
```bash
cd frontend
npm run dev
```

Wait for: "Local: http://localhost:3000"

### 6. Test Login
- Open: http://localhost:3000
- Email: admin@school.com
- Password: admin123
- Role: Admin
- Click Login

---

## Verify Everything is Working

### Check Backend
Open: http://localhost:5000/api/auth/login
Should see: Cannot GET /api/auth/login (this is OK - it means server is running)

### Check Frontend
Open: http://localhost:3000
Should see: Login page

### Check MongoDB
```bash
# In MongoDB shell or Compass:
use school_erp
db.users.find()
```
Should see 5 users (1 admin, 1 staff, 3 students)

---

## Still Not Working?

### Check Ports
```bash
# Check if port 5000 is in use:
netstat -ano | findstr :5000

# Check if port 3000 is in use:
netstat -ano | findstr :3000
```

### Check Logs
Look at terminal output for errors:
- Backend terminal: Shows MongoDB connection and server status
- Frontend terminal: Shows Vite dev server status

### Clear Cache
```bash
# Clear browser cache
# Or use Incognito/Private mode

# Clear localStorage
# Open browser console (F12) and run:
localStorage.clear()
```

---

## Quick Test Commands

```bash
# Test backend is running:
curl http://localhost:5000/api/auth/login

# Test MongoDB connection:
mongosh
use school_erp
db.users.countDocuments()
exit

# Test frontend is running:
# Open http://localhost:3000 in browser
```

---

## Environment Check

### Required Software:
- ✅ Node.js v16+ (check: `node --version`)
- ✅ MongoDB v5+ (check: `mongod --version`)
- ✅ npm v8+ (check: `npm --version`)

### Required Ports:
- ✅ 5000 (Backend)
- ✅ 3000 (Frontend)
- ✅ 27017 (MongoDB)

---

## Error Messages Explained

### "ECONNREFUSED"
Backend is not running. Start it with `npm run dev` in backend folder.

### "MongooseServerSelectionError"
MongoDB is not running. Start it with `net start MongoDB`.

### "Invalid credentials"
Wrong email/password or database not seeded. Run `node seed.js`.

### "Cannot find module"
Dependencies not installed. Run `npm install`.

### "Port 5000 already in use"
Another app is using port 5000. Change PORT in backend/.env file.

---

## Complete Reset

If nothing works, do a complete reset:

```bash
# 1. Stop all servers (Ctrl+C)

# 2. Delete node_modules
cd backend
rmdir /s /q node_modules
del package-lock.json

cd ../frontend
rmdir /s /q node_modules
del package-lock.json

# 3. Reinstall everything
cd ../backend
npm install

cd ../frontend
npm install

# 4. Reset database
cd ../backend
node seed.js

# 5. Start fresh
npm run dev  # in backend
npm run dev  # in frontend (new terminal)
```

---

## Contact Support

If you still have issues:
1. Check all steps above
2. Look at terminal error messages
3. Check browser console (F12)
4. Verify MongoDB is running
5. Verify ports are available

---

## Success Checklist

- [ ] MongoDB is running
- [ ] Backend dependencies installed
- [ ] Frontend dependencies installed
- [ ] Database seeded
- [ ] Backend running on port 5000
- [ ] Frontend running on port 3000
- [ ] Can access http://localhost:3000
- [ ] Login page loads
- [ ] Can login with demo credentials

If all checked, login should work! ✅
