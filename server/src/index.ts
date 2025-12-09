import express from "express";
import mongoose from "mongoose";
import { Server } from "socket.io";
import http from "http";
import Document from "./Document";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());

const server = http.createServer(app);

// 1. Setup Socket.io
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

// 2. Connect to DB
mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/collab-o-write")
  .then(() => console.log("Creating/Connecting to MongoDB..."))
  .catch((err) => console.error(err));

// 3. Socket Logic
const defaultValue = "";

io.on("connection", (socket) => {
  socket.on("get-document", async (documentId) => {
    const document = await findOrCreateDocument(documentId);
    
    // Safety check: If no document is returned, stop execution
    if (!document) return; 

    socket.join(documentId);
    socket.emit("load-document", document.data);

    // Send user count to all users in the room
    const room = io.sockets.adapter.rooms.get(documentId);
    io.to(documentId).emit("user-count", room ? room.size : 0);

    socket.on("send-changes", (delta) => {
      socket.broadcast.to(documentId).emit("receive-changes", delta);
    });

    socket.on("save-document", async (data) => {
      await Document.findByIdAndUpdate(documentId, { data });
    });
  });

  socket.on("disconnecting", () => {
    socket.rooms.forEach((room) => {
      // socket.rooms contains the socket ID itself, which we can ignore
      if (room !== socket.id) {
        const roomSize = io.sockets.adapter.rooms.get(room)?.size || 0;
        // The user is still in the room, so subtract 1
        io.to(room).emit("user-count", roomSize - 1);
      }
    });
  });
});

async function findOrCreateDocument(id: string) {
  if (id == null) return;
  const document = await Document.findById(id);
  if (document) return document;
  return await Document.create({ _id: id, data: defaultValue });
}

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`SERVER RUNNING ON PORT ${PORT}`);
});