# Installation Guide

## Required Software

| Software | Version | Purpose |
|---|---|---|
| Java | 17 | Backend runtime |
| Maven | 3.8+ | Backend build tool |
| MySQL | 8.x | Database |
| Node.js | 20.19+ or 22.12+ | Frontend runtime |
| npm | Bundled with Node.js | Frontend package manager |
| Git | Any | Version control |

XAMPP can be used as an all-in-one MySQL provider on Windows.

## Step 1 — Database

Start MySQL Server. If using XAMPP, start MySQL from the XAMPP Control Panel.

Create the database:

```sql
CREATE DATABASE qa_management_db;
```

The backend connects using these defaults:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/qa_management_db
spring.datasource.username=root
spring.datasource.password=
```

If your local MySQL uses a different username or password, update:

```
backend/qa-management-api/src/main/resources/application.properties
```

## Step 2 — Backend

### JWT Secret (optional for local dev)

The backend includes a development fallback secret. For local development this step can be skipped. For any shared or production environment, set a real secret:

**PowerShell:**

```powershell
$env:QAMS_JWT_SECRET="your-long-random-secret-min-32-chars"
```

**Bash / Git Bash:**

```bash
export QAMS_JWT_SECRET="your-long-random-secret-min-32-chars"
```

Optional: override the token expiration (milliseconds, default 86400000 = 24 hours):

```powershell
$env:QAMS_JWT_EXPIRATION_MS="86400000"
```

### Start the backend

From the repository root:

```bash
cd backend/qa-management-api
mvn spring-boot:run
```

The backend starts on `http://localhost:8080`. Wait for the Spring Boot banner and `Started QaManagementApiApplication` in the console before starting the frontend.

Other useful Maven commands:

```bash
mvn clean install   # compile and package
mvn test            # run tests only
```

## Step 3 — Frontend

From the repository root:

```bash
cd frontend/qa-management-ui
npm install
npm run dev
```

The frontend starts on `http://localhost:5173`.

### How API requests reach the backend

The Vite dev server proxies any request beginning with `/api` to `http://localhost:8080`. The Axios client uses `http://localhost:8080/api` as its base URL by default, which also works directly via CORS.

To override the base URL (for example, a remote backend), set the environment variable before running `npm run dev`:

```powershell
$env:VITE_API_BASE_URL="http://your-backend-host/api"
```

### Frontend dependencies

Key packages installed by `npm install`:

| Package | Purpose |
|---|---|
| react, react-dom | UI framework |
| react-router-dom | Client-side routing |
| axios | HTTP client |
| react-hot-toast | Toast notifications |
| react-icons | Heroicons and other icon sets |
| recharts | Dashboard charts |

## Step 4 — Open the App

Open `http://localhost:5173` in a browser.

- **First run:** click **Create one** to register a new account and choose a role (ADMIN, TESTER, or DEVELOPER).
- **Returning user:** sign in with an existing email and password.

## Application Pages

| Page | Description |
|---|---|
| Dashboard | KPI cards and bar / line / pie charts |
| Projects | Create and manage projects |
| Modules | Organize modules within a project |
| Test Cases | Full CRUD with priority, status, steps, and version history |
| Test Suites | Group test cases into reusable suites |
| Test Plans | Combine suites into release or milestone plans |
| Test Executions | Record pass / fail / blocked / skipped for each test run |
| Defects | Log and track defects linked to test executions |
| Notifications | View, mark as read, and delete in-app notifications |
| Reports | Aggregated summaries with CSV export |

## Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| `Cannot connect to server` on the login page | Backend is not running | Run `mvn spring-boot:run` and wait for startup |
| `Access denied for user 'root'` in backend logs | Wrong MySQL credentials | Update `application.properties` with correct username and password |
| Port 8080 already in use | Another process on the port | Stop the other process or change `server.port` in `application.properties` |
| Blank page on `http://localhost:5173` | Frontend not started | Run `npm run dev` in `frontend/qa-management-ui` |
| `npm install` errors | Outdated Node.js | Upgrade to Node.js 20.19+ or 22.12+ |
| `403 Forbidden` on API requests | User role lacks permission for action | Check your user role (ADMIN, TESTER, DEVELOPER) and the endpoint's role requirements in the API docs |
| Create/Edit buttons hidden on a page | Role doesn't have create permission | Your role may be DEVELOPER (read-only). Switch to ADMIN or TESTER role to edit |
| Test Executions page shows empty state | No test cases exist in the system | Create at least one test case before recording test executions |
| Form errors like "Please select a test case" | Required fields not filled | Ensure all required fields are completed before submitting |

## Notes

- The sidebar is collapsible using the toggle button at the bottom.
- JWT tokens expire after 24 hours. The app auto-logs out and redirects to the login page when a token expires.
- Role determines which actions are available. ADMIN has the broadest access; DEVELOPER is focused on defect management.
- Schema is managed by Hibernate `ddl-auto=update`. Tables are created or updated automatically on first backend startup — no SQL migration scripts are needed for a fresh install.
