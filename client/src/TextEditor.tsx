import { useCallback, useEffect, useState } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { io, Socket } from "socket.io-client";
import { useParams } from "react-router-dom";

// Standard toolbar options
const TOOLBAR_OPTIONS = [
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  [{ font: [] }],
  [{ list: "ordered" }, { list: "bullet" }],
  ["bold", "italic", "underline"],
  [{ color: [] }, { background: [] }],
  [{ script: "sub" }, { script: "super" }],
  [{ align: [] }],
  ["image", "blockquote", "code-block"],
  ["clean"],
];

export default function TextEditor() {
  const { id: documentId } = useParams();
  const [socket, setSocket] = useState<Socket>();
  const [quill, setQuill] = useState<Quill>();
  const [userCount, setUserCount] = useState(0);

  // 1. Establish Socket Connection
  useEffect(() => {
    const s = io(import.meta.env.VITE_SERVER_URL || "http://localhost:3001");
    setSocket(s);
    return () => {
      s.disconnect();
    };
  }, []);

  // 2. Create Quill Instance
  const wrapperRef = useCallback((wrapper: HTMLDivElement) => {
    if (wrapper == null) return;
    wrapper.innerHTML = "";
    
    const editor = document.createElement("div");
    wrapper.append(editor);
    
    const q = new Quill(editor, {
      theme: "snow",
      modules: { toolbar: TOOLBAR_OPTIONS },
    });
    
    // Start disabled until we load the doc
    q.disable();
    q.setText("Loading...");
    setQuill(q);
  }, []);

  // 3. Load Document & Listen for Changes
  useEffect(() => {
    if (socket == null || quill == null || documentId == null) return;

    // Load document
    socket.once("load-document", (document) => {
      quill.setContents(document);
      quill.enable();
    });

    socket.emit("get-document", documentId);
  }, [socket, quill, documentId]);

  // 4. Save Document (Interval)
  useEffect(() => {
    if (socket == null || quill == null) return;

    const interval = setInterval(() => {
      socket.emit("save-document", quill.getContents());
    }, 2000); // Save every 2 seconds

    return () => {
      clearInterval(interval);
    };
  }, [socket, quill]);

  // 5. Broadcast Changes (Typing)
  useEffect(() => {
    if (socket == null || quill == null) return;

    const handler = (delta: any, oldDelta: any, source: string) => {
      if (source !== "user") return;
      socket.emit("send-changes", delta);
    };

    quill.on("text-change", handler);

    return () => {
      quill.off("text-change", handler);
    };
  }, [socket, quill]);

  // 6. Receive Changes (Others Typing)
  useEffect(() => {
    if (socket == null || quill == null) return;

    const handler = (delta: any) => {
      quill.updateContents(delta);
    };

    socket.on("receive-changes", handler);

    return () => {
      socket.off("receive-changes", handler);
    };
  }, [socket, quill]);

  // 7. User Count
  useEffect(() => {
    if (socket == null) return;

    const handler = (count: number) => {
      setUserCount(count);
    };

    socket.on("user-count", handler);

    return () => {
      socket.off("user-count", handler);
    };
  }, [socket]);

  return (
    <>
      <div
        className="user-count"
        style={{
          position: "fixed",
          top: "10px",
          right: "10px",
          background: "white",
          padding: "5px 10px",
          borderRadius: "5px",
          boxShadow: "0 0 5px rgba(0,0,0,0.2)",
          zIndex: 1000,
        }}
      >
        Users online: {userCount}
      </div>
      <div className="container" ref={wrapperRef}></div>
    </>
  );
}