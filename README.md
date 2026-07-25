# LeadFlow — Lead Management Platform

LeadFlow is a full-stack lead management platform designed for small sales teams to capture, organize, assign, and track leads throughout the sales lifecycle.

The platform provides a public lead capture form along with an authenticated CRM application where Admins and Members have different permissions.

---

## 🚀 Live Application

**Frontend:**
https://garima-leadflow.netlify.app

**Backend API:**
https://leadflow-backend-h31u.onrender.com

**API Health Check:**
https://leadflow-backend-h31u.onrender.com/api/health

---

## 📌 Project Overview

LeadFlow manages the complete lead lifecycle from initial capture to conversion.

The platform supports:

* Public lead capture
* User authentication
* Role-based access control
* Admin and Member roles
* Lead creation and management
* Lead assignment
* Lead status pipeline
* Notes with timestamps
* Follow-ups
* Activity history
* Search and filtering
* Pagination
* Dashboard statistics
* Responsive design
* RESTful JSON API

---

## 🛠️ Tech Stack

### Frontend

* React.js
* React Router
* Axios
* CSS
* Vite

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* bcryptjs
* Helmet
* Morgan
* CORS

### Deployment

* Frontend: Netlify
* Backend: Render
* Database: MongoDB Atlas

---

# 👥 User Roles & Permissions

LeadFlow supports two roles:

## 🔐 Admin

Admins have full access to the lead management system.

Admin capabilities:

* Login to the CRM
* View all leads
* Create leads
* Update leads
* Delete leads
* Assign leads to Members
* View dashboard statistics
* Manage team members
* View lead notes
* Add notes
* View activities
* Create and manage follow-ups
* Update lead status

---

## 👤 Member

Members have restricted access to leads assigned to them.

Member capabilities:

* Login to the CRM
* View assigned leads
* View lead details
* Update assigned leads
* Add notes
* View activity history
* Create follow-ups
* Update lead status

Members cannot:

* View other Members' assigned leads
* Assign leads
* Delete leads
* Access Admin-only functionality
* Manage team members

Permissions are enforced on both the frontend and backend.

---

# 🔄 Lead Lifecycle

Leads move through the following status pipeline:

```text
NEW
  ↓
CONTACTED
  ↓
QUALIFIED
  ↓
WON

or

LOST
```

Each lead can contain:

* Name
* Email
* Phone
* Company
* Status
* Source
* Assigned Member
* Notes
* Follow-ups
* Activity history
* Creation timestamp

---

# 🌐 Public Lead Capture

Visitors can submit their information through the public LeadFlow landing page.

The public form collects:

* Full Name
* Email
* Phone
* Company
* Message

Submitted leads are added to the CRM and can later be assigned to a sales team member.

---

# 🔑 Authentication

LeadFlow uses JWT-based authentication.

Authentication flow:

```text
User Login
    ↓
Backend validates credentials
    ↓
Password verified using bcrypt
    ↓
JWT token generated
    ↓
Token stored on frontend
    ↓
Token sent with protected API requests
```

Protected routes require a valid JWT token.

The backend also verifies the user's role before allowing access to restricted operations.

---

# 🔒 Authorization

Authorization is enforced at the server level.

### Admin-only operations

```text
Assign Lead
Delete Lead
Manage Team
View All Leads
```

### Member restrictions

Members can only access leads assigned to their account.

For example:

```text
Member A
    ↓
Can access Lead 1
Can access Lead 2

Cannot access Lead 3
if Lead 3 belongs to Member B
```

This prevents users from bypassing frontend restrictions and accessing unauthorized data directly through the API.

---

# 📊 Lead Management

The Leads page provides:

* Lead listing
* Search
* Status filtering
* Pagination
* Lead assignment information
* Lead creation date
* Lead status
* Lead details

Search supports prefix-based matching across:

* Name
* Email
* Company

For example:

```text
Search: g
```

Matches values beginning with `g`.

```text
Search: ga
```

Matches values beginning with `ga`.

Search is case-insensitive.

---

# 📝 Notes & Activity Tracking

Each lead can maintain a history of interactions.

The system supports:

* Notes
* Follow-ups
* Activity history
* Status changes
* Lead creation activity
* Lead assignment activity

Activities are timestamped and associated with the relevant lead.

This provides a clear history of how each lead has progressed through the sales pipeline.

---

# 📅 Follow-ups

Users can create follow-ups for leads.

Follow-ups can be used to track future actions such as:

* Phone calls
* Emails
* Meetings
* Product demonstrations
* Sales activities

Follow-ups can also be marked as completed.

---

# 📡 REST API Documentation

Base URL:

```text
https://leadflow-backend-h31u.onrender.com/api
```

---

## Authentication APIs

### Register User

```http
POST /auth/register
```

Creates a new user account.

### Request Body

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Password@123"
}
```

---

### Login

```http
POST /auth/login
```

Authenticates a user and returns a JWT token.

### Request Body

```json
{
  "email": "admin@leadflow.com",
  "password": "Admin@12345"
}
```

---

### Get Current User

```http
GET /auth/me
```

Requires:

```http
Authorization: Bearer <JWT_TOKEN>
```

Returns the currently authenticated user.

---

# 📋 Lead APIs

All protected lead APIs require:

```http
Authorization: Bearer <JWT_TOKEN>
```

---

### Get Leads

```http
GET /leads
```

Supports pagination, filtering, assignment filtering, and search.

### Query Parameters

```text
page
limit
status
assignedTo
search
```

Example:

```http
GET /leads?page=1&limit=10
```

Search example:

```http
GET /leads?search=ga
```

Status filter:

```http
GET /leads?status=QUALIFIED
```

Assignment filter:

```http
GET /leads?assignedTo=<USER_ID>
```

---

### Create Lead

```http
POST /leads
```

Creates a new lead.

Example request:

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+91 9876543210",
  "company": "Example Company",
  "source": "Website"
}
```

---

### Get Lead by ID

```http
GET /leads/:id
```

Returns details of a specific lead.

Members can only access leads assigned to them.

---

### Update Lead

```http
PUT /leads/:id
```

Updates lead information.

Supported fields include:

```text
name
email
phone
company
status
source
```

Example:

```json
{
  "status": "QUALIFIED"
}
```

---

### Assign Lead

```http
PATCH /leads/:id/assign
```

Admin-only operation.

Assigns a lead to a valid Member.

Example:

```json
{
  "assignedTo": "<MEMBER_ID>"
}
```

---

### Delete Lead

```http
DELETE /leads/:id
```

Admin-only operation.

Deletes a lead from the system.

---

# 📝 Notes APIs

Notes are associated with individual leads.

Typical operations include:

```text
Create Note
Get Lead Notes
```

Notes include timestamps and are linked to the relevant lead.

---

# 📅 Follow-up APIs

The application supports:

```text
Create Follow-up
Get Lead Follow-ups
Complete Follow-up
```

Follow-ups are associated with individual leads and track future sales activities.

---

# 📈 Dashboard API

```http
GET /dashboard
```

Returns dashboard information and lead statistics for the authenticated user.

The dashboard provides visibility into the lead pipeline and sales activity.

---

# 👥 User APIs

Admin users can access team-related functionality through the user APIs.

These APIs support team management and retrieving available Members for lead assignment.

---

# ❤️ Health Check

The backend provides a health check endpoint:

```http
GET /api/health
```

Response:

```json
{
  "success": true,
  "message": "LeadFlow API is running"
}
```

---

# 📁 Project Structure

```text
LeadFlow/
│
├── backend/
│   │
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── validators/
│   │   ├── app.js
│   │   └── server.js
│   │
│   ├── seed.js
│   ├── package.json
│   └── .gitignore
│
├── frontend/
│   │
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── styles/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── package.json
│   └── .gitignore
│
└── .gitignore
```

---

# ⚙️ Local Development Setup

## 1. Clone the Repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
```

Navigate into the project:

```bash
cd LeadFlow
```

---

## 2. Backend Setup

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:5173
```

Start the backend:

```bash
npm run dev
```

Or:

```bash
npm start
```

Backend runs on:

```text
http://localhost:5000
```

---

## 3. Frontend Setup

Open another terminal:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file if required:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

---

# 🌍 Deployment

## Frontend

The React frontend is deployed using Netlify.

```text
https://garima-leadflow.netlify.app
```

The frontend communicates with the deployed Render backend through the `VITE_API_URL` environment variable.

---

## Backend

The Node.js and Express backend is deployed using Render.

```text
https://leadflow-backend-h31u.onrender.com
```

The backend uses environment variables for:

* MongoDB connection
* JWT secret
* Frontend CORS origin
* Server configuration

---

## Database

MongoDB Atlas is used as the production database.

The MongoDB connection string is stored securely in the backend environment variables and is not committed to GitHub.

---

# 🔐 Demo Credentials

## Admin

```text
Email: admin@leadflow.com
Password: Admin@12345
Role: ADMIN
```

## Member

```text
Email: member@leadflow.com
Password: Member@12345
Role: MEMBER
```

> These credentials are provided for evaluation of the deployed application.

---

# 🛡️ Security

The application includes:

* JWT authentication
* Password hashing with bcrypt
* Role-based authorization
* Protected API routes
* Member-level lead access control
* Input validation
* Helmet security middleware
* CORS configuration
* Environment variables for sensitive configuration
* `.env` excluded from Git
* `node_modules` excluded from Git

Sensitive credentials and database connection strings are not stored in the public repository.

---

# 📱 Responsive Design

LeadFlow is designed to work across:

* Desktop
* Laptop
* Tablet
* Mobile

The dashboard layout adapts to smaller screens with a responsive navigation experience.

---

# 🎯 Assignment Requirements Coverage

| Requirement               | Status          |
| ------------------------- | --------------- |
| Public lead capture form  | ✅               |
| Authenticated application | ✅               |
| Admin role                | ✅               |
| Member role               | ✅               |
| Client-side permissions   | ✅               |
| Server-side permissions   | ✅               |
| Lead status pipeline      | ✅               |
| Lead assignment           | ✅               |
| Notes with timestamps     | ✅               |
| Activity trail            | ✅               |
| JSON REST API             | ✅               |
| Pagination                | ✅               |
| Filtering                 | ✅               |
| Search                    | ✅               |
| Proper HTTP status codes  | ✅               |
| Responsive UI             | ✅               |
| Frontend deployment       | ✅               |
| Backend deployment        | ✅               |
| API documentation         | ✅               |
| Automated tests           | ⚠️ Not included |
| Public GitHub repository  | ✅               |

---

# 👩‍💻 Author

**Garima Singla**

Software Engineer

Built as part of the Digital Heroes Training Task.

---

# 📄 License

This project was created for educational and evaluation purposes.
