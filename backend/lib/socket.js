const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();
app.use(cookieParser());
app.use(express.json());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ['http://localhost:5173', 'https://sanath-homeo-clinic.netlify.app'],
    credentials: true,
  },
});

// Store all connected users by ID (for doctor/patient/receptionist)
const userSocketMap = {}; // { userId: socketId }
const userRoleMap = {};   // { userId: role }

// Authenticate socket connection using JWT from cookies
io.use(async (socket, next) => {
  try {
    const cookieHeader = socket.handshake.headers.cookie;
    if (!cookieHeader) return next(new Error("No cookies provided"));

    const token = cookieHeader
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];

    if (!token) return next(new Error("Unauthorized - No token"));

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) return next(new Error("Invalid token"));

    socket.userId = decoded.id;      // store user id
    socket.userRole = decoded.role;  // store user role
    next();
  } catch (err) {
    console.log("Socket authentication failed:", err.message);
    next(new Error("Unauthorized"));
  }
});

// When user connects
io.on("connection", (socket) => {
  const userId = socket.userId;
  const role = socket.userRole;

  userSocketMap[userId] = socket.id;
  userRoleMap[userId] = role;

  io.emit("getOnlineUsers", { onlineUsers: Object.keys(userSocketMap) });

  // Real-time appointment updates
  socket.on("appointmentStatusUpdated", (data) => {
    const { appointmentId, newStatus, doctorId, patientId, updatedBy } = data;

    console.log(`Appointment ${appointmentId} updated by ${updatedBy} → ${newStatus}`);

    // Find sockets of doctor and patient
    const targetSockets = [doctorId, patientId]
      .map((id) => userSocketMap[id])
      .filter(Boolean);

    // Emit only to them (not global broadcast)
    targetSockets.forEach((socketId) => {
      io.to(socketId).emit("appointmentStatusUpdated", data);
    });
  });

  // On disconnect
  socket.on("disconnect", () => {
    delete userSocketMap[userId];
    delete userRoleMap[userId];
    io.emit("getOnlineUsers", { onlineUsers: Object.keys(userSocketMap) });
  });
});

// Utility to find socket by userId
const getReceiverSocketId = (userId) => userSocketMap[userId];

module.exports = { app, server, io, getReceiverSocketId };
