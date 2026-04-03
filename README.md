# Finance Dashboard API

A backend REST API for a finance dashboard system with role-based access control, built with Node.js, Express, Prisma, and SQLite.

## Tech Stack
- Node.js + Express
- Prisma ORM + SQLite
- JWT Authentication
- bcryptjs for password hashing

## Setup and Installation

1. Clone the repository
2. Install dependencies
   npm install
3. Set up environment variables — create a .env file in the root
   DATABASE_URL="file:./dev.db"
   JWT_SECRET="supersecretkey123"
   PORT=3000
4. Run database migrations
   npx prisma migrate dev
5. Seed the database with demo data
   npm run seed
6. Start the server
   npm run dev

Server runs on http://localhost:3000

## Demo Credentials
- Admin:    admin@demo.com / password123
- Analyst:  analyst@demo.com / password123
- Viewer:   viewer@demo.com / password123

## Roles and Permissions

| Action                  | VIEWER | ANALYST | ADMIN |
|-------------------------|--------|---------|-------|
| View transactions       | yes    | yes     | yes   |
| View dashboard summary  | yes    | yes     | yes   |
| Create transactions     | no     | yes     | yes   |
| Update transactions     | no     | yes     | yes   |
| Delete transactions     | no     | no      | yes   |
| Manage users            | no     | no      | yes   |

## API Endpoints

### Auth
| Method | Endpoint        | Description        | Auth |
|--------|-----------------|--------------------|------|
| POST   | /auth/register  | Register a user    | No   |
| POST   | /auth/login     | Login and get token| No   |

### Transactions
| Method | Endpoint              | Description              | Role          |
|--------|-----------------------|--------------------------|---------------|
| GET    | /transactions         | Get all transactions     | All           |
| POST   | /transactions         | Create a transaction     | ANALYST, ADMIN|
| PUT    | /transactions/:id     | Update a transaction     | ANALYST, ADMIN|
| DELETE | /transactions/:id     | Soft delete transaction  | ADMIN         |

### Dashboard
| Method | Endpoint              | Description              | Role |
|--------|-----------------------|--------------------------|------|
| GET    | /dashboard/summary    | Get financial summary    | All  |
| GET    | /dashboard/trends     | Get monthly trends       | All  |

### Users
| Method | Endpoint              | Description              | Role  |
|--------|-----------------------|--------------------------|-------|
| GET    | /users                | Get all users            | ADMIN |
| PATCH  | /users/:id/role       | Update user role         | ADMIN |
| PATCH  | /users/:id/status     | Update user status       | ADMIN |

## Filtering and Pagination

GET /transactions supports query parameters:
- type: INCOME or EXPENSE
- category: e.g. Salary, Food
- startDate: e.g. 2026-01-01
- endDate: e.g. 2026-12-31
- search: search in notes field
- page: page number (default 1)
- limit: results per page (default 10)

Example:
GET /transactions?type=INCOME&category=Salary&page=1&limit=5

## Authentication

All protected routes require a Bearer token in the Authorization header:
Authorization: Bearer <token>

Get the token by calling POST /auth/login

## Project Structure

src/
  routes/       — Express route definitions
  controllers/  — Request and response handling
  services/     — Business logic
  middleware/   — Auth and role guards
  prisma.js     — Prisma client instance
  app.js        — Express app entry point
prisma/
  schema.prisma — Database schema
  seed.js       — Demo data seeder

## Tradeoffs and Assumptions

- SQLite over PostgreSQL: chosen for zero setup simplicity. Can be swapped by changing the provider in schema.prisma and updating DATABASE_URL
- Soft delete: transactions are never permanently deleted. deletedAt is set instead, preserving data history
- Role at registration: users self assign roles at registration for simplicity. In production an admin would assign roles after signup
- JWT expiry: tokens expire in 7 days. In production this would be shorter with refresh token support
- Analyst permissions: analysts can create and update transactions in addition to viewing, since financial analysts typically need to enter data
- No rate limiting: not implemented for simplicity but would use express-rate-limit in production