# Installation Guide

## Required Software

- Java 17
- Maven
- MySQL Server
- Git
- IDE such as IntelliJ IDEA, Eclipse, or VS Code
- Postman for API testing

## Java Setup

Install Java 17 and verify the installation:

```bash
java -version
```

Set `JAVA_HOME` to the Java 17 installation path if your operating system requires it.

## MySQL Setup

Install and start MySQL Server.

Create a database manually if you do not want the application to create it automatically:

```sql
CREATE DATABASE qams_db;
```

The initial backend configuration uses:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/qams_db?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=
```

Update `backend/qa-management-api/src/main/resources/application.properties` with your local MySQL username and password.

## Maven Commands

From the backend project folder:

```bash
cd backend/qa-management-api
```

Build the project:

```bash
mvn clean install
```

Run tests:

```bash
mvn test
```

Start the backend:

```bash
mvn spring-boot:run
```

## How to Run Backend

1. Start MySQL Server.
2. Confirm the database connection values in `application.properties`.
3. Open a terminal in `backend/qa-management-api`.
4. Run `mvn spring-boot:run`.
5. The backend will start on:

```text
http://localhost:8080
```

## Current Notes

Spring Security is included, but JWT authentication is not implemented yet. API behavior will be expanded as controllers, services, entities, and security configuration are added.

