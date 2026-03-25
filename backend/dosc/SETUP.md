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

### 0. Create a Test User (required)

There are no preconfigured users in this project.
Also, there is currently no public registration endpoint (for example `/register`), so you must create a user directly in PostgreSQL.

1. Connect to your local database (`stronaKNAlgo`).
2. (Optional, once per DB) enable `pgcrypto` to generate BCrypt hash in SQL:
   - `CREATE EXTENSION IF NOT EXISTS pgcrypto;`
3. Insert a user with `ROLE_ADMIN` (required for `/me`):

```sql
INSERT INTO users (email, password, username, role)
VALUES (
  'admin@example.com',
  crypt('admin123', gen_salt('bf')),
  'admin',
  'ROLE_ADMIN'
);
```

Login credentials from the example above:
- `username`: `admin`
- `password`: `admin123`

### 1. Login
- **Request:** `POST http://localhost:8080/login`
- **Body:** `x-www-form-urlencoded`
- **Keys:** `username` & `password`
  *(Returns `200 OK` and saves the session cookie).*
  *(Important: use `username`, not `email`.)*

### 2. Get User Info
- **Request:** `GET http://localhost:8080/me`
- **Auth:** `No Auth`
  *(Note: Requires `ROLE_ADMIN` authority).*

### 3. Logout
- **Request:** `GET http://localhost:8080/logout`
