# 🎯 READ THIS FIRST - Login Fix

## ⚡ INSTANT FIX

### Run This Command:
```bash
FIX_AND_START.bat
```

**That's it!** The script will:
1. Check if MongoDB is running
2. Install backend dependencies
3. Install frontend dependencies  
4. Seed database with demo users
5. Start backend server (port 5000)
6. Start frontend app (port 3000)

---

## 🔑 Login After Setup

Open: **http://localhost:3000**

Use these credentials:

```
Admin Portal:
Email: admin@school.com
Password: admin123

Staff Portal:
Email: staff@school.com
Password: staff123

Student Portal:
Email: student@school.com
Password: student123
```

---

## ❌ If Login Still Fails

### Check 1: Is MongoDB Running?
```bash
CHECK_MONGODB.bat
```

If not running:
```bash
net start MongoDB
```

### Check 2: Are Servers Running?

**Backend should show:**
```
MongoDB Connected
Server running on port 5000
```

**Frontend should show:**
```
Local: http://localhost:3000
```

### Check 3: Is Database Seeded?
```bash
cd backend
node seed.js
```

---

## 🔧 Manual Setup (If Script Fails)

### Terminal 1 - Backend:
```bash
cd backend
npm install
node seed.js
npm run dev
```

### Terminal 2 - Frontend:
```bash
cd frontend
npm install
npm run dev
```

---

## 📚 More Help

- **Quick Fix**: LOGIN_FIX.md
- **Detailed Troubleshooting**: TROUBLESHOOTING.md
- **Full Setup Guide**: QUICKSTART.md
- **Complete Documentation**: README.md

---

## ✅ Success Checklist

Before trying to login, verify:

- [ ] MongoDB is running (`CHECK_MONGODB.bat`)
- [ ] Backend terminal shows "Server running on port 5000"
- [ ] Frontend terminal shows "Local: http://localhost:3000"
- [ ] Database was seeded (`node seed.js` completed)
- [ ] Can access http://localhost:3000 in browser
- [ ] Login page loads without errors

If all checked ✅, login will work!

---

## 🆘 Common Error Messages

| Error | Solution |
|-------|----------|
| "Cannot connect to server" | Backend not running - run `npm run dev` in backend folder |
| "Invalid credentials" | Database not seeded - run `node seed.js` in backend folder |
| "MongoDB connection error" | MongoDB not running - run `net start MongoDB` |
| "Module not found" | Dependencies not installed - run `npm install` |
| "Port already in use" | Close other apps using ports 3000 or 5000 |

---

## 🎉 What You Get

After successful login:

**Admin Dashboard:**
- Manage students and staff
- View all attendance and marks
- Create announcements
- Assign subjects

**Staff Dashboard:**
- Add/update student marks
- Mark attendance
- Upload study materials
- Changes sync in real-time to students

**Student Dashboard:**
- View marks (updates instantly)
- Check attendance
- Download materials
- View timetable and announcements

---

## 💡 Pro Tips

1. **Keep both terminals open** (backend + frontend)
2. **Don't close MongoDB** while using the app
3. **Use Chrome DevTools** (F12) to see any errors
4. **Test real-time updates** by opening two browsers:
   - Browser 1: Login as Staff, update a mark
   - Browser 2: Login as Student, see mark update instantly!

---

## 🚀 You're Ready!

Run `FIX_AND_START.bat` and start exploring the School ERP system!

**Need help?** Check TROUBLESHOOTING.md for detailed solutions.
