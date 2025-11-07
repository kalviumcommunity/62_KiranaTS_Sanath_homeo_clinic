// services/googleCalendarService.js
const { google } = require("googleapis");
const Doctor = require("../models/Doctor");

// Helper: Create OAuth2 client with stored credentials
function getOAuthClient(tokens) {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
  );
  oauth2Client.setCredentials(tokens);
  return oauth2Client;
}

// 🔁 Refresh token if expired or invalid
async function refreshAccessTokenIfNeeded(oauth2Client, doctorId) {
  try {
    // Force-refresh if access_token expired
    const newTokens = await oauth2Client.refreshAccessToken();
    const updatedTokens = newTokens.credentials;

    // Update in DB
    await Doctor.findByIdAndUpdate(doctorId, { googleTokens: updatedTokens });
    console.log("🔄 Access token refreshed and saved for doctor:", doctorId);

    return updatedTokens;
  } catch (err) {
    console.error("⚠️ Failed to refresh access token:", err.message);
    throw err;
  }
}

// ✅ Create a calendar event
async function createEvent(doctorId, tokens, eventData) {
  const oauth2Client = getOAuthClient(tokens);
  const calendar = google.calendar({ version: "v3", auth: oauth2Client });

  try {
    const res = await calendar.events.insert({
      calendarId: "primary",
      resource: eventData,
    });
    return res.data;
  } catch (err) {
    // If token expired, auto-refresh and retry once
    if (err.code === 401) {
      console.log("⚠️ Access token expired, refreshing...");
      const newTokens = await refreshAccessTokenIfNeeded(oauth2Client, doctorId);
      oauth2Client.setCredentials(newTokens);

      const calendarRetry = google.calendar({ version: "v3", auth: oauth2Client });
      const retryRes = await calendarRetry.events.insert({
        calendarId: "primary",
        resource: eventData,
      });
      return retryRes.data;
    }
    throw err;
  }
}

// ✅ List events
async function listUpcomingEvents(doctorId, tokens, maxResults = 5) {
  const oauth2Client = getOAuthClient(tokens);
  const calendar = google.calendar({ version: "v3", auth: oauth2Client });

  try {
    const res = await calendar.events.list({
      calendarId: "primary",
      timeMin: new Date().toISOString(),
      maxResults,
      singleEvents: true,
      orderBy: "startTime",
    });
    return res.data.items;
  } catch (err) {
    if (err.code === 401) {
      console.log("⚠️ Token expired while listing events. Refreshing...");
      const newTokens = await refreshAccessTokenIfNeeded(oauth2Client, doctorId);
      oauth2Client.setCredentials(newTokens);

      const calendarRetry = google.calendar({ version: "v3", auth: oauth2Client });
      const retryRes = await calendarRetry.events.list({
        calendarId: "primary",
        timeMin: new Date().toISOString(),
        maxResults,
        singleEvents: true,
        orderBy: "startTime",
      });
      return retryRes.data.items;
    }
    throw err;
  }
}

module.exports = { createEvent, listUpcomingEvents };
