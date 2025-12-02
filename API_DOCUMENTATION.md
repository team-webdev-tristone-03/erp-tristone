# API Documentation

Base URL: `http://localhost:5000/api`

## Authentication

All protected routes require JWT token in Authorization header:
```
Authorization: Bearer <token>
```

### POST /auth/login
Login user and get JWT token

**Request Body:**
```json
{
  "email": "admin@school.com",
  "password": "admin123",
  "role": "admin"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "64f5a1b2c3d4e5f6g7h8i9j0",
    "name": "Admin User",
    "email": "admin@school.com",
    "role": "admin"
  }
}
```

### GET /auth/me
Get current logged-in user

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "_id": "64f5a1b2c3d4e5f6g7h8i9j0",
  "name": "Admin User",
  "email": "admin@school.com",
  "role": "admin"
}
```

---

## Users

### GET /users
Get all users (with optional filters)

**Query Parameters:**
- `role` (optional): Filter by role (admin, staff, student)
- `search` (optional): Search by name or email

**Example:** `/users?role=student&search=alice`

**Response:**
```json
[
  {
    "_id": "64f5a1b2c3d4e5f6g7h8i9j0",
    "name": "Alice Johnson",
    "email": "student@school.com",
    "role": "student",
    "class": "10",
    "section": "A",
    "rollNumber": "101"
  }
]
```

### GET /users/:id
Get single user by ID

**Response:**
```json
{
  "_id": "64f5a1b2c3d4e5f6g7h8i9j0",
  "name": "Alice Johnson",
  "email": "student@school.com",
  "role": "student",
  "class": "10",
  "section": "A",
  "rollNumber": "101",
  "subjects": [...]
}
```

### POST /users
Create new user (Admin only)

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@school.com",
  "password": "password123",
  "role": "student",
  "class": "10",
  "section": "A",
  "rollNumber": "105"
}
```

### PUT /users/:id
Update user (Admin only)

**Request Body:**
```json
{
  "name": "John Doe Updated",
  "phone": "1234567890"
}
```

### DELETE /users/:id
Delete user (Admin only)

**Response:**
```json
{
  "message": "User deleted"
}
```

---

## Subjects

### GET /subjects
Get all subjects

**Response:**
```json
[
  {
    "_id": "64f5a1b2c3d4e5f6g7h8i9j0",
    "name": "Mathematics",
    "code": "MATH101",
    "class": "10",
    "teacher": {
      "_id": "...",
      "name": "John Teacher"
    }
  }
]
```

### POST /subjects
Create subject (Admin only)

**Request Body:**
```json
{
  "name": "Mathematics",
  "code": "MATH101",
  "class": "10",
  "teacher": "64f5a1b2c3d4e5f6g7h8i9j0"
}
```

### PUT /subjects/:id
Update subject (Admin only)

### DELETE /subjects/:id
Delete subject (Admin only)

---

## Attendance

### GET /attendance
Get attendance records

**Query Parameters:**
- `student` (optional): Filter by student ID
- `date` (optional): Filter by specific date
- `startDate` & `endDate` (optional): Filter by date range

**Example:** `/attendance?student=64f5a1b2c3d4e5f6g7h8i9j0`

**Response:**
```json
[
  {
    "_id": "64f5a1b2c3d4e5f6g7h8i9j0",
    "student": {
      "_id": "...",
      "name": "Alice Johnson"
    },
    "date": "2024-01-15T00:00:00.000Z",
    "status": "present",
    "subject": {
      "_id": "...",
      "name": "Mathematics"
    }
  }
]
```

### POST /attendance
Create attendance record (Admin/Staff only)

**Request Body:**
```json
{
  "student": "64f5a1b2c3d4e5f6g7h8i9j0",
  "date": "2024-01-15",
  "status": "present",
  "subject": "64f5a1b2c3d4e5f6g7h8i9j0"
}
```

**Note:** This triggers a WebSocket event `attendanceUpdate`

### PUT /attendance/:id
Update attendance (Admin/Staff only)

**Note:** This triggers a WebSocket event `attendanceUpdate`

### DELETE /attendance/:id
Delete attendance (Admin/Staff only)

---

## Marks

### GET /marks
Get marks

**Query Parameters:**
- `student` (optional): Filter by student ID
- `subject` (optional): Filter by subject ID

**Response:**
```json
[
  {
    "_id": "64f5a1b2c3d4e5f6g7h8i9j0",
    "student": {
      "_id": "...",
      "name": "Alice Johnson"
    },
    "subject": {
      "_id": "...",
      "name": "Mathematics"
    },
    "examType": "Midterm",
    "marks": 85,
    "totalMarks": 100,
    "grade": "A"
  }
]
```

### POST /marks
Create marks (Admin/Staff only)

**Request Body:**
```json
{
  "student": "64f5a1b2c3d4e5f6g7h8i9j0",
  "subject": "64f5a1b2c3d4e5f6g7h8i9j0",
  "examType": "Midterm",
  "marks": 85,
  "totalMarks": 100,
  "grade": "A"
}
```

**Note:** This triggers a WebSocket event `markUpdate`

### PUT /marks/:id
Update marks (Admin/Staff only)

**Note:** This triggers a WebSocket event `markUpdate`

### DELETE /marks/:id
Delete marks (Admin/Staff only)

---

## Materials

### GET /materials
Get study materials

**Query Parameters:**
- `class` (optional): Filter by class
- `subject` (optional): Filter by subject ID

**Response:**
```json
[
  {
    "_id": "64f5a1b2c3d4e5f6g7h8i9j0",
    "title": "Mathematics Chapter 1",
    "description": "Introduction to Algebra",
    "fileUrl": "https://example.com/file.pdf",
    "subject": {
      "_id": "...",
      "name": "Mathematics"
    },
    "uploadedBy": {
      "_id": "...",
      "name": "John Teacher"
    },
    "class": "10"
  }
]
```

### POST /materials
Upload material (Admin/Staff only)

**Request Body:**
```json
{
  "title": "Mathematics Chapter 1",
  "description": "Introduction to Algebra",
  "fileUrl": "https://example.com/file.pdf",
  "subject": "64f5a1b2c3d4e5f6g7h8i9j0",
  "class": "10"
}
```

### DELETE /materials/:id
Delete material (Admin/Staff only)

---

## Announcements

### GET /announcements
Get announcements

**Query Parameters:**
- `targetRole` (optional): Filter by target role

**Response:**
```json
[
  {
    "_id": "64f5a1b2c3d4e5f6g7h8i9j0",
    "title": "Welcome to New Academic Year",
    "content": "We wish all students a great year ahead!",
    "targetRole": "all",
    "createdBy": {
      "_id": "...",
      "name": "Admin User"
    },
    "createdAt": "2024-01-15T00:00:00.000Z"
  }
]
```

### POST /announcements
Create announcement (Admin/Staff only)

**Request Body:**
```json
{
  "title": "Important Notice",
  "content": "School will remain closed tomorrow.",
  "targetRole": "all"
}
```

### DELETE /announcements/:id
Delete announcement (Admin only)

---

## Timetable

### GET /timetable
Get timetable

**Query Parameters:**
- `class` (optional): Filter by class
- `section` (optional): Filter by section

**Response:**
```json
[
  {
    "_id": "64f5a1b2c3d4e5f6g7h8i9j0",
    "class": "10",
    "section": "A",
    "day": "Monday",
    "periods": [
      {
        "time": "9:00 AM - 10:00 AM",
        "subject": {
          "_id": "...",
          "name": "Mathematics"
        },
        "teacher": {
          "_id": "...",
          "name": "John Teacher"
        }
      }
    ]
  }
]
```

### POST /timetable
Create timetable (Admin only)

**Request Body:**
```json
{
  "class": "10",
  "section": "A",
  "day": "Monday",
  "periods": [
    {
      "time": "9:00 AM - 10:00 AM",
      "subject": "64f5a1b2c3d4e5f6g7h8i9j0",
      "teacher": "64f5a1b2c3d4e5f6g7h8i9j0"
    }
  ]
}
```

### PUT /timetable/:id
Update timetable (Admin only)

---

## Dashboard

### GET /dashboard/admin
Get admin statistics (Admin only)

**Response:**
```json
{
  "totalStudents": 150,
  "totalStaff": 25,
  "totalClasses": 10,
  "presentToday": 142
}
```

### GET /dashboard/student
Get student statistics (Student only)

**Response:**
```json
{
  "attendancePercentage": "92.50",
  "averageMarks": "85.75",
  "totalSubjects": 6
}
```

---

## WebSocket Events

Connect to: `http://localhost:5000`

### Events Emitted by Server:

**markUpdate**
Emitted when marks are created or updated
```javascript
socket.on('markUpdate', (data) => {
  console.log('Mark updated:', data);
});
```

**attendanceUpdate**
Emitted when attendance is created or updated
```javascript
socket.on('attendanceUpdate', (data) => {
  console.log('Attendance updated:', data);
});
```

---

## Error Responses

All endpoints may return these error responses:

**401 Unauthorized:**
```json
{
  "message": "Not authorized"
}
```

**403 Forbidden:**
```json
{
  "message": "Access denied"
}
```

**404 Not Found:**
```json
{
  "message": "Resource not found"
}
```

**400 Bad Request:**
```json
{
  "message": "Validation error message"
}
```

**500 Internal Server Error:**
```json
{
  "message": "Server error message"
}
```
