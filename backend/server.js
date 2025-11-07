const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const express = require("express");

const patientRoutes = require("./routes/patientRoutes");
const doctorRoutes = require("./routes/doctorRoutes");
const receptionistRoutes = require("./routes/receptionistRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const prescriptionRoutes = require("./routes/prescriptionRoute");
const doctorScheduleRoutes = require("./routes/doctorScheduleRoutes");
const googleCalendar= require("./routes/googleCalendar");
const authRoutes = require("./routes/authRoutes");

const { app, server } = require("./lib/socket");

dotenv.config();

app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173", "https://sanath-homeo-clinic.netlify.app"],
    credentials: true,
  })
);

app.options("*", cors());

// Routes
app.use("/api/patients", patientRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/receptionists", receptionistRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/prescriptions", prescriptionRoutes);
app.use("/api/schedule", doctorScheduleRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/google/calendar", googleCalendar);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    server.listen(process.env.PORT, () => {
      console.log(` Server running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => console.error(err));
