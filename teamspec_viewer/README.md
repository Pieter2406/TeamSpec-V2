# TeamSpec Viewer

A role-based documentation viewer for TeamSpec workspaces.

## Overview

TeamSpec Viewer provides a web-based interface for navigating and reading TeamSpec documentation. It supports role-specific dashboards (BA, FA) that surface relevant artifacts for each role.

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS + Material UI
- **Backend**: Hono.js on Node.js

## Prerequisites

- Node.js >= 18.0.0
- pnpm (recommended) or npm

## Getting Started

### Install Dependencies

```bash
pnpm install
```

### Run Development Server

```bash
pnpm dev
```

This starts both:
- Frontend: http://localhost:5173
- Backend: http://localhost:3000

### Health Check

Verify the backend is running:

```bash
curl http://localhost:3000/health
# Returns: {"status":"ok"}
```

## Project Structure

```
teamspec_viewer/
├── frontend/           # React frontend application
│   ├── src/
│   │   ├── main.tsx   # Entry point
│   │   ├── App.tsx    # Root component
│   │   └── index.css  # Global styles
│   └── package.json
├── backend/            # Hono.js backend server
│   ├── src/
│   │   ├── index.ts   # Server entry point
│   │   └── routes/    # API routes
│   └── package.json
├── products/           # TeamSpec Product Canon
├── projects/           # TeamSpec Project artifacts
└── package.json        # Root workspace config
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start both frontend and backend in dev mode |
| `pnpm build` | Build frontend for production |
| `pnpm test` | Run backend tests |
| `pnpm lint` | Lint all code |

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Health check - returns `{ status: "ok" }` |
| `/api` | GET | API info |

## License

Private - TeamSpec Viewer MVP
