# DevLog: Final Year Project Blog (React + json-server)

A blog for Software Engineering students to share posts about their final year projects.
Built with **React (Vite)** for the frontend and **json-server** as a simulated REST API backend.

## Features
- Homepage showing the latest 3 posts
- Create, view, edit and delete posts
- Tagging, tag filtering and search (extra feature)
- Unit tests with Vitest

## Requirements
- Node.js 22.12 or newer
- npm

## Project Structure
```
blog-react-express/
├── backend/     json-server API (db.json)
└── frontend/    React app
```

## How to Run

### 1. Start the backend (Terminal 1)
```bash
cd backend
npm install
npm start
```
API runs at http://localhost:3001

### 2. Start the frontend (Terminal 2)
```bash
cd frontend
npm install
npm run dev
```
App runs at http://localhost:5173

> Create `frontend/.env` with: `VITE_API_URL=http://localhost:3001`

## Run Tests
```bash
cd frontend
npm test
npm run test:coverage
```

## API Endpoints
| Method | Endpoint | Description |
|---|---|---|
| GET | /posts | Get all posts |
| GET | /posts/:id | Get one post |
| POST | /posts | Create a post |
| PATCH | /posts/:id | Update a post |
| DELETE | /posts/:id | Delete a post |

## Tech Stack
React, Vite, React Router, json-server, Vitest

## Authors
- Name 1
- Name 2
- Name 3
