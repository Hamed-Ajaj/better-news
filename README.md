# Better News

This is a full-stack web application for a news sharing platform.

## Project Overview

### Backend

*   **Framework:** Hono (Node.js)
*   **Database:** PostgreSQL
*   **ORM:** Drizzle ORM
*   **Authentication:** Lucia
*   **Entrypoint:** `server/index.ts`

### Frontend

*   **Framework:** React
*   **Bundler:** Vite
*   **Routing:** Tanstack Router
*   **Data Fetching:** Tanstack Query
*   **Styling:** Tailwind CSS and Radix UI
*   **Entrypoint:** `frontend/src/main.tsx`

### Shared

*   The `shared` directory contains types that are used by both the frontend and backend.

## Getting Started

### Prerequisites

*   [Bun](https://bun.sh/)
*   [Docker](https://www.docker.com/)

### Database Setup

This project uses a PostgreSQL database. The easiest way to get a database running is to use the provided Docker Compose configuration.

1.  **Start the database container:**
    ```sh
    docker-compose up -d db
    ```
2.  **Set the database URL environment variable:**
    Create a `.env` file in the root of the project and add the following line:
    ```
    DATABASE_URL=postgresql://user:password@localhost:5432/betternewsdb
    ```

### Installation

To install the project dependencies, run the following command:

```sh
bun install
```

### Running the Application

**Development Mode:**

To run the application in development mode (backend on port 3000, frontend on port 3001), use:

```sh
bun run dev
```

The application will be accessible at `http://localhost:3000`.

**Production Mode:**

To build and run the application for production:

```sh
bun run frontend:build
bun run start
```

## Docker

The `compose.yml` file defines the services for the application.

*   `db`: A PostgreSQL 17 database.
*   `app`: A commented-out service for running the application in a container. This is not used for local development.

To start the database service, run:
```sh
docker-compose up -d db
```

To stop the database service, run:
```sh
docker-compose down
```

The database data is persisted in a Docker volume named `postgres-data`.

## Development Conventions

*   **Formatting:** The project uses Prettier for code formatting. To format your code, run:
    ```sh
    bun run format:write
    ```
*   **Linting:** ESLint is used for code linting.
    *   For the backend:
        ```sh
        bun run lint:server
        ```
    *   For the frontend:
        ```sh
        bun run lint:frontend
        ```
*   **API Routes:** Backend API routes are defined in `server/routes` and registered in `server/index.ts`.
*   **Frontend Routes:** Frontend routes are managed by Tanstack Router's file-based routing, with definitions in `frontend/src/routes`.
*   **Shared Types:** Common types used across both frontend and backend should be placed in `shared/types.ts`.
*   **Database Migrations:** The project uses Drizzle ORM for database migrations. To generate a migration, run:
    ```sh
    bun drizzle-kit generate
    ```
    To apply migrations, you will need to add a script to your `package.json` to run them.
