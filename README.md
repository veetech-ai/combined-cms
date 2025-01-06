# Content Management Dashboard

This CMS is a full-stack web application built with **Node.js**, **Express**, and **React.js**. And includes Docker support for containerized deployment.

## Features

- Backend API with **Express.js**.
- Frontend application built with **React.js** and **Vite**.
- **Zustand** for state management in frontend.
- File uploads handled with **Multer**.
- Real-time updates powered by **Socket.IO**.
- Dockerized setup for development and production environments.
- Tailwind CSS for responsive design.

---

## Requirements

- **Node.js**: v20+
- **Docker** and **Docker Compose**
- **npm**: v9+

---

## Installation

#### 1. Clone the Repository

```bash
git clone https://github.com/teckmk/core-cms.git
cd core-cms
```

#### 2. Install Dependencies

```bash
npm install
```

#### 3. Create `.env` file in project root. See [complete list of variables](#environment-variables)

## Development Setup

### Using Local Environment

1. Start required services using the development `dev-docker-compose.yml` file:

   ```bash
   docker compose -f dev-docker-compose.yml up
   ```

2. Build the React app before starting the server:

   ```bash
   npm run build
   ```

3. Run Migration to setup Database

   ```bash
   npm run db:migrate
   ```

4. Start the Backend Server (dev mode)

   ```bash
   npm run server:dev
   ```

5. Seed the database for initial data (users, organizations and stores) to work with:

   ```bash
   npm run db:seed
   ```

6. Start React app:

   ```bash
   npm run dev
   ```

7. Access services:

   - Frontend: `http://localhost:5173`
   - Backend (Static React App): `http://localhost:3000/` _(Requires `npm run build` command to reflect changes)_
   - Backend (REST APIs): `http://localhost:3000/api`
   - Adminer: `http://localhost:8080`

8. To create new migration (when changes in DB schema are needed):
   ```bash
   npm run db:migrate:new
   ```

## Production Setup

1. Build Docker images:

   ```bash
   docker compose build
   ```

2. Start containers:

   ```bash
   docker compose up -d
   ```

3. Access services:
   - App: `http://localhost:3000`
   - APIs: `http://localhost:3000/api`

## Scripts

### NPM Scripts

- **`npm start`**: Runs the Node.js server in **production mode**.
- **`npm run dev`**: Starts the development environment with hot reloading.
- **`npm run build`**: Builds the React app for **production**.
- **`npm run lint`**: Lints the code using ESLint.
- **`npm run preview`**: Previews the built React app.
- **`npm run server:dev`**: Runs the Node.js server in dev mode.
- **`npm run db:migrate`**: Runs the existing migrations.
- **`npm run db:migrate:new`**: Creates new migration.
- **`npm run db:seed`**: Seeds some dummy data in db for development.
- **`npm run db:seed:production`**: Seeds required data (i.e. super admin user) in db for **production**.
- **`npm run db:build`**: Syncs the Prisma Client with `schema.prisma`.

## Docker Setup

### Docker Services

- **App**: Runs the Node.js server and React app.
- **PostgreSQL**: Main Database.
- **Adminer**: Database management tool.

### Volumes

- **`server/uploads`**: For storing uploaded files.
- **`server/data`**: Persistent storage for server-side data.
- **`postgres_data`**: Persistent storage for PostgreSQL.

### Networks

All services communicate over a shared Docker network `app_network`.

## Environment Variables

> Variables marked with `*` are required, and must be set.

| Variable                   | Description                                                                 | Default               |
| -------------------------- | --------------------------------------------------------------------------- | --------------------- |
| `SERVER_PORT`              | Port for the app to run on                                                  | 4000                  |
| `DB_HOST`                  | Database host                                                               | localhost             |
| `DB_PORT`                  | Port for the DB to run on                                                   | 5432                  |
| `DB_NAME`                  | Database name                                                               | app_db                |
| `DB_USER`                  | Database admin user                                                         | postgres              |
| `DB_PASSWORD`              | Database admin password                                                     | postgres              |
| `DB_SSL`                   | Whether to use SSL on DB connection                                         | false                 |
| `DATABASE_URL`             | The database connection url string (required by prisma)                     | \*                    |
| `CORS_ORIGIN`              | The frontend app url, if server and frontend are running on different ports | http://localhost:5173 |
| `CORS_CREDENTIALS`         | Whether to allow cookies                                                    | true                  |
| `JWT_ACCESS_TOKEN_SECRET`  | Long random string to sign access tokens                                    | \*                    |
| `JWT_REFRESH_TOKEN_SECRET` | Even longer, complex and random string to sign refresh tokens               | \*                    |
| `JWT_ACCESS_TOKEN_EXPIRY`  | Access token expiry time                                                    | 15m                   |
| `JWT_REFRESH_TOKEN_EXPIRY` | Refresh token expiry time                                                   | 7d                    |
| `JWT_REFRESH_THRESHOLD_MS` | Access token automatic refresh threshold                                    | 300                   |

## Technologies Used

- **Backend**: Node.js, Express
- **Frontend**: React.js, Vite, Typescript, Zustand
- **Real-time**: Socket.IO
- **Styling**: Tailwind CSS
- **Others**: Docker, Puppeteer, QRCode generation

## Contribution

1. Clone the repository.
2. Create a feature branch: `git checkout -b feature-name`.
3. Commit your changes: `git commit -m "Add feature name"`.
4. Push to the branch: `git push origin feature-name`.
5. Create a Pull Request.
6. Ask your peer for Review.
7. Merge into `main` after approval from your peer.
