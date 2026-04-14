# TaskFlow — Scalable REST API with Auth & RBAC

A production-ready, scalable REST API built with **Node.js + Express + Sequelize (PostgreSQL)**, featuring JWT authentication, role-based access control, CRUD task management, and a **React** frontend dashboard.

---

## 🏗️ Architecture

```
scalable-rest-api/
├── backend/                  # Node.js + Express REST API
│   ├── config/               # Database configuration
│   ├── controllers/          # Route handlers
│   ├── docs/                 # Swagger/OpenAPI spec
│   ├── middleware/           # Auth, RBAC, validation, error handling, rate limiting
│   ├── models/               # Sequelize models (User, Task)
│   ├── routes/               # Express route definitions
│   ├── services/             # Business logic layer
│   ├── utils/                # Logger (Winston), ApiError class
│   ├── app.js                # Express app setup
│   └── server.js             # Entry point
├── frontend/                 # React + Vite SPA
│   └── src/
│       ├── components/       # Navbar, TaskForm, TaskList, ProtectedRoute
│       ├── context/          # AuthContext (state management)
│       ├── pages/            # Login, Register, Dashboard
│       └── services/         # Axios API client
└── README.md
```

## ✨ Features

### Authentication & Security
- ✅ JWT-based authentication with 24h expiration
- ✅ Password hashing with bcrypt (10 salt rounds)
- ✅ Secure token handling via Authorization header
- ✅ Rate limiting (100 req/15min general, 20 req/15min auth)
- ✅ Helmet security headers
- ✅ CORS configuration
- ✅ Input validation with Zod
- ✅ Centralized error handling

### Role-Based Access Control
- ✅ **User** role: CRUD on own tasks only
- ✅ **Admin** role: View/manage all users and all tasks

### CRUD API (Tasks)
- ✅ Create, Read, Update, Delete tasks
- ✅ Task ownership enforcement
- ✅ Status tracking (pending, in_progress, completed)
- ✅ Timestamps (createdAt, updatedAt)

### Frontend
- ✅ Register / Login pages
- ✅ Protected Dashboard with task stats
- ✅ Create, Edit, Delete tasks inline
- ✅ Success / Error message display
- ✅ Logout functionality
- ✅ Responsive dark theme UI

### Bonus Features
- ✅ Winston structured logging (console + file)
- ✅ Rate limiting with express-rate-limit
- ✅ Environment variable configuration
- ✅ Swagger API documentation

---

## 🛠️ Tech Stack

| Layer      | Technology                     |
|------------|--------------------------------|
| Runtime    | Node.js 18+                   |
| Framework  | Express.js 4.x                |
| Database   | PostgreSQL (Sequelize ORM)     |
| Auth       | JWT + bcrypt                   |
| Validation | Zod                            |
| Logging    | Winston                        |
| Docs       | Swagger UI (OpenAPI 3.0)       |
| Frontend   | React 18 + Vite                |
| HTTP       | Axios                          |
| Routing    | React Router 6                 |

---

## 🚀 Getting Started

### Prerequisites
- **Node.js 18+** installed
- **npm** or **yarn**

### 1. Clone / Navigate to project
```bash
cd scalable-rest-api
```

### 2. Setup Backend

```bash
cd backend

# Install dependencies
npm install

# Create .env file (copy from template)
copy .env.example .env
# Or on Linux/Mac: cp .env.example .env

# Start the server
npm run dev
```

The backend will start on **http://localhost:5000**

### 3. Setup Frontend

```bash
cd frontend

# Install dependencies
npm install

# Start the dev server
npm run dev
```

The frontend will start on **http://localhost:5173**

### 4. Open the App
- **Frontend**: http://localhost:5173
- **API Docs (Swagger)**: http://localhost:5000/api-docs
- **Health Check**: http://localhost:5000/health

---

## 🔐 Environment Variables

| Variable        | Default                                         | Description          |
|-----------------|--------------------------------------------------|----------------------|
| `PORT`          | `5000`                                           | Server port          |
| `NODE_ENV`      | `development`                                    | Environment          |
| `JWT_SECRET`    | (set in .env)                                    | JWT signing secret   |
| `JWT_EXPIRES_IN`| `24h`                                            | Token expiry         |

> **Note**: The project uses PostgreSQL. Ensure you have your PostgreSQL server running and the credentials in `.env` are correct before starting the backend.

---

## 📡 API Endpoints

### Authentication
| Method | Endpoint                  | Description           | Access  |
|--------|---------------------------|-----------------------|---------|
| POST   | `/api/v1/auth/register`   | Register new user     | Public  |
| POST   | `/api/v1/auth/login`      | Login user            | Public  |
| GET    | `/api/v1/auth/me`         | Get current profile   | Private |

### Tasks
| Method | Endpoint                  | Description           | Access        |
|--------|---------------------------|-----------------------|---------------|
| POST   | `/api/v1/tasks`           | Create task           | Private       |
| GET    | `/api/v1/tasks`           | Get tasks             | Private       |
| GET    | `/api/v1/tasks/:id`       | Get task by ID        | Private       |
| PUT    | `/api/v1/tasks/:id`       | Update task           | Private       |
| DELETE | `/api/v1/tasks/:id`       | Delete task           | Private       |

### Users (Admin Only)
| Method | Endpoint                  | Description           | Access        |
|--------|---------------------------|-----------------------|---------------|
| GET    | `/api/v1/users`           | List all users        | Admin         |
| GET    | `/api/v1/users/:id`       | Get user by ID        | Admin         |
| DELETE | `/api/v1/users/:id`       | Delete user           | Admin         |

### Swagger Documentation
Interactive API docs available at: **http://localhost:5000/api-docs**

---

## 📐 Database Schema

### Users
```sql
CREATE TABLE users (
  id        UUID PRIMARY KEY DEFAULT uuid_v4(),
  name      VARCHAR(100) NOT NULL,
  email     VARCHAR(255) NOT NULL UNIQUE,
  password  VARCHAR(255) NOT NULL,  -- bcrypt hashed
  role      ENUM('user', 'admin') DEFAULT 'user',
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW()
);
```

### Tasks
```sql
CREATE TABLE tasks (
  id          UUID PRIMARY KEY DEFAULT uuid_v4(),
  title       VARCHAR(200) NOT NULL,
  description TEXT,
  status      ENUM('pending', 'in_progress', 'completed') DEFAULT 'pending',
  userId      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  createdAt   TIMESTAMP DEFAULT NOW(),
  updatedAt   TIMESTAMP DEFAULT NOW()
);
```

---

## 📈 Scalability Notes

### Horizontal Scaling
- **Stateless API**: JWT tokens are self-contained — no server-side session storage needed. Any instance can verify any token, enabling easy horizontal scaling behind a load balancer.
- **Database**: PostgreSQL is configured and ready for production with connection pooling already configured out-of-the-box via Sequelize.

### Microservices Path
The modular architecture (controllers → services → models) makes it straightforward to extract services:
- **Auth Service**: Extract `authService` + User model into standalone microservice
- **Task Service**: Extract `taskService` + Task model into standalone microservice
- **API Gateway**: Use nginx/Kong to route traffic between services

### Load Balancing
- Deploy multiple API instances behind **nginx** or **AWS ALB**
- Round-robin or least-connections strategy
- Health check endpoint (`/health`) for load balancer probes

### Caching Strategy
- **Redis**: Add Redis for session caching, rate limiting state, and frequently-accessed data
- **Query caching**: Cache task lists per user with TTL-based invalidation
- **CDN**: Serve the React SPA from a CDN (CloudFront, Vercel)

### Performance Optimizations
- Database indexing on `userId`, `email` columns
- Request body size limits (10KB) to prevent abuse
- Connection pooling configured (max: 10 connections)
- Rate limiting to prevent DDoS

---

## 📝 License

This project is for educational and demonstration purposes.
