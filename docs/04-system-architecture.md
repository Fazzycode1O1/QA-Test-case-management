# System Architecture

## Backend Architecture

The backend is a layered Spring Boot REST API.

Package responsibilities:

- `controller`: REST endpoints and request handling.
- `dto.request`: Request payload models.
- `dto.response`: API response payload models.
- `service`: Business logic and workflow orchestration.
- `repository`: Spring Data JPA persistence interfaces.
- `entity`: JPA entities mapped to database tables.
- `enums`: Shared enum definitions such as roles and statuses.
- `config`: Application and framework configuration, including CORS and security rules.
- `security`: JWT filter, token utilities, and UserDetailsService.
- `exception`: Custom exceptions and global exception handler (`GlobalExceptionHandler`).
- `util`: Shared utility classes.

## Frontend Architecture

The frontend is a React 18 SPA located at `frontend/qa-management-ui`, built with Vite.

### Application Structure

- **`src/api/axiosConfig.js`**: Axios instance with request and response interceptors
  - Request interceptor attaches JWT bearer token to all requests
  - Response interceptor detects 401 errors and handles session expiry
  
- **`src/context/AuthContext.jsx`**: Central auth state provider with methods
  - `login(email, password)` — Authenticates and stores token/user
  - `register(name, email, password, role)` — Creates new user account
  - `logout()` — Clears token and user from storage
  - Listens for `auth:logout` event to detect forced logout (token expiry)

- **`src/components/`**: Shared UI components
  - `Sidebar.jsx`: Collapsible sidebar with role-aware navigation links
  - `Navbar.jsx`: Top bar with notification bell and user info dropdown
  - `ui/Modal.jsx`: Overlay modal with backdrop, ESC key, and scroll lock support
  - `ui/ConfirmModal.jsx`: Confirmation dialog for delete actions
  - `ui/Pagination.jsx`: Smart pagination with ellipsis for large page counts
  - Chart components (`DashboardCharts.jsx`): Bar, line, and trend charts for analytics

- **`src/pages/`**: One file per route — Dashboard, Projects, Modules, TestCases, TestSuites, TestPlans, TestExecutions, Defects, Notifications, Reports, Login, Register
  - CRUD pages follow consistent patterns: form validation, error handling, toast notifications
  - Use `useCallback` to memoize data-fetching functions for stable references in dependencies
  - Use `useEffect` for side effects with proper dependency arrays

- **`src/utils/formatters.js`**: Shared formatting utilities
  - `fmtDate(dateString)` — Formats ISO dates to readable format
  - Additional utility functions for type coercion and display formatting

## Security Layer

JWT authentication is implemented using Spring Security and a stateless bearer-token flow.

### Backend security

- `JwtAuthFilter` intercepts all requests and validates the bearer token.
- `GlobalExceptionHandler` returns HTTP 401 for `BadCredentialsException` (failed login).
- `SecurityConfig` permits `/api/auth/**` publicly and requires authentication for all other routes.
- Role-based method-level or path-based access rules restrict admin, tester, and developer actions.
- Passwords are hashed with BCrypt.
- CORS is configured to allow only `http://localhost:5173`.

### Frontend security

- The Axios request interceptor attaches `Authorization: Bearer <token>` to every request.
- The Axios response interceptor detects HTTP 401. If a token already exists in `localStorage` it means the session has expired — the token and user are cleared and a DOM event (`auth:logout`) is dispatched.
- `AuthContext` listens for `auth:logout` and clears React state, which unmounts the app shell and redirects to `/login`.
- The 401 check is gated on token existence so that a failed login attempt (no token) does not trigger a spurious logout event.

## Database Layer

MySQL with Spring Data JPA and Hibernate. Entities represent the QA domain model: users, projects, modules, test cases, test case versions, test suites, test plans, test executions, defects, and notifications.

Schema is managed by Hibernate `ddl-auto=update` in development.

## Reporting Layer

The reporting layer aggregates test execution and defect data.

Endpoints:

- `/api/reports/test-cases` — test case counts by priority and status.
- `/api/reports/test-executions` — execution counts by result status.
- `/api/reports/defects` — defect counts by severity and status.
- `/api/reports/{resource}/csv` — CSV export for each category.

## Communication Flow

```
Browser (React SPA)
  └─ Axios HTTP (JWT bearer token)
       └─ Spring Boot REST API (:8080)
            ├─ JwtAuthFilter
            ├─ Controllers
            ├─ Services
            └─ Spring Data JPA
                 └─ MySQL (:3306)
```
