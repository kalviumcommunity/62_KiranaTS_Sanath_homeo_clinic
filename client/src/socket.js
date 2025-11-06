// socket.js
import { io } from "socket.io-client";

export const socket = io(import.meta.env.VITE_API_BASE_URL, {
  withCredentials: true, // important for cookie-based JWT auth
  transports: ["websocket"], // ensures stable real-time connection
});

socket.on("connect", () => {
  console.log("Connected to Socket.IO:", socket.id);
});

socket.on("disconnect", () => {
  console.log("Disconnected from Socket.IO");
});
