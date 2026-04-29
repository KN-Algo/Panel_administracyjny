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
│       └── resources/       # Configuration and static assets
│           ├── static/      # Static resources served by the server
│           │   └── assets/     # Application images (e.g., KN logo)
│           └── application.properties # Main configuration file
├── .gitignore               # Git ignored files
├── docker-compose.yml       # Docker configuration for the local database
└── pom.xml                  # Maven build configuration
```

**Note**: Dynamic user uploads are stored outside the source tree in a directory defined by the `app.upload.dir` property to ensure persistence across builds. Static internal resources are served from `src/main/resources/static/assets/`.

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
