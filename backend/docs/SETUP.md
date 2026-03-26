# Getting Started

**Requirements:**
* Java JDK 23 
* Docker & Docker Compose
* IntelliJ IDEA (or other IDE which support Maven)
* PostgreSQL

---

## Project Structure

This repository is part of a larger project consisting of a separate frontend and backend. Below is the directory structure for the **backend** application:

```text
backend/
├── docs/                    # Backend documentation
├── src/
│   └── main/
│       ├── java/algo/       # Main application code (controllers, services, DTOs)
│       └── resources/       # Configuration files (e.g., application.properties)
├── .gitignore               # Git ignored files
├── docker-compose.yml       # Docker configuration for the local database
└── pom.xml                  # Maven build configuration
```

---

## 🗄️ Database Setup (Docker)

The easiest way to run the database locally is using Docker. Before running the command, make sure to check the `docker-compose.yml` file and update the database credentials (username, password) or ports if necessary.

Run the following command in the root directory:

```bash
docker-compose up -d
```

This will start a PostgreSQL container (default port: 5432).

**Configuration:**
* Create a local config file at `src/main/resources/application.properties`.
* Set your database credentials (`spring.datasource.username`, `spring.datasource.password`).
* Ensure your local PostgreSQL container is running before starting the app.

---

## 🔑 Creating the Default Admin Account

Before you can test the API and log in, you need to create at least one user in your local database.

1. Connect to your local PostgreSQL database (using DBeaver, pgAdmin, or IntelliJ Database tool) with the credentials provided above.
2. Open an SQL console and execute the following script to create an `admin` user.

*(Note: The BCrypt hash below corresponds to the raw password `password`)*:

```sql
INSERT INTO users (username, email, password, role) 
VALUES ('admin', 'admin@example.com', '$2a$10$GRLdNijSQMUvl/au9ofL.eDwmoohzzS7.rmNSJZ.0FxO/BTk76klW', 'ROLE_ADMIN');
```
---

## 🛠️ API Testing

### Option A: Testing with cURL

These commands automatically handle the `JSESSIONID` session cookie by saving it to a `cookies.txt` file.

**1. Login:**
```bash
curl -X POST http://localhost:8080/login \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=admin&password=password" \
  -c cookies.txt
```

**2. Get User Info (Requires `ROLE_ADMIN`):**
```bash
curl -X GET http://localhost:8080/me -b cookies.txt
```

**3. Logout:**
```bash
curl -X GET http://localhost:8080/logout -b cookies.txt
```

---

## 📦 Projects API (CRUD)

All endpoints below require an authenticated session with `ROLE_ADMIN` (login first).

### 1. List projects

* **Request:** `GET /api/admin/projects`
* Optional filter: `?status=COMPLETED|UPCOMING`

```bash
curl -X GET "http://localhost:8080/api/admin/projects?status=COMPLETED" -b cookies.txt
```

### 2. Get project by id

* **Request:** `GET /api/admin/projects/{id}`

```bash
curl -X GET "http://localhost:8080/api/admin/projects/1" -b cookies.txt
```

### 3. Create project

* **Request:** `POST /api/admin/projects`
* **Body:** JSON

Example payload:

```bash
curl -X POST "http://localhost:8080/api/admin/projects" \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "status": "UPCOMING",
    "displayOrder": 10,
    "images": ["https://example.com/a.webp", "https://example.com/b.webp"],
    "translations": [
      {
        "languageCode": "pl",
        "title": "Nowy projekt",
        "description": "<b>Opis</b>"
      }
    ]
  }'
```

### 4. Update project

* **Request:** `PUT /api/admin/projects/{id}`
* **Body:** JSON (same as create)

```bash
curl -X PUT "http://localhost:8080/api/admin/projects/1" \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "status": "COMPLETED",
    "displayOrder": 1,
    "images": [],
    "translations": [
      {
        "languageCode": "pl",
        "title": "Zaktualizowany projekt",
        "description": "Opis po zmianie"
      }
    ]
  }'
```

### 5. Delete project

* **Request:** `DELETE /api/admin/projects/{id}`

```bash
curl -X DELETE "http://localhost:8080/api/admin/projects/1" -b cookies.txt
```

### Common errors

* `401 Unauthorized`: not logged in (missing/invalid session cookie).
* `403 Forbidden`: logged in, but missing `ROLE_ADMIN`.
* `404 Not Found`: project id does not exist.
* `400 Bad Request`:
  * invalid JSON body
  * validation failed (`@Valid`), e.g. missing `status` or empty `translations`
  * invalid enum value for `status` (allowed: `COMPLETED`, `UPCOMING`)
  * database constraint violation (e.g. duplicate translation `languageCode` for the same project)

### Option B: Testing with Postman

Postman will automatically store and send the `JSESSIONID` cookie after a successful login.

**1. Login**
* **Request:** `POST http://localhost:8080/login`
* **Body:** `x-www-form-urlencoded`
* **Keys:** `username` & `password`
  *(Returns `200 OK` and saves the session cookie).*

**2. Get User Info**
* **Request:** `GET http://localhost:8080/me`
* **Auth:** `No Auth`
  *(Note: Requires `ROLE_ADMIN`).*

**3. Logout**
* **Request:** `GET http://localhost:8080/logout`
