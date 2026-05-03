# Troubleshooting Guide

This guide covers common issues and their solutions for the QA Management System.

## Backend Issues

### "Failed to start Spring Boot application"

**Symptoms**: Backend won't start, shows error in terminal

**Causes**:
- Port 8080 already in use
- Database connection issue
- Invalid JWT secret environment variable

**Solutions**:

1. Check if port is in use:
```bash
netstat -ano | findstr :8080  # Windows
lsof -i :8080                  # macOS/Linux
```

2. If port is in use, either stop the process or change the port in `application.properties`:
```properties
server.port=8081
```

3. Verify MySQL is running and database exists:
```sql
SHOW DATABASES;
-- Should see: qa_management_db
```

4. Check MySQL credentials in `application.properties`:
```properties
spring.datasource.username=root
spring.datasource.password=
```

---

### "Access denied for user 'root'@'localhost'"

**Symptoms**: Backend starts but can't connect to database

**Causes**:
- MySQL username/password mismatch
- MySQL service not running
- Wrong database host/port

**Solutions**:

1. Verify MySQL credentials:
```powershell
mysql -u root -h localhost
# Should connect without error
```

2. Update credentials in `application.properties`:
```properties
spring.datasource.username=your_username
spring.datasource.password=your_password
```

3. Check MySQL is running (XAMPP Control Panel on Windows)

---

### "JWT validation failed" or "Invalid token"

**Symptoms**: API returns 401 Unauthorized even with a valid token

**Causes**:
- JWT secret mismatch between token generation and validation
- Token expired
- Malformed JWT in header

**Solutions**:

1. Ensure JWT secret environment variable is set:
```powershell
$env:QAMS_JWT_SECRET = "your-long-random-secret-min-32-chars"
mvn spring-boot:run
```

2. For development, the default fallback secret works if not set

3. Check token expiration (default 24 hours, set in `QAMS_JWT_EXPIRATION_MS`)

---

## Frontend Issues

### "Cannot reach the backend" or "Failed to load"

**Symptoms**: Login page shows error, can't connect to API

**Causes**:
- Backend is not running
- CORS misconfiguration
- Wrong API base URL

**Solutions**:

1. Verify backend is running:
```bash
curl http://localhost:8080/api/auth/register  # Should respond with 400 (no body)
```

2. Check CORS configuration in backend `SecurityConfig.java`:
```java
.allowedOrigins("http://localhost:5173")  // Should match frontend URL
```

3. Verify frontend API base URL in `.env`:
```
VITE_API_BASE_URL=http://localhost:8080/api
```

---

### "Blank white page on localhost:5173"

**Symptoms**: Page won't load or shows nothing

**Causes**:
- Frontend dev server not running
- Build error in Vite
- JavaScript error in browser console

**Solutions**:

1. Start the frontend:
```bash
cd frontend/qa-management-ui
npm install  # If node_modules missing
npm run dev
```

2. Check browser console (F12) for JavaScript errors

3. Check terminal for Vite build errors

4. Clear browser cache: Ctrl+Shift+Delete → Clear all

---

### "Token expired / Auto-logout"

**Symptoms**: Logged in, but suddenly redirected to login page

**Causes**:
- Token expiration (default 24 hours)
- Backend was restarted (invalidates tokens)
- System clock skew

**Solutions**:

1. Normal behavior — log in again

2. If unwanted, increase token expiration in backend:
```powershell
$env:QAMS_JWT_EXPIRATION_MS = "604800000"  # 7 days
mvn spring-boot:run
```

3. Check system clock on both frontend and backend machine (for cloud deployments)

---

## RBAC & Permission Issues

### "403 Forbidden" on API requests

**Symptoms**: Button click or form submission returns 403 error

**Causes**:
- User role lacks permission for action
- `@PreAuthorize` annotation on endpoint

**Solutions**:

1. Check user role (ADMIN, TESTER, or DEVELOPER)

2. Review endpoint requirements in `docs/06-api-documentation.md`

3. Switch to a role with higher permissions:
   - Register new account as ADMIN or TESTER
   - Or have admin upgrade your role (future feature)

---

### "Create button is hidden"

**Symptoms**: Can't see "New" or "Create" buttons on page

**Causes**:
- User role doesn't have create permission
- Feature not available for this role

**Solutions**:

| Page | Create Permission |
|---|---|
| Projects, Modules | ADMIN only |
| Test Cases, Test Suites, Test Plans | ADMIN or TESTER |
| Test Executions, Defects | ADMIN or TESTER |
| Defect Status Update | Any role (DEVELOPER included) |

Register a new account with TESTER role if you need to create resources.

---

## Test Execution Issues

### "No executions found" with empty dropdown

**Symptoms**: TestExecutions page shows empty state, can't record executions

**Causes**:
- No test cases exist in the system yet
- Filter is set to a test case with no executions

**Solutions**:

1. Create test cases first:
   - Go to Test Cases page
   - Click "New Test Case"
   - Fill in title, steps, expected result
   - Click Create

2. After creating test cases, go to Test Executions and:
   - Click "New Execution"
   - Select the test case you created
   - Set status (PASSED, FAILED, etc.)
   - Click Create

3. To see all executions, clear the filter:
   - Click "All Test Cases" in the filter dropdown

---

### "Please select a test case" error in form

**Symptoms**: Form won't submit when creating execution

**Causes**:
- Test case field is required but empty
- No test cases are available

**Solutions**:

1. Select a test case from dropdown before submitting

2. If dropdown is empty, create test cases first (see above)

---

## Data & Database Issues

### "Duplicate entry" error on create

**Symptoms**: Create fails with database constraint error

**Causes**:
- Email or unique field already exists
- Database constraint violation

**Solutions**:

1. Use unique values for emails when registering
2. Check data already exists before creating
3. Clear database if doing fresh start:
```bash
mysql -u root
DROP DATABASE qa_management_db;
CREATE DATABASE qa_management_db;
```

---

### "Invalid value for enum" error

**Symptoms**: Form submission fails with enum validation error

**Causes**:
- Selected value doesn't match valid enum
- Typo or lowercase/case mismatch

**Solutions**:

Valid enum values (must match exactly):

| Field | Valid Values |
|---|---|
| `role` | ADMIN, TESTER, DEVELOPER |
| `status` (Test Case) | PENDING, PASSED, FAILED, BLOCKED |
| `status` (Defect) | OPEN, IN_PROGRESS, RESOLVED, CLOSED |
| `priority` (Test Case) | LOW, MEDIUM, HIGH, CRITICAL |
| `severity` (Defect) | LOW, MEDIUM, HIGH, CRITICAL |

---

## Network & CORS Issues

### "CORS error: Access-Control-Allow-Origin header missing"

**Symptoms**: Browser blocks request with CORS error in console

**Causes**:
- Frontend running on different origin than configured in backend
- CORS not configured correctly

**Solutions**:

1. Ensure frontend runs on `http://localhost:5173`

2. Verify backend allows this origin in `SecurityConfig.java`:
```java
.allowedOrigins("http://localhost:5173")
```

3. Check headers in network request (F12 → Network tab):
   - Request should have: `Origin: http://localhost:5173`
   - Response should have: `Access-Control-Allow-Origin: http://localhost:5173`

---

### "Network timeout" on slow requests

**Symptoms**: Page hangs, then fails with timeout error

**Causes**:
- API call takes too long to respond
- Network connectivity issue
- Large dataset being loaded

**Solutions**:

1. Check browser Network tab (F12) for slow requests

2. For large datasets, the app paginates (10 items per page) — navigate through pages

3. Check backend logs for errors:
```bash
tail -f backend/qa-management-api/logs/*.log
```

---

## Development & Build Issues

### "npm install" fails with error

**Symptoms**: Can't install frontend dependencies

**Causes**:
- Node.js version too old
- Network connectivity
- Corrupted node_modules

**Solutions**:

1. Check Node.js version:
```bash
node -v  # Should be 20.19+ or 22.12+
npm -v   # Should be 10+
```

2. Update Node.js if needed from nodejs.org

3. Clear npm cache:
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

---

### "mvn build" fails

**Symptoms**: Maven won't compile or test fails

**Causes**:
- Java version mismatch
- Dependency not found
- Test failure

**Solutions**:

1. Check Java version:
```bash
java -version  # Should be 17+
```

2. Clean and rebuild:
```bash
mvn clean install
```

3. Skip tests if blocked:
```bash
mvn clean install -DskipTests
```

4. Check Maven output for specific error message

---

## Getting Help

If your issue isn't listed here:

1. Check browser console (F12) for JavaScript errors
2. Check backend logs for stack traces
3. Search the main `docs/` folder for relevant documentation
4. Check the `CHANGELOG.md` for recent fixes
5. Review the `docs/11-development-guide.md` for code patterns

### Providing Debug Information

When reporting issues, include:

1. Exact error message from browser console or backend logs
2. Steps to reproduce
3. User role and what you were trying to do
4. Browser name and version
5. Operating system and whether using XAMPP
