# School ERP System Architecture

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT SIDE                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │    Admin     │  │    Staff     │  │   Student    │          │
│  │   Portal     │  │   Portal     │  │   Portal     │          │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘          │
│         │                  │                  │                   │
│         └──────────────────┴──────────────────┘                  │
│                            │                                      │
│                   ┌────────▼────────┐                            │
│                   │  React Router   │                            │
│                   │  (Navigation)   │                            │
│                   └────────┬────────┘                            │
│                            │                                      │
│         ┌──────────────────┼──────────────────┐                 │
│         │                  │                  │                  │
│    ┌────▼─────┐    ┌──────▼──────┐    ┌─────▼────┐            │
│    │  Auth    │    │   Socket    │    │   API    │            │
│    │ Context  │    │  Context    │    │ Service  │            │
│    └──────────┘    └──────────────┘    └──────────┘            │
│                                                                   │
└───────────────────────────┬───────────────────────────────────┘
                            │
                            │ HTTP/WebSocket
                            │
┌───────────────────────────▼───────────────────────────────────┐
│                        SERVER SIDE                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│                   ┌────────────────┐                             │
│                   │  Express.js    │                             │
│                   │    Server      │                             │
│                   └────────┬───────┘                             │
│                            │                                      │
│         ┌──────────────────┼──────────────────┐                 │
│         │                  │                  │                  │
│    ┌────▼─────┐    ┌──────▼──────┐    ┌─────▼────┐            │
│    │   JWT    │    │  Socket.IO  │    │   CORS   │            │
│    │   Auth   │    │   Server    │    │          │            │
│    └──────────┘    └──────────────┘    └──────────┘            │
│                                                                   │
│                   ┌────────────────┐                             │
│                   │     Routes     │                             │
│                   └────────┬───────┘                             │
│                            │                                      │
│         ┌──────────────────┼──────────────────┐                 │
│         │                  │                  │                  │
│    ┌────▼─────┐    ┌──────▼──────┐    ┌─────▼────┐            │
│    │  Auth    │    │    User     │    │  Subject │            │
│    │Controller│    │ Controller  │    │Controller│            │
│    └──────────┘    └─────────────┘    └──────────┘            │
│                                                                   │
│    ┌──────────┐    ┌─────────────┐    ┌──────────┐            │
│    │Attendance│    │    Mark     │    │ Material │            │
│    │Controller│    │ Controller  │    │Controller│            │
│    └──────────┘    └─────────────┘    └──────────┘            │
│                                                                   │
│                   ┌────────────────┐                             │
│                   │   Middleware   │                             │
│                   │  (Auth/RBAC)   │                             │
│                   └────────┬───────┘                             │
│                            │                                      │
│                   ┌────────▼───────┐                             │
│                   │    Models      │                             │
│                   │   (Mongoose)   │                             │
│                   └────────┬───────┘                             │
│                            │                                      │
└────────────────────────────┼─────────────────────────────────────┘
                             │
                             │
┌────────────────────────────▼─────────────────────────────────────┐
│                        DATABASE                                   │
├───────────────────────────────────────────────────────────────────┤
│                                                                    │
│                      MongoDB Database                             │
│                                                                    │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐        │
│  │  Users   │  │ Subjects │  │  Marks   │  │Attendance│        │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘        │
│                                                                    │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                       │
│  │Materials │  │Announce- │  │Timetable │                       │
│  │          │  │  ments   │  │          │                       │
│  └──────────┘  └──────────┘  └──────────┘                       │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

## Data Flow Diagrams

### 1. Authentication Flow

```
┌─────────┐         ┌─────────┐         ┌─────────┐         ┌─────────┐
│  User   │         │ React   │         │ Express │         │ MongoDB │
│ (Login) │         │  App    │         │ Server  │         │         │
└────┬────┘         └────┬────┘         └────┬────┘         └────┬────┘
     │                   │                   │                   │
     │ Enter Credentials │                   │                   │
     ├──────────────────>│                   │                   │
     │                   │                   │                   │
     │                   │ POST /api/auth/login                 │
     │                   ├──────────────────>│                   │
     │                   │                   │                   │
     │                   │                   │ Find User         │
     │                   │                   ├──────────────────>│
     │                   │                   │                   │
     │                   │                   │ User Data         │
     │                   │                   │<──────────────────┤
     │                   │                   │                   │
     │                   │                   │ Verify Password   │
     │                   │                   │ Generate JWT      │
     │                   │                   │                   │
     │                   │ JWT Token + User  │                   │
     │                   │<──────────────────┤                   │
     │                   │                   │                   │
     │                   │ Store Token       │                   │
     │                   │ Update Context    │                   │
     │                   │                   │                   │
     │ Redirect to       │                   │                   │
     │ Dashboard         │                   │                   │
     │<──────────────────┤                   │                   │
     │                   │                   │                   │
```

### 2. Real-Time Mark Update Flow

```
┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐
│  Staff  │    │ React   │    │ Express │    │Socket.IO│    │ Student │
│  User   │    │  App    │    │ Server  │    │ Server  │    │ Browser │
└────┬────┘    └────┬────┘    └────┬────┘    └────┬────┘    └────┬────┘
     │              │              │              │              │
     │ Update Mark  │              │              │              │
     ├─────────────>│              │              │              │
     │              │              │              │              │
     │              │ PUT /api/marks/:id          │              │
     │              ├─────────────>│              │              │
     │              │              │              │              │
     │              │              │ Update DB    │              │
     │              │              │              │              │
     │              │              │ Emit Event   │              │
     │              │              ├─────────────>│              │
     │              │              │              │              │
     │              │              │              │ Broadcast    │
     │              │              │              ├─────────────>│
     │              │              │              │              │
     │              │              │              │ Update UI    │
     │              │              │              │ (Real-time)  │
     │              │              │              │              │
     │              │ Success      │              │              │
     │              │<─────────────┤              │              │
     │              │              │              │              │
     │ Confirmation │              │              │              │
     │<─────────────┤              │              │              │
     │              │              │              │              │
```

### 3. Role-Based Access Control Flow

```
┌─────────┐         ┌─────────┐         ┌─────────┐
│  User   │         │  Auth   │         │  Route  │
│ Request │         │Middleware│        │ Handler │
└────┬────┘         └────┬────┘         └────┬────┘
     │                   │                   │
     │ API Request       │                   │
     │ + JWT Token       │                   │
     ├──────────────────>│                   │
     │                   │                   │
     │                   │ Verify JWT        │
     │                   │                   │
     │                   │ Extract User      │
     │                   │                   │
     │                   │ Check Role        │
     │                   │                   │
     │                   ├──────────────────>│
     │                   │                   │
     │                   │                   │ Process Request
     │                   │                   │
     │                   │ Response          │
     │                   │<──────────────────┤
     │                   │                   │
     │ Response          │                   │
     │<──────────────────┤                   │
     │                   │                   │
```

## Component Hierarchy

### Frontend Component Tree

```
App
├── AuthProvider
│   └── SocketProvider
│       └── BrowserRouter
│           └── Routes
│               ├── Login
│               ├── Admin Routes
│               │   ├── AdminDashboard
│               │   │   ├── Sidebar
│               │   │   ├── Navbar
│               │   │   ├── Card (x4)
│               │   │   └── BarChart
│               │   ├── AdminStudents
│               │   │   ├── Sidebar
│               │   │   ├── Navbar
│               │   │   ├── Table
│               │   │   └── Modal
│               │   ├── AdminStaff
│               │   ├── AdminSubjects
│               │   ├── AdminAttendance
│               │   ├── AdminMarks
│               │   └── AdminAnnouncements
│               ├── Staff Routes
│               │   ├── StaffDashboard
│               │   ├── StaffMarks
│               │   ├── StaffAttendance
│               │   └── StaffMaterials
│               └── Student Routes
│                   ├── StudentDashboard
│                   ├── StudentMarks
│                   ├── StudentAttendance
│                   ├── StudentMaterials
│                   ├── StudentTimetable
│                   └── StudentAnnouncements
```

## Database Schema Relationships

```
┌──────────────┐
│    User      │
│──────────────│
│ _id          │◄──────────┐
│ name         │           │
│ email        │           │
│ password     │           │
│ role         │           │
│ subjects[]   │───┐       │
└──────────────┘   │       │
                   │       │
┌──────────────┐   │       │
│   Subject    │   │       │
│──────────────│   │       │
│ _id          │◄──┘       │
│ name         │           │
│ code         │           │
│ teacher      │───────────┘
└──────────────┘

┌──────────────┐
│  Attendance  │
│──────────────│
│ _id          │
│ student      │───────────┐
│ date         │           │
│ status       │           │
│ subject      │───┐       │
└──────────────┘   │       │
                   │       │
                   │       │
┌──────────────┐   │       │
│    Mark      │   │       │
│──────────────│   │       │
│ _id          │   │       │
│ student      │───┼───────┘
│ subject      │───┘
│ examType     │
│ marks        │
│ totalMarks   │
│ grade        │
└──────────────┘

┌──────────────┐
│  Material    │
│──────────────│
│ _id          │
│ title        │
│ fileUrl      │
│ subject      │───┐
│ uploadedBy   │───┼───────┐
│ class        │   │       │
└──────────────┘   │       │
                   │       │
┌──────────────┐   │       │
│ Announcement │   │       │
│──────────────│   │       │
│ _id          │   │       │
│ title        │   │       │
│ content      │   │       │
│ targetRole   │   │       │
│ createdBy    │───┼───────┘
└──────────────┘   │
                   │
┌──────────────┐   │
│  Timetable   │   │
│──────────────│   │
│ _id          │   │
│ class        │   │
│ section      │   │
│ day          │   │
│ periods[]    │   │
│  - time      │   │
│  - subject   │───┘
│  - teacher   │───────────┐
└──────────────┘           │
                           │
                           └──> References User
```

## API Request/Response Flow

```
Client Request
     │
     ▼
┌─────────────────┐
│  CORS Middleware│
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Body Parser     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Socket.IO       │
│ Attachment      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Route Handler   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Auth Middleware │ ◄── JWT Verification
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Authorization   │ ◄── Role Check
│ Middleware      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Controller     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Model/DB       │ ◄── MongoDB Query
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Socket Emit     │ ◄── Real-time Event
│ (if applicable) │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  JSON Response  │
└────────┬────────┘
         │
         ▼
    Client
```

## Security Layers

```
┌─────────────────────────────────────────┐
│         Application Security             │
├─────────────────────────────────────────┤
│                                          │
│  Layer 1: CORS Protection                │
│  ├─ Allowed Origins                      │
│  └─ Credential Handling                  │
│                                          │
│  Layer 2: JWT Authentication             │
│  ├─ Token Generation                     │
│  ├─ Token Verification                   │
│  └─ Token Expiration                     │
│                                          │
│  Layer 3: Password Security              │
│  ├─ bcrypt Hashing                       │
│  ├─ Salt Rounds: 10                      │
│  └─ Pre-save Hook                        │
│                                          │
│  Layer 4: Role-Based Access Control      │
│  ├─ Admin: Full Access                   │
│  ├─ Staff: Limited Write Access          │
│  └─ Student: Read-Only Access            │
│                                          │
│  Layer 5: Input Validation               │
│  ├─ Mongoose Schema Validation           │
│  ├─ Required Fields                      │
│  └─ Data Type Checking                   │
│                                          │
└─────────────────────────────────────────┘
```

## Deployment Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Production Setup                      │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────────────┐         ┌──────────────────┐     │
│  │   Netlify/Vercel │         │  Heroku/AWS/DO   │     │
│  │   (Frontend)     │         │   (Backend)      │     │
│  │                  │         │                  │     │
│  │  React Build     │◄───────►│  Express Server  │     │
│  │  Static Files    │  HTTPS  │  + Socket.IO     │     │
│  └──────────────────┘         └────────┬─────────┘     │
│                                         │                │
│                                         │                │
│                                ┌────────▼─────────┐     │
│                                │  MongoDB Atlas   │     │
│                                │  (Cloud DB)      │     │
│                                └──────────────────┘     │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

This architecture ensures:
- ✅ Scalability
- ✅ Security
- ✅ Real-time capabilities
- ✅ Separation of concerns
- ✅ Maintainability
