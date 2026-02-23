# Getting Started

**Requirements:**
* Java JDK 23 
* Docker & Docker Compose
* IntelliJ IDEA (or other IDE which support Maven)

**Configuration:**
* Create a local config file at `src/main/resources/application.properties`.
* Set your database credentials (`spring.datasource.username`, `spring.datasource.password`).
* Ensure your local PostgreSQL container is running before starting the app.

## API Testing 

The application uses session-based Spring Security. Postman will automatically store and send the `JSESSIONID` cookie after a successful login.

### 1. Login
- **Request:** `POST http://localhost:8080/login`
- **Body:** `x-www-form-urlencoded`
- **Keys:** `username` & `password`
  *(Returns `200 OK` and saves the session cookie).*

### 2. Get User Info
- **Request:** `GET http://localhost:8080/me`
- **Auth:** `No Auth`
  *(Note: Requires `ROLE_ADMIN` authority).*

### 3. Logout
- **Request:** `GET http://localhost:8080/logout`