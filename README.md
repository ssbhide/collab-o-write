# Collab-o-write

A real-time collaborative text editor built with React, Node.js, Socket.io, and MongoDB. Multiple users can edit the same document simultaneously and see each other's changes live.

## Features

- Real-time collaborative editing powered by Socket.io
- Rich text formatting via Quill editor
- Auto-save every 2 seconds
- Live user count per document

## Prerequisites

Before running this project, make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [MongoDB](https://www.mongodb.com/try/download/community) running locally on the default port (`27017`)

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/ssbhide/collab-o-write.git
cd collab-o-write
```

### 2. Start the Server

```bash
cd server
npm install
npm run dev
```

The server will start on **http://localhost:3001**.

> **Note:** The server connects to MongoDB at `mongodb://localhost:27017/collab-o-write` by default. Make sure MongoDB is running before starting the server.

### 3. Start the Client

Open a **new terminal** in the project root:

```bash
cd client
npm install
npm run dev
```

The client will start on **http://localhost:5173**.

### 4. Open the App

Navigate to **http://localhost:5173** in your browser. You will be automatically redirected to a new unique document. Share the URL with others to collaborate in real time.

## Environment Variables (Optional)

Both the client and server work out of the box for local development. If you need to customize the URLs, create `.env` files as described below.

### Server (`server/.env`)

| Variable     | Default                                    | Description                         |
|--------------|--------------------------------------------|-------------------------------------|
| `MONGO_URI`  | `mongodb://localhost:27017/collab-o-write` | MongoDB connection string           |
| `CLIENT_URL` | `http://localhost:5173`                    | Allowed CORS origin for the client  |
| `PORT`       | `3001`                                     | Port the server listens on          |

### Client (`client/.env`)

| Variable          | Default                 | Description               |
|-------------------|-------------------------|---------------------------|
| `VITE_SERVER_URL` | `http://localhost:3001` | URL of the backend server |

## Project Structure

```
collab-o-write/
├── client/          # React + Vite frontend
│   └── src/
│       ├── App.tsx
│       └── TextEditor.tsx
└── server/          # Node.js + Express backend
    └── src/
        ├── index.ts
        └── Document.ts
```

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for instructions on deploying to a hosting provider such as Render.
