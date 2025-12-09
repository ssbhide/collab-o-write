# Project Overview
Collab-o-write is a real-time collaborative text editor using a MERN-like stack (MongoDB, Express, React, Node) with Socket.io for real-time communication.

## Architecture & Data Flow
- **Client (`client/`)**: React app built with Vite. Uses `quill` for the rich text editor and `socket.io-client` for communication.
- **Server (`server/`)**: Node.js/Express server. Manages Socket.io connections and persists documents to MongoDB.
- **Database**: MongoDB (local instance expected at `mongodb://localhost:27017/collab-o-write`).
- **Communication**:
  - **Real-time**: Clients emit `send-changes` (Quill Deltas) -> Server broadcasts `receive-changes` to room.
  - **Persistence**: Client periodically emits `save-document` -> Server updates MongoDB.
  - **Initialization**: `get-document` -> Server `load-document`.

## Key Patterns & Conventions
- **Quill Integration**:
  - Use `quill.on("text-change")` to capture user edits.
  - Filter by `source === "user"` to avoid infinite loops when applying incoming changes.
  - See `client/src/TextEditor.tsx` for the complete lifecycle.
- **Socket.io Rooms**:
  - Documents are isolated by Socket.io rooms using the `documentId`.
  - Server: `socket.join(documentId)`.
- **Autosave Strategy**:
  - The client is responsible for triggering saves on an interval (currently 2s), not the server.
  - See `useEffect` with `setInterval` in `TextEditor.tsx`.

## Developer Workflow
- **Prerequisites**: Ensure MongoDB is running locally.
- **Server**:
  - `cd server`
  - `npm run dev` (Runs `nodemon src/index.ts` on port 3001).
- **Client**:
  - `cd client`
  - `npm run dev` (Runs Vite on port 5173).
- **Debugging**:
  - Check browser console for Socket.io connection errors (CORS is configured for localhost:5173).
  - Check server console for MongoDB connection status.

## Tech Stack
- **Frontend**: React, Vite, Quill, Socket.io-client, React Router.
- **Backend**: Node.js, Express, Socket.io, Mongoose, TypeScript.
