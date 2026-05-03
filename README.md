# QA Management System

A full-stack Test Case & QA Management System for organizing projects, modules, test cases, test suites, test plans, executions, defects, notifications, and reporting in one workspace.

## Project Structure

```text
qa-management-system/
|-- backend/
|   `-- qa-management-api/        Spring Boot REST API
|-- frontend/
|   `-- qa-management-ui/         React + Vite SPA
|-- docs/                         Project documentation
|-- postman/                      API test collections
`-- README.md
```

## Quick Start

### 1. Start MySQL

Start MySQL Server. If using XAMPP, start MySQL from the XAMPP Control Panel.

Create the database if it does not exist:

```sql
CREATE DATABASE qa_management_db;
```

### 2. Start the Backend

Set the JWT secret:

```powershell
$env:QAMS_JWT_SECRET="your-long-random-secret-min-32-chars"
```

Run from `backend/qa-management-api`:

```bash
mvn spring-boot:run
```

Backend runs on `http://localhost:8080`.

### 3. Start the Frontend

Run from `frontend/qa-management-ui`:

```bash
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`.

### 4. Open the App

Navigate to `http://localhost:5173`. Register a new account or sign in.

---

## Backend

Spring Boot REST API located at `backend/qa-management-api`.

**Technology stack:**

| Technology | Purpose |
|---|---|
| Java 17 | Runtime |
| Spring Boot | Application framework |
| Spring Web | REST controllers |
| Spring Data JPA | Persistence layer |
| Spring Security | Authentication and authorization |
| JWT (custom HMAC-SHA256) | Stateless bearer-token auth |
| MySQL | Database |
| Bean Validation | Request validation |
| Lombok | Boilerplate reduction |
| DevTools | Hot reload |

**Key configuration** (`application.properties`):

```properties
server.port=8080
spring.datasource.url=jdbc:mysql://localhost:3306/qa_management_db
security.jwt.secret=${QAMS_JWT_SECRET:dev-secret-key-change-in-production}
security.jwt.expiration-ms=${QAMS_JWT_EXPIRATION_MS:86400000}
```

---

## Frontend

React SPA located at `frontend/qa-management-ui`.

**Technology stack:**

| Technology | Purpose |
|---|---|
| React 18 | UI framework |
| Vite | Build tool and dev server |
| React Router v6 | Client-side routing with role-based routes |
| Axios | HTTP client with JWT interceptors |
| Recharts | Dashboard charts and analytics |
| react-hot-toast | Toast notifications |
| react-icons | Icon library (Heroicons) |

**Features:**

- **JWT Authentication** — Stateless bearer-token flow with auto-logout on token expiry
- **Role-Based Access Control** — Separate route trees for ADMIN, TESTER, and DEVELOPER with permission-aware UI
- **Responsive UI** — Collapsible sidebar navigation with Heroicons
- **Form Management** — Modal forms for create/edit with client-side validation and error handling
- **Data Management** — Client-side pagination, search, and filtering
- **Dashboard & Analytics** — KPI cards and interactive charts (bar, line, pie)
- **Notifications** — In-app notification bell with unread badge
- **Reporting & Export** — CSV export for all QA records (test cases, executions, defects)
- **Test Execution Tracking** — Record test results with actual outcome, notes, and defect links

---

## API

All endpoints require a JWT bearer token except `/api/auth/**`.

```text
Authorization: Bearer <token>
```

**Auth endpoints:**
```text
POST /api/auth/register
POST /api/auth/login
```

**Resource endpoints:**
```text
/api/projects, /api/modules, /api/test-cases, /api/test-suites,
/api/test-plans, /api/test-executions, /api/defects,
/api/notifications, /api/reports, /api/dashboard
```

See `docs/06-api-documentation.md` for full endpoint reference.

---

## Documentation

### Getting Started

| Document | Purpose |
|---|---|
| [`README.md`](README.md) | Project overview and quick start (you are here) |
| [`docs/09-installation-guide.md`](docs/09-installation-guide.md) | Step-by-step local setup guide with troubleshooting |
| [`CHANGELOG.md`](CHANGELOG.md) | Recent changes and improvements |
| [`docs/12-troubleshooting.md`](docs/12-troubleshooting.md) | Common issues and solutions |

### Technical Documentation

| Document | Purpose |
|---|---|
| [`docs/04-system-architecture.md`](docs/04-system-architecture.md) | Backend, frontend, and security architecture |
| [`docs/05-database-design.md`](docs/05-database-design.md) | Entity definitions and relationships |
| [`docs/06-api-documentation.md`](docs/06-api-documentation.md) | Full API endpoint reference with role-based access |
| [`docs/07-security-design.md`](docs/07-security-design.md) | JWT auth, RBAC implementation, and security design |
| [`docs/11-development-guide.md`](docs/11-development-guide.md) | Code patterns, conventions, and best practices |

### Project Documentation

| Document | Purpose |
|---|---|
| [`docs/01-project-overview.md`](docs/01-project-overview.md) | Vision, value proposition, target users |
| [`docs/02-problem-statement.md`](docs/02-problem-statement.md) | Problems the system solves |
| [`docs/03-requirements.md`](docs/03-requirements.md) | Functional and non-functional requirements |
| [`docs/08-test-plan.md`](docs/08-test-plan.md) | Backend and API testing strategy |
| [`docs/10-future-scope.md`](docs/10-future-scope.md) | Planned future enhancements |
