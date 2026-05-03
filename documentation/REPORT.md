# QA Management System — Academic Technical Report

**Project Title:** QA Management System (QAMS)
**Technology Stack:** Spring Boot 3 · React 18 · MySQL · JWT
**Report Type:** System Design and Architecture Documentation

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [System Architecture](#2-system-architecture)
3. [Module Descriptions](#3-module-descriptions)
   - 3.1 Authentication Module
   - 3.2 Test Case Management Module
   - 3.3 Bug Tracking Module
   - 3.4 Dashboard and Analytics Module
4. [Database Overview](#4-database-overview)
5. [API Reference](#5-api-reference)
6. [Design Approach and Reasoning](#6-design-approach-and-reasoning)
7. [System Workflow](#7-system-workflow)
8. [Security Model](#8-security-model)
9. [Frontend Architecture](#9-frontend-architecture)
10. [Conclusion](#10-conclusion)

---

## 1. Project Overview

The **QA Management System (QAMS)** is a full-stack web application designed to streamline software quality assurance processes within development teams. It provides a centralised platform for managing test cases, tracking defect lifecycles, executing test plans, and generating analytical reports — replacing ad-hoc spreadsheet-based approaches that are common in small-to-medium software teams.

### 1.1 Problem Statement

Software quality assurance teams frequently operate without a unified tooling ecosystem. Test cases are distributed across spreadsheets, defects are tracked in separate issue trackers, and there is no single view of overall test health. This fragmentation leads to:

- Duplicate or stale test cases
- Incomplete defect traceability
- Inability to quantify test coverage
- No role-based access control over sensitive QA artefacts

### 1.2 Solution

QAMS addresses these concerns by providing:

| Feature | Description |
|---|---|
| **Project and Module Management** | Hierarchical organisation of test assets |
| **Test Case Lifecycle** | Create, version, and execute test cases |
| **Defect Tracking** | End-to-end bug lifecycle from report to closure |
| **Test Plans and Suites** | Group test cases into structured plans |
| **Role-Based Access** | ADMIN, TESTER, and DEVELOPER roles with distinct permissions |
| **Analytics Dashboard** | Real-time pass/fail rates, defect distribution |
| **CSV Reporting** | Exportable reports for stakeholder communication |
| **Notifications** | Activity-based notifications per user |

### 1.3 Target Users

| Role | Responsibilities |
|---|---|
| **ADMIN** | Full system access: manage projects, modules, users, and all test artefacts |
| **TESTER** | Create and execute test cases, log and update defects |
| **DEVELOPER** | View defects assigned to them and update defect status only |

---

## 2. System Architecture

QAMS follows a **layered three-tier architecture** with a clear separation between the presentation layer (React), the application layer (Spring Boot REST API), and the data layer (MySQL).

```
┌─────────────────────────────────────────────────────────┐
│                   CLIENT TIER (Browser)                  │
│                                                          │
│   React 18 + Vite                                        │
│   ├── Pages (Dashboard, Projects, TestCases, ...)        │
│   ├── Components (Navbar, Sidebar, Charts)               │
│   ├── AuthContext (JWT state management)                 │
│   └── Axios (HTTP client with JWT interceptor)           │
└─────────────────────┬───────────────────────────────────┘
                      │ HTTP/JSON  (port 5173 → 8080)
                      │ Authorization: Bearer <JWT>
┌─────────────────────▼───────────────────────────────────┐
│                APPLICATION TIER (Spring Boot)            │
│                                                          │
│   Controllers → Services → Repositories                  │
│   ├── Security Filter Chain (JWT + CORS)                 │
│   ├── REST Controllers (12 controller classes)           │
│   ├── Service Layer (business logic)                     │
│   ├── Repository Layer (Spring Data JPA)                 │
│   └── Global Exception Handler                          │
└─────────────────────┬───────────────────────────────────┘
                      │ JDBC / Hibernate ORM
┌─────────────────────▼───────────────────────────────────┐
│                  DATA TIER (MySQL 8)                     │
│                                                          │
│   Database: qa_management_db                             │
│   Tables: users, projects, modules, test_cases,          │
│           test_suites, test_plans, test_executions,      │
│           defects, notifications, test_case_versions     │
└─────────────────────────────────────────────────────────┘
```

### 2.1 Backend Package Structure

```
com.qams/
├── config/          — Spring Security and CORS configuration
├── controller/      — REST endpoint handlers (12 controllers)
├── dto/
│   ├── request/     — Inbound payload models (validated)
│   └── response/    — Outbound payload models
├── entity/          — JPA-mapped database entities (10 entities)
├── enums/           — Typed enumerations (UserRole, TestStatus, ...)
├── exception/       — Custom exceptions + GlobalExceptionHandler
├── repository/      — Spring Data JPA interfaces (10 repositories)
├── security/        — JWT filter, JwtService, UserDetailsService
└── service/         — Business logic layer (12 service classes)
```

### 2.2 Frontend Structure

```
src/
├── api/
│   └── axiosConfig.js     — Axios instance + JWT request interceptor
├── components/
│   ├── charts/
│   │   └── DashboardCharts.jsx
│   ├── Navbar.jsx
│   ├── Sidebar.jsx
│   └── ProtectedRoute.jsx
├── context/
│   └── AuthContext.jsx    — Auth state, login/logout, token persistence
├── pages/
│   ├── Login.jsx / Register.jsx
│   ├── Dashboard.jsx
│   ├── Projects.jsx / Modules.jsx
│   ├── TestCases.jsx / TestSuites.jsx / TestPlans.jsx
│   ├── TestExecutions.jsx
│   ├── Defects.jsx
│   ├── Reports.jsx
│   └── Notifications.jsx
├── App.jsx               — Router configuration + AppShell layout
└── index.css             — Global styles and utility classes
```

### 2.3 Communication Flow

1. User authenticates via `POST /api/auth/login` → receives JWT token
2. Token is stored in `localStorage` under key `qams_token`
3. Axios request interceptor reads token and attaches `Authorization: Bearer <token>` to every subsequent request
4. Spring Security's `JwtAuthenticationFilter` validates the token on every protected route
5. On `401` response, the Axios response interceptor clears stored credentials and forces re-login

---

## 3. Module Descriptions

### 3.1 Authentication Module

**Purpose:** Manages user identity, registration, login, and stateless session management using JSON Web Tokens.

**Backend Components:**

| Component | File | Responsibility |
|---|---|---|
| Controller | `AuthController.java` | Exposes `/api/auth/register` and `/api/auth/login` |
| Service | `AuthService.java` | Password hashing, user creation, token issuance |
| JWT Service | `JwtService.java` | Token generation, signature verification, claim extraction |
| JWT Filter | `JwtAuthenticationFilter.java` | Per-request token validation, security context population |
| User Details | `CustomUserDetailsService.java` | Loads user from DB for Spring Security authentication |
| Security Config | `SecurityConfig.java` | Filter chain, CORS policy, endpoint access rules |

**Frontend Components:**

| Component | File | Responsibility |
|---|---|---|
| Auth Context | `AuthContext.jsx` | Global auth state, `login()`, `register()`, `logout()` |
| Protected Route | `ProtectedRoute.jsx` | Guards protected pages, redirects to `/login` |
| Login Page | `Login.jsx` | Login form with error handling and redirect |
| Register Page | `Register.jsx` | Registration form with role selection |
| Axios Config | `axiosConfig.js` | Attaches JWT to all requests, handles 401 globally |

**Token Structure (JWT Payload):**
```json
{
  "sub": "user@example.com",
  "role": "TESTER",
  "iat": 1700000000,
  "exp": 1700086400
}
```

**Token Expiry:** 24 hours (configurable via `QAMS_JWT_EXPIRATION_MS` environment variable)

**Password Storage:** BCrypt hashing via Spring Security's `BCryptPasswordEncoder`

---

### 3.2 Test Case Management Module

**Purpose:** Provides full lifecycle management of test cases from creation through execution, including version history tracking.

**Key Entities:**
- `Project` → `Module` → `TestCase` (hierarchical containment)
- `TestSuite` (collection of test cases, grouped by project)
- `TestPlan` (collection of test suites, with date ranges and status)
- `TestExecution` (record of a test case being run)
- `TestCaseVersion` (immutable snapshot of a test case at a point in time)

**Supported Operations:**

| Operation | Endpoint | Access |
|---|---|---|
| Create test case | `POST /api/test-cases` | ADMIN, TESTER |
| Search with filters | `GET /api/test-cases/search?keyword=&priority=&status=&moduleId=` | All |
| Update test case | `PUT /api/test-cases/{id}` | ADMIN, TESTER |
| View version history | `GET /api/test-case-versions/test-case/{id}` | All |
| Execute a test case | `POST /api/test-executions` | ADMIN, TESTER |
| Update execution status | `PUT /api/test-executions/{id}/status` | ADMIN, TESTER |

**Test Case Fields:**

| Field | Type | Description |
|---|---|---|
| `title` | String | Concise test case name |
| `description` | Text | Detailed description |
| `preconditions` | Text | Setup required before execution |
| `steps` | Text | Step-by-step instructions |
| `expectedResult` | Text | Expected system behaviour |
| `priority` | Enum | LOW, MEDIUM, HIGH, CRITICAL |
| `status` | Enum | PENDING, PASSED, FAILED, BLOCKED |

**Versioning:** Each update to a test case automatically creates a `TestCaseVersion` record containing a JSON snapshot (`snapshotData`) of all fields, the version number, and the user who made the change.

**Test Organisation Hierarchy:**
```
Project
└── Module
    └── TestCase (can belong to multiple TestSuites)
        └── TestExecution (one per run)

TestSuite (many TestCases)
└── TestPlan (many TestSuites, has startDate / endDate)
    └── TestExecution (linked to TestPlan)
```

---

### 3.3 Bug Tracking Module

**Purpose:** Tracks defects discovered during test execution from initial report through resolution and closure.

**Defect Lifecycle:**

```
OPEN → IN_PROGRESS → RESOLVED → CLOSED
```

**Key Entity Fields:**

| Field | Type | Description |
|---|---|---|
| `title` | String | Brief defect summary |
| `description` | Text | Detailed reproduction steps |
| `severity` | Enum | LOW, MEDIUM, HIGH, CRITICAL |
| `priority` | Enum | LOW, MEDIUM, HIGH, CRITICAL |
| `status` | Enum | OPEN, IN_PROGRESS, RESOLVED, CLOSED |
| `testExecution` | FK | Optional link to the execution that revealed it |
| `project` | FK | Project the defect belongs to |
| `reportedBy` | FK | User who logged the defect |
| `assignedTo` | FK | Developer responsible for the fix |

**Role-Based Update Rules:**

| Role | Can Do |
|---|---|
| ADMIN / TESTER | Create, edit all fields, delete |
| DEVELOPER | Update status only (`PUT /api/defects/{id}/status`) |

**Search API:** `GET /api/defects/search?keyword=&severity=&status=&projectId=` supports multi-filter searches.

**Traceability:** Each defect can be directly linked to the `TestExecution` that discovered it, providing end-to-end traceability from test step → failure → defect → fix.

---

### 3.4 Dashboard and Analytics Module

**Purpose:** Provides a real-time summary of system health and test quality metrics, presented as both data cards and interactive charts.

**Data Source:** Single endpoint `GET /api/dashboard/summary` returns aggregate counts computed server-side.

**Metrics Provided:**

| Metric | Description |
|---|---|
| `totalProjects` | Total registered projects |
| `totalModules` | Total modules across all projects |
| `totalTestCases` | Total test cases in system |
| `totalExecutions` | Total test executions run |
| `totalPassedExecutions` | Executions with PASSED status |
| `totalFailedExecutions` | Executions with FAILED status |
| `totalBlockedExecutions` | Executions with BLOCKED status |
| `totalPendingExecutions` | Executions with PENDING status |
| `totalDefects` | Total defects logged |
| `openDefects` | Defects currently OPEN |
| `inProgressDefects` | Defects currently IN_PROGRESS |
| `resolvedDefects` | Defects resolved |
| `closedDefects` | Defects closed |
| `passRate` | Percentage of passed executions |
| `failRate` | Percentage of failed executions |

**Charts (implemented with Recharts):**

| Chart | Type | Data |
|---|---|---|
| Test Execution Results | Bar Chart | Passed / Failed / Blocked / Pending counts |
| Weekly Execution Trend | Line Chart | Passed vs Failed over 7 days |
| Defect Status Distribution | Pie Chart | Open / In Progress / Resolved / Closed |

**Reporting Module (`/api/reports`):**

Generates structured reports in both JSON and CSV formats for:
- Test Cases (with priority breakdown)
- Test Executions (with status breakdown)
- Defects (with severity and status breakdown)

---

## 4. Database Overview

**Database:** MySQL 8
**Schema:** `qa_management_db`
**ORM:** Hibernate (via Spring Data JPA)
**DDL Strategy:** `spring.jpa.hibernate.ddl-auto=update` (auto-migrates schema)

### 4.1 Tables and Columns

#### `users`
| Column | Type | Constraints |
|---|---|---|
| `id` | BIGINT | PK, AUTO_INCREMENT |
| `name` | VARCHAR | NOT NULL |
| `email` | VARCHAR | NOT NULL, UNIQUE |
| `password` | VARCHAR | NOT NULL (BCrypt) |
| `role` | VARCHAR | NOT NULL (ADMIN/TESTER/DEVELOPER) |
| `active` | BOOLEAN | NOT NULL, DEFAULT true |
| `created_at` | DATETIME | NOT NULL |
| `updated_at` | DATETIME | NOT NULL |

#### `projects`
| Column | Type | Constraints |
|---|---|---|
| `id` | BIGINT | PK, AUTO_INCREMENT |
| `name` | VARCHAR | NOT NULL |
| `description` | TEXT | |
| `status` | VARCHAR | DEFAULT 'ACTIVE' |
| `created_at` | DATETIME | NOT NULL |
| `updated_at` | DATETIME | NOT NULL |

#### `modules`
| Column | Type | Constraints |
|---|---|---|
| `id` | BIGINT | PK, AUTO_INCREMENT |
| `name` | VARCHAR | NOT NULL |
| `description` | TEXT | |
| `project_id` | BIGINT | FK → projects.id, NOT NULL |
| `created_at` | DATETIME | NOT NULL |
| `updated_at` | DATETIME | NOT NULL |

#### `test_cases`
| Column | Type | Constraints |
|---|---|---|
| `id` | BIGINT | PK, AUTO_INCREMENT |
| `title` | VARCHAR | NOT NULL |
| `description` | TEXT | |
| `preconditions` | TEXT | |
| `steps` | TEXT | NOT NULL |
| `expected_result` | TEXT | NOT NULL |
| `priority` | VARCHAR | DEFAULT 'MEDIUM' |
| `status` | VARCHAR | DEFAULT 'PENDING' |
| `module_id` | BIGINT | FK → modules.id, NOT NULL |
| `created_by_user_id` | BIGINT | FK → users.id |
| `created_at` | DATETIME | NOT NULL |
| `updated_at` | DATETIME | NOT NULL |

#### `test_suites`
| Column | Type | Constraints |
|---|---|---|
| `id` | BIGINT | PK, AUTO_INCREMENT |
| `name` | VARCHAR | NOT NULL |
| `description` | TEXT | |
| `project_id` | BIGINT | FK → projects.id, NOT NULL |
| `created_at` | DATETIME | NOT NULL |
| `updated_at` | DATETIME | NOT NULL |

#### `test_suite_test_cases` (join table)
| Column | Type | Constraints |
|---|---|---|
| `test_suite_id` | BIGINT | FK → test_suites.id |
| `test_case_id` | BIGINT | FK → test_cases.id |

#### `test_plans`
| Column | Type | Constraints |
|---|---|---|
| `id` | BIGINT | PK, AUTO_INCREMENT |
| `name` | VARCHAR | NOT NULL |
| `description` | TEXT | |
| `start_date` | DATE | |
| `end_date` | DATE | |
| `status` | VARCHAR | DEFAULT 'PENDING' |
| `project_id` | BIGINT | FK → projects.id, NOT NULL |
| `created_at` | DATETIME | NOT NULL |
| `updated_at` | DATETIME | NOT NULL |

#### `test_plan_test_suites` (join table)
| Column | Type | Constraints |
|---|---|---|
| `test_plan_id` | BIGINT | FK → test_plans.id |
| `test_suite_id` | BIGINT | FK → test_suites.id |

#### `test_executions`
| Column | Type | Constraints |
|---|---|---|
| `id` | BIGINT | PK, AUTO_INCREMENT |
| `test_case_id` | BIGINT | FK → test_cases.id, NOT NULL |
| `test_plan_id` | BIGINT | FK → test_plans.id |
| `executed_by_user_id` | BIGINT | FK → users.id |
| `status` | VARCHAR | DEFAULT 'PENDING' |
| `actual_result` | TEXT | |
| `notes` | TEXT | |
| `executed_at` | DATETIME | |
| `created_at` | DATETIME | NOT NULL |
| `updated_at` | DATETIME | NOT NULL |

#### `defects`
| Column | Type | Constraints |
|---|---|---|
| `id` | BIGINT | PK, AUTO_INCREMENT |
| `title` | VARCHAR | NOT NULL |
| `description` | TEXT | |
| `severity` | VARCHAR | DEFAULT 'MEDIUM' |
| `priority` | VARCHAR | DEFAULT 'MEDIUM' |
| `status` | VARCHAR | DEFAULT 'OPEN' |
| `test_execution_id` | BIGINT | FK → test_executions.id, UNIQUE |
| `project_id` | BIGINT | FK → projects.id, NOT NULL |
| `reported_by_user_id` | BIGINT | FK → users.id |
| `assigned_to_user_id` | BIGINT | FK → users.id |
| `created_at` | DATETIME | NOT NULL |
| `updated_at` | DATETIME | NOT NULL |

#### `test_case_versions`
| Column | Type | Constraints |
|---|---|---|
| `id` | BIGINT | PK, AUTO_INCREMENT |
| `test_case_id` | BIGINT | FK → test_cases.id, NOT NULL |
| `version_number` | INT | NOT NULL |
| `snapshot_data` | LONGTEXT | JSON snapshot |
| `updated_by_user_id` | BIGINT | FK → users.id |
| `created_at` | DATETIME | NOT NULL |

#### `notifications`
| Column | Type | Constraints |
|---|---|---|
| `id` | BIGINT | PK, AUTO_INCREMENT |
| `user_id` | BIGINT | FK → users.id, NOT NULL |
| `title` | VARCHAR | NOT NULL |
| `message` | TEXT | |
| `read` | BOOLEAN | DEFAULT false |
| `created_at` | DATETIME | NOT NULL |
| `updated_at` | DATETIME | NOT NULL |

### 4.2 Entity Relationships Summary

```
users           ──< test_cases           (created_by)
users           ──< test_executions      (executed_by)
users           ──< defects              (reported_by, assigned_to)
users           ──< notifications        (owned by user)

projects        ──< modules
projects        ──< test_suites
projects        ──< test_plans
projects        ──< defects

modules         ──< test_cases

test_cases      >─< test_suites          (many-to-many via join table)
test_cases      ──< test_executions
test_cases      ──< test_case_versions

test_suites     >─< test_plans           (many-to-many via join table)
test_suites     ──< test_executions      (via test_plan)

test_executions ──┤ defects              (one-to-one, optional)
```

---

## 5. API Reference

### 5.1 Authentication Endpoints

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Register new user |
| POST | `/api/auth/login` | Public | Login, receive JWT |

### 5.2 Project Endpoints

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/api/projects` | Authenticated | List all projects |
| POST | `/api/projects` | ADMIN | Create project |
| GET | `/api/projects/{id}` | Authenticated | Get project by ID |
| PUT | `/api/projects/{id}` | ADMIN | Update project |
| DELETE | `/api/projects/{id}` | ADMIN | Delete project |

### 5.3 Module Endpoints

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/api/modules` | Authenticated | List all modules |
| GET | `/api/modules/project/{id}` | Authenticated | Modules for a project |
| POST | `/api/modules` | ADMIN | Create module |
| PUT | `/api/modules/{id}` | ADMIN | Update module |
| DELETE | `/api/modules/{id}` | ADMIN | Delete module |

### 5.4 Test Case Endpoints

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/api/test-cases/search` | Authenticated | Search with filters |
| POST | `/api/test-cases` | ADMIN, TESTER | Create test case |
| PUT | `/api/test-cases/{id}` | ADMIN, TESTER | Update test case |
| DELETE | `/api/test-cases/{id}` | ADMIN, TESTER | Delete test case |

### 5.5 Test Execution Endpoints

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/api/test-executions` | Authenticated | List all executions |
| POST | `/api/test-executions` | ADMIN, TESTER | Record execution |
| PUT | `/api/test-executions/{id}/status` | ADMIN, TESTER | Update result |
| DELETE | `/api/test-executions/{id}` | ADMIN, TESTER | Delete execution |

### 5.6 Defect Endpoints

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/api/defects/search` | Authenticated | Search defects |
| POST | `/api/defects` | ADMIN, TESTER | Log defect |
| PUT | `/api/defects/{id}` | ADMIN, TESTER | Update defect |
| PUT | `/api/defects/{id}/status` | ADMIN, TESTER, DEVELOPER | Update status only |
| DELETE | `/api/defects/{id}` | ADMIN, TESTER | Delete defect |

### 5.7 Dashboard and Report Endpoints

| Method | Path | Description |
|---|---|---|
| GET | `/api/dashboard/summary` | Aggregated system metrics |
| GET | `/api/reports/test-cases` | Test case report JSON |
| GET | `/api/reports/test-executions` | Execution report JSON |
| GET | `/api/reports/defects` | Defect report JSON |
| GET | `/api/reports/test-cases/csv` | Test case CSV export |
| GET | `/api/reports/test-executions/csv` | Execution CSV export |
| GET | `/api/reports/defects/csv` | Defect CSV export |

---

## 6. Design Approach and Reasoning

### 6.1 Architecture Choice: REST + SPA

**Decision:** Separate backend REST API and frontend Single-Page Application rather than a monolith with server-side rendering.

**Reasoning:**
- The frontend and backend can be developed, deployed, and scaled independently
- React's component model enables fast, interactive UI without full-page reloads
- REST APIs are stateless and horizontally scalable
- The JWT-based auth model aligns naturally with stateless REST

### 6.2 JWT Over Session-Based Authentication

**Decision:** Stateless JWT tokens stored in `localStorage`.

**Reasoning:**
- Spring Security's stateless session policy (`STATELESS`) eliminates server-side session storage
- JWT tokens are self-contained: role and user identity are embedded in the token payload
- `localStorage` persistence survives page refreshes without requiring additional session infrastructure
- The custom `JwtService` implements HMAC-SHA256 signing without pulling in heavyweight JWT libraries

### 6.3 Layered Architecture (Controller → Service → Repository)

**Decision:** Strict three-layer pattern in the backend.

**Reasoning:**
- Controllers are thin and only handle HTTP concerns (request parsing, status codes)
- Services contain all business logic, making them independently testable
- Repositories abstract data access, allowing the persistence layer to be swapped without affecting business logic
- DTOs (Data Transfer Objects) prevent entity objects from leaking into API contracts

### 6.4 Role-Based Access Control with Spring's `@PreAuthorize`

**Decision:** Method-level security annotations on controller endpoints.

**Reasoning:**
- Permissions are declared at the endpoint level, making access rules visible and auditable
- Adding new roles requires only updating annotations — no conditional logic in service code
- Spring Security evaluates these before the method executes, preventing even partial processing of unauthorised requests

### 6.5 Hibernate DDL Auto-Update

**Decision:** `spring.jpa.hibernate.ddl-auto=update` for schema management.

**Reasoning:**
- Appropriate for a development and early-stage project where schema evolves rapidly
- Eliminates the need for manual migration scripts during development
- In production, this would be replaced with Flyway or Liquibase migration scripts

### 6.6 React Context for Auth State

**Decision:** `AuthContext` with `useContext` for global auth state.

**Reasoning:**
- Avoids prop-drilling the auth state through deeply nested component trees
- `useMemo` on the context value prevents unnecessary re-renders of consuming components
- `localStorage` persistence means the auth state survives browser refresh

### 6.7 Single Axios Instance with Interceptors

**Decision:** One shared Axios instance with request/response interceptors.

**Reasoning:**
- JWT token is attached automatically to every outgoing request — developers don't need to remember to add it
- The `401` response interceptor cleans up state globally — no need to handle token expiry in every page
- `baseURL` configuration centralises the API root, making environment switching trivial

---

## 7. System Workflow

### 7.1 User Registration and Login Flow

```
1. User fills Registration form (name, email, password, role)
2. Frontend → POST /api/auth/register
3. AuthService:
   a. Checks if email already exists
   b. BCrypt-hashes the password
   c. Saves User entity to database
   d. Generates JWT token via JwtService
   e. Returns AuthResponse {token, userId, name, email, role}
4. Frontend stores token → localStorage("qams_token")
5. Frontend stores user profile → localStorage("qams_user")
6. User is redirected to /dashboard
```

### 7.2 Test Case Creation and Execution Flow

```
1. ADMIN or TESTER creates a Test Case:
   a. Selects Project → Module (hierarchical selection)
   b. Fills title, steps, expected result, priority
   c. Frontend → POST /api/test-cases
   d. TestCaseService saves entity, creates Version 1 snapshot

2. Tester executes a Test Case:
   a. Selects test case from list
   b. Records actual result and execution status
   c. Frontend → POST /api/test-executions
   d. TestExecutionService records result, updates test case status

3. If execution FAILED:
   a. Tester creates a Defect linked to the execution
   b. Frontend → POST /api/defects
   c. DefectService creates defect in OPEN status
   d. Notification may be created for assigned developer
```

### 7.3 Defect Resolution Flow

```
1. DEVELOPER logs in, views assigned defects
   → GET /api/defects/search (filtered by assignedTo)

2. Developer picks up defect → updates status to IN_PROGRESS
   → PUT /api/defects/{id}/status { status: "IN_PROGRESS" }

3. Developer fixes the issue, marks as RESOLVED
   → PUT /api/defects/{id}/status { status: "RESOLVED" }

4. TESTER verifies the fix, re-executes the test case
   → POST /api/test-executions { status: "PASSED" }

5. ADMIN closes the defect
   → PUT /api/defects/{id}/status { status: "CLOSED" }
```

### 7.4 Report Generation Flow

```
1. User navigates to Reports page
2. Frontend → GET /api/reports/test-cases (or test-executions, defects)
3. ReportService:
   a. Queries all relevant entities
   b. Computes summary counts (total, by priority/status)
   c. Returns structured ReportResponse
4. Frontend displays summary stats and data table
5. User clicks "Export CSV"
   → GET /api/reports/test-cases/csv
   → ReportService generates CSV string with headers
   → Frontend creates Blob, triggers file download
```

---

## 8. Security Model

### 8.1 Authentication Flow

```
Client Request
     │
     ▼
JwtAuthenticationFilter.doFilterInternal()
     │
     ├── No Authorization header? → Pass through (public endpoints)
     │
     └── Has Bearer token?
           │
           ├── Extract email from token
           ├── Load UserDetails from DB
           ├── Validate signature + expiry
           └── Set SecurityContext → Request proceeds
```

### 8.2 CORS Policy

| Setting | Value |
|---|---|
| Allowed Origins | `http://localhost:5173` |
| Allowed Methods | GET, POST, PUT, DELETE, OPTIONS, PATCH |
| Allowed Headers | `*` (all headers) |
| Allow Credentials | true |
| Max Age | 3600 seconds (preflight cache) |

### 8.3 Public Endpoints

The following paths bypass JWT validation:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /swagger-ui/**`
- `GET /v3/api-docs/**`

All other endpoints require a valid JWT token.

### 8.4 Role Permissions Matrix

| Endpoint Group | PUBLIC | AUTHENTICATED | TESTER | ADMIN | DEVELOPER |
|---|---|---|---|---|---|
| Auth (register/login) | ✓ | | | | |
| Read projects/modules/tests | | ✓ | ✓ | ✓ | ✓ |
| Create/edit projects, modules | | | | ✓ | |
| Create/edit test cases, executions | | | ✓ | ✓ | |
| Create/edit defects | | | ✓ | ✓ | |
| Update defect status only | | | | | ✓ |
| Delete any resource | | | ✓ | ✓ | |
| Dashboard/Reports | | ✓ | ✓ | ✓ | ✓ |

---

## 9. Frontend Architecture

### 9.1 Routing Structure

```
/login               → Login.jsx          (public)
/register            → Register.jsx       (public)
/ (AppShell)         → ProtectedRoute
  /dashboard         → Dashboard.jsx
  /projects          → Projects.jsx
  /modules           → Modules.jsx
  /test-cases        → TestCases.jsx
  /test-suites       → TestSuites.jsx
  /test-plans        → TestPlans.jsx
  /test-executions   → TestExecutions.jsx
  /defects           → Defects.jsx
  /reports           → Reports.jsx
  /notifications     → Notifications.jsx
* (catch-all)        → redirect to /dashboard
```

### 9.2 State Management

| State Type | Mechanism |
|---|---|
| Auth state (user, token) | React Context (`AuthContext`) |
| Page-level data | Local `useState` in each page component |
| Persistent session | `localStorage` (`qams_token`, `qams_user`) |
| Server state | Fetched on mount via `useEffect` + Axios |

### 9.3 Component Hierarchy

```
App.jsx
├── Route: /login → Login.jsx
├── Route: /register → Register.jsx
└── Route: /* → AppShell (ProtectedRoute)
    ├── Sidebar.jsx (navigation links)
    └── main
        ├── Navbar.jsx (user info, logout)
        └── Outlet (active page)
            ├── Dashboard.jsx
            │   └── DashboardCharts.jsx (Recharts)
            ├── Projects.jsx
            ├── Modules.jsx
            ├── TestCases.jsx
            ├── TestSuites.jsx
            ├── TestPlans.jsx
            ├── TestExecutions.jsx
            ├── Defects.jsx
            ├── Reports.jsx
            └── Notifications.jsx
```

---

## 10. Conclusion

The QA Management System demonstrates a production-grade full-stack web application architecture suitable for small-to-medium software development teams. Key design strengths include:

- **Separation of concerns** at every layer: controller, service, repository, and presentation
- **Stateless authentication** via JWT enabling horizontal backend scaling
- **Role-based access control** enforced at both the API level and frontend UI level
- **Hierarchical data model** (Project → Module → TestCase → TestExecution → Defect) that mirrors real-world QA workflows
- **Audit trail** via test case versioning and execution records
- **Export capability** for CSV-based stakeholder reporting

The system is designed for extensibility — new roles, additional report types, or time-series analytics endpoints can be added without restructuring the existing architecture.
