const express = require("express");
const router = express.Router();
const { google } = require("googleapis");
const Doctor = require("../models/Doctor");
const { createEvent, listUpcomingEvents } = require("../services/googleCalendarService");

// Allow googleTokens field in schema even if not defined originally
Doctor.schema.set("strict", false);

// Google OAuth2 setup
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  "http://localhost:5000/api/google/calendar/callback"
);

// Generates the Google OAuth2 consent screen URL
router.get("/init", (req, res) => {
  const { doctorId } = req.query;

  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: [
      "https://www.googleapis.com/auth/calendar",
      "https://www.googleapis.com/auth/userinfo.email",
    ],
    state: JSON.stringify({ doctorId }),
  });

  res.json({ url });
});

router.get("/callback", async (req, res) => {
  try {
    const { code, state } = req.query;

    // Check for missing state
    if (!state || state === "undefined" || state === "null") {
      console.error("❌ Missing or invalid state in callback:", state);
      return res.status(400).json({
        success: false,
        message: "Missing or invalid state parameter in callback",
      });
    }

    // Parse doctorId from state safely
    let doctorId;
    try {
      const parsed = JSON.parse(state);
      doctorId = parsed?.doctorId;
    } catch (err) {
      console.error("⚠️ Failed to parse state JSON:", state);
      return res.status(400).json({
        success: false,
        message: "Invalid state format",
      });
    }

    if (!doctorId || doctorId === "null") {
      console.error("❌ No doctorId found in state");
      return res.status(400).json({
        success: false,
        message: "Doctor ID missing in OAuth state",
      });
    }

    console.log("📩 Callback triggered for doctor:", doctorId);

    const { tokens } = await oauth2Client.getToken(code);
    console.log("✅ Tokens received:", tokens);

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      console.log("❌ Doctor not found in DB!");
      return res.status(404).json({ success: false, message: "Doctor not found" });
    }

    doctor.googleTokens = tokens;
    await doctor.save();
    console.log("💾 Tokens saved successfully for doctor:", doctorId);

    res.redirect("http://localhost:5173/dashboard-doctor/calendar-connect?success=true");
  } catch (error) {
    console.error("Callback error:", error);
    res.status(500).json({ success: false, message: "OAuth callback failed" });
  }
});


router.post("/create-event", async (req, res) => {
  try {
    const { doctorId, eventData } = req.body;
    const doctor = await Doctor.findById(doctorId);

    if (!doctor || !doctor.googleTokens) {
      return res
        .status(400)
        .json({ success: false, message: "Doctor has not connected Google Calendar" });
    }

    // Default timezone if not provided
    eventData.start.timeZone = eventData.start.timeZone || "Asia/Kolkata";
    eventData.end.timeZone = eventData.end.timeZone || "Asia/Kolkata";

    const event = await createEvent(doctorId, doctor.googleTokens, eventData);
    res.json({ success: true, event });
  } catch (err) {
    console.error("Create event error:", err);
    res.status(500).json({ success: false, message: "Failed to create calendar event" });
  }
});

router.get("/list-events/:doctorId", async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.doctorId);
    if (!doctor || !doctor.googleTokens) {
      return res
        .status(400)
        .json({ success: false, message: "Doctor has not connected Google Calendar" });
    }

    const events = await listUpcomingEvents(req.params.doctorId, doctor.googleTokens);
    res.json({ success: true, events });
  } catch (err) {
    console.error("List events error:", err);
    res.status(500).json({ success: false, message: "Failed to fetch events" });
  }
});

module.exports = router;
