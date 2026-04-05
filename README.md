# 🚀 Finance Dashboard API

A scalable backend system for managing financial data with **role-based access control**, built as part of a backend engineering assessment.

This project demonstrates **backend architecture, clean API design, access control, data modeling, and aggregation logic** — focusing on how a real-world finance dashboard would be implemented.

---

## 🌐 Live API

Base URL:
  [(finance-dashboard-production-9ccf.up.railway.app](https://finance-dashboard-production-9ccf.up.railway.app)



---

## 🧠 Architecture Overview

The backend follows a **layered architecture** to ensure scalability and maintainability:

```
Request → Route → Controller → Service → Database (Prisma)
```

* **Routes**: Define API endpoints
* **Controllers**: Handle request & response lifecycle
* **Services**: Contain core business logic
* **Prisma ORM**: Handles database interactions

This separation of concerns ensures:

* Better code organization
* Easier testing and debugging
* Scalability for future features

---

## ⚙️ Tech Stack

* **Node.js + Express** — Backend framework
* **Prisma ORM** — Type-safe database access
* **SQLite** — Lightweight database (can be swapped to PostgreSQL)
* **JWT Authentication** — Secure access control
* **bcryptjs** — Password hashing
* **Zod** — Schema validation and input safety

---

## 🔐 Authentication & Authorization

### Authentication

* Implemented using **JWT tokens**
* Tokens expire in **7 days**
* Protected routes require:

```
Authorization: Bearer <token>
```

### Role-Based Access Control (RBAC)

Access control is enforced using middleware:

* **Authentication middleware** → verifies JWT
* **Authorization middleware** → checks user roles

Example:

```
authorizeRoles('ADMIN', 'ANALYST')
```

### Roles

| Role    | Description                           |
| ------- | ------------------------------------- |
| Viewer  | Read-only access                      |
| Analyst | Can create & update financial records |
| Admin   | Full access including user management |

---

## 📊 Core Features

### 1. User & Role Management

* Create and manage users
* Assign roles (Viewer, Analyst, Admin)
* Update user status (active/inactive)
* Restrict actions based on roles

---

### 2. Financial Records Management

Supports full lifecycle of transactions:

* Create, read, update, delete (soft delete)
* Fields:

  * Amount
  * Type (Income / Expense)
  * Category
  * Date
  * Notes

---

### 3. Dashboard Summary APIs

Efficient aggregation logic implemented at the database level:

* Total Income
* Total Expenses
* Net Balance
* Category-wise breakdown
* Monthly trends
* Recent activity

> Aggregations are handled via Prisma queries for better performance instead of in-memory processing.

---

### 4. Filtering, Search & Pagination

`GET /transactions` supports:

* Filter by type, category, date range
* Search in notes field
* Pagination for large datasets

Example:

```
GET /transactions?type=INCOME&category=Salary&page=1&limit=5
```

---

### 5. Data Validation & Error Handling

* Implemented using **Zod**
* Ensures:

  * Type safety
  * Consistent API responses
  * Protection against invalid input

Example error response:

```json
{
  "success": false,
  "message": "Amount is required"
}
```

---

## 📡 API Endpoints

### 🔑 Auth

| Method | Endpoint       | Description       |
| ------ | -------------- | ----------------- |
| POST   | /auth/register | Register user     |
| POST   | /auth/login    | Login & get token |

---

### 💰 Transactions

| Method | Endpoint          | Role                |
| ------ | ----------------- | ------------------- |
| GET    | /transactions     | All                 |
| POST   | /transactions     | Analyst, Admin      |
| PUT    | /transactions/:id | Analyst, Admin      |
| DELETE | /transactions/:id | Admin (Soft delete) |

---

### 📊 Dashboard

| Method | Endpoint           | Role |
| ------ | ------------------ | ---- |
| GET    | /dashboard/summary | All  |
| GET    | /dashboard/trends  | All  |

---

### 👤 Users

| Method | Endpoint          | Role  |
| ------ | ----------------- | ----- |
| GET    | /users            | Admin |
| PATCH  | /users/:id/role   | Admin |
| PATCH  | /users/:id/status | Admin |

---

## 📦 Sample Response

### GET /dashboard/summary

```json
{
  "totalIncome": 50000,
  "totalExpenses": 20000,
  "netBalance": 30000
}
```

---

## 🧪 Demo Credentials

* **Admin**: [admin@demo.com](mailto:admin@demo.com) / password123
* **Analyst**: [analyst@demo.com](mailto:analyst@demo.com) / password123
* **Viewer**: [viewer@demo.com](mailto:viewer@demo.com) / password123

---

## 🛠️ Setup & Installation

```bash
# Install dependencies
npm install

# Setup environment variables (.env)
DATABASE_URL="file:./dev.db"
JWT_SECRET="your_secret"
PORT=3000

# Run migrations
npx prisma migrate dev

# Seed database
npm run seed

# Start server
npm run dev
```

---

## 📁 Project Structure

```
src/
 ├── routes/
 ├── controllers/
 ├── services/
 ├── middleware/
 ├── prisma.js
 ├── app.js

prisma/
 ├── schema.prisma
 ├── seed.js
```

---

## ⚖️ Design Decisions & Tradeoffs

* **SQLite chosen** for simplicity and zero setup
  → Easily replaceable with PostgreSQL

* **Soft delete implemented**
  → Preserves historical financial data

* **Role assignment at registration**
  → Simplified for demo (admin-controlled in production)

* **JWT-based authentication**
  → Simple and scalable

* **Aggregation at DB level**
  → Improves performance and scalability

---

## 🔮 Future Improvements

* Refresh token authentication
* PostgreSQL for production-grade persistence
* Rate limiting & API security
* Caching dashboard responses
* Unit & integration testing
* Swagger / OpenAPI documentation

---

## 🧠 Key Takeaways

This project focuses on:

* Clean backend architecture
* Role-based access control design
* Efficient data aggregation
* Maintainable and scalable code structure

---

## 🙌 Final Note

This project is built as part of a backend engineering assessment to demonstrate **problem-solving, system design thinking, and practical backend skills**.

---
