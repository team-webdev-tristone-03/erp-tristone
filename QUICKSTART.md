# 🚀 Quick Start Guide

## Step-by-Step Instructions to Run the School ERP Application

### Step 1: Install MongoDB
If you don't have MongoDB installed:

**Windows:**
1. Download from https://www.mongodb.com/try/download/community
2. Install and start MongoDB service
3. Or use MongoDB Atlas (cloud) - https://www.mongodb.com/cloud/atlas

**macOS:**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Linux:**
```bash
sudo apt-get install mongodb
sudo systemctl start mongodb
```

### Step 2: Setup Backend

Open terminal in `school-erp/backend` folder:

```bash
# Install dependencies
npm install

# Seed database with sample data
node seed.js

# Start backend server
npm run dev
```

You should see:
```
MongoDB Connected
Server running on port 5000
```

### Step 3: Setup Frontend

Open a NEW terminal in `school-erp/frontend` folder:

```bash
# Install dependencies
npm install

# Start frontend
npm run dev
```

You should see:
```
Local: http://localhost:3000
```

### Step 4: Access the Application

Open your browser and go to: **http://localhost:3000**

### Step 5: Login with Demo Accounts

**Test Admin Features:**
- Email: `admin@school.com`
- Password: `admin123`
- Access: Full system control

**Test Staff Features:**
- Email: `staff@school.com`
- Password: `staff123`
- Access: Marks, Attendance, Materials

**Test Student Features:**
- Email: `student@school.com`
- Password: `student123`
- Access: View marks, attendance, materials

### Step 6: Test Real-Time Updates

1. Open two browser windows
2. Login as **Staff** in window 1
3. Login as **Student** in window 2
4. In Staff window: Go to "Marks" → Update a student's mark
5. In Student window: Watch the marks update INSTANTLY! ✨

## 🎯 What to Test

### As Admin:
- ✅ Add new students
- ✅ Add new staff members
- ✅ View dashboard statistics
- ✅ Search students

### As Staff:
- ✅ Add/Update student marks
- ✅ Mark attendance
- ✅ Upload study materials

### As Student:
- ✅ View your marks (updates in real-time)
- ✅ Check attendance
- ✅ View timetable
- ✅ Download materials
- ✅ Read announcements

## 🔧 Troubleshooting

**MongoDB Connection Error:**
```bash
# Check if MongoDB is running
# Windows:
net start MongoDB

# macOS/Linux:
sudo systemctl status mongod
```

**Port Already in Use:**
- Backend (5000): Change PORT in `backend/.env`
- Frontend (3000): Change port in `frontend/vite.config.js`

**Dependencies Error:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 📦 Project Structure Overview

```
school-erp/
├── backend/          # Node.js + Express API
│   ├── models/       # MongoDB schemas
│   ├── controllers/  # Business logic
│   ├── routes/       # API endpoints
│   └── server.js     # Entry point
│
└── frontend/         # React + Vite
    ├── src/
    │   ├── pages/    # All page components
    │   ├── components/ # Reusable components
    │   ├── context/  # Auth & Socket context
    │   └── services/ # API calls
    └── index.html
```

## 🎨 Tech Stack

**Frontend:**
- React 18
- React Router v6
- Tailwind CSS
- Recharts (for graphs)
- Socket.IO Client
- Axios

**Backend:**
- Node.js
- Express
- MongoDB + Mongoose
- JWT Authentication
- Socket.IO
- Bcrypt

## 📝 Sample Data Included

After running `node seed.js`, you get:
- 1 Admin user
- 1 Staff user
- 3 Student users
- 4 Subjects (Math, Physics, Chemistry, English)
- Sample attendance records
- Sample marks
- Study materials
- Announcements
- Timetable

## 🚀 Next Steps

1. Explore all three dashboards
2. Test CRUD operations
3. Verify real-time updates
4. Customize the UI
5. Add more features!

## 💡 Tips

- Keep both terminals running (backend + frontend)
- Use Chrome DevTools to see WebSocket connections
- Check browser console for any errors
- MongoDB Compass is great for viewing database

## 🎉 You're All Set!

The application is now running. Enjoy exploring the School ERP system!
