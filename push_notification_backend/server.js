require("dotenv").config();
const express = require("express");
const { getAccessToken } = require("./src/services/fcmService");

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Define routes
app.post("/send-notification", async (req, res) => {
  try {
    const { token, title, body } = req.body;
    const result = await getAccessToken();
    // You can use the access token here to make any API calls or send notifications
    res.json({ success: true, message: "Notification sent", result });
  } catch (error) {
    console.error("Error sending notification:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
