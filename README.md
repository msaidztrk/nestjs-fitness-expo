
# Fitness App Backend (NestJS + MySQL)

A scalable and SOLID-compliant backend for a fitness tracking application, built with NestJS and MySQL.

## Features

-   **Modular Architecture**: Application is divided into functional modules (`Users`, `Metrics`, `Auth`).
-   **Database**: MySQL 8.0+ with TypeORM and `snake_case` naming strategy.
-   **Security**:
    -   JWT Authentication (Long-lived tokens).
    -   Global `AuthGuard` with optional public routes.
    -   Bcrypt password hashing.
-   **Validation**: Strict DTO validation using `class-validator` and global `ValidationPipe`.
-   **Dockerized**: Complete Docker support for easy development and production deployment.
-   **Automated Migrations**: Migrations run automatically on container startup.

---

## Docker Usage Guide

This project is fully configured with Docker. We use:
-   **Dockerfile**: Multi-stage build for optimized images.
-   **docker-compose.yml**: Orchestrates the NestJS app and MySQL database.

### Prerequisites
-   [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running.

---

### Development Workflow

#### 1. Start the Environment
To start both the application and the database in development mode:
```bash
docker-compose up --build
```
-   **`--build`**: This is **CRITICAL**. It rebuilds the Docker image. **Always run this if you have changed `package.json`** or want to ensure your latest code changes are reflected in the container.
-   **Migrations**: The system automatically runs `npm run migration:run` on every startup via `docker-entrypoint.sh`.

#### 2. Access the Application
-   **API**: http://localhost:3000/api
-   **Database**: Port `3306` (User: `root`, Password: `root`, DB: `fitness_app`)

#### 3. Updating Code & Re-deploying locally
If you make changes to your code (e.g., changed a Service or Controller):
1.  Stop the running container: `Ctrl+C` (or `docker-compose down` in another terminal).
2.  Run the build command again:
    ```bash
    docker-compose up --build
    ```
    *Strictly speaking, you only need `--build` if you install new packages, but it's safest to always use it to ensure the `dist` folder is fresh.*

#### 4. Creating New Migrations
When you change an Entity, you need to generate a migration file. You can do this from your host machine (if you have npm installed) or via Docker.
**Via Host (Recommended):**
```bash
npm run migration:generate -- src/migrations/UpdateUserEntity
```
Then restart Docker to apply it (`docker-compose up --build`).

---

### Production Deployment

#### 1. Run in Background (Detached)
For production (or to keep usage lighter), run the containers in the background:
```bash
docker-compose up -d --build
```
The `--build` flag ensures you are deploying the latest version of your code.

#### 2. Monitoring
To see the logs of the running production containers:
```bash
docker-compose logs -f
```
To check the status of containers:
```bash
docker-compose ps
```

#### 3. Stopping Production
To stop the containers without deleting data:
```bash
docker-compose down
```
To stop and **remove volumes** (reset database data):
```bash
docker-compose down -v
```

---

## Manual Installation (Without Docker)

If you prefer to run it manually:

1.  **Install Dependencies**:
    ```bash
    npm install
    ```
2.  **Configure Environment**:
    Copy `.env.example` to `.env` and update the database credentials.
3.  **Run Migrations**:
    ```bash
    npm run migration:run
    ```
4.  **Start Application**:
    ```bash
    # development
    npm run start:dev

    # production build
    npm run build
    npm run start:prod
    ```

## License
[MIT licensed](LICENSE)
