# 🔧 LOGIN FIX - Quick Solution

## ⚡ ONE-CLICK FIX

**Just run this:**
```bash
FIX_AND_START.bat
```

This will:
1. ✅ Check MongoDB
2. ✅ Install dependencies
3. ✅ Seed database
4. ✅ Start both servers

---

## 🚀 Manual Fix (3 Steps)

### Step 1: Start MongoDB
```bash
net start MongoDB
```

### Step 2: Setup & Seed
```bash
cd backend
npm install
node seed.js
npm run dev
```

### Step 3: Start Frontend (New Terminal)
```bash
cd frontend
npm install
npm run dev
```

---

## 🔑 Login Credentials

After setup, use these:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@school.com | admin123 |
| Staff | staff@school.com | staff123 |
| Student | student@school.com | student123 |

---

## ✅ Verify It Works

1. Backend running: http://localhost:5000
2. Frontend running: http://localhost:3000
3. Login page loads
4. Enter credentials above
5. Click Login
6. Should redirect to dashboard ✨

---

## ❌ Still Not Working?

See **TROUBLESHOOTING.md** for detailed solutions.

Quick checks:
- [ ] MongoDB running? (`CHECK_MONGODB.bat`)
- [ ] Backend running? (Terminal shows "Server running on port 5000")
- [ ] Frontend running? (Terminal shows "Local: http://localhost:3000")
- [ ] Database seeded? (Run `node seed.js` in backend folder)

---

## 🆘 Common Errors

**"Cannot connect to server"**
→ Backend not running. Run `npm run dev` in backend folder.

**"Invalid credentials"**
→ Database not seeded. Run `node seed.js` in backend folder.

**"MongoDB connection error"**
→ MongoDB not running. Run `net start MongoDB`.

---

**Need more help?** Check TROUBLESHOOTING.md
