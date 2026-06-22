const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db.js");
const grantRoutes = require("./routes/grantRoutes.js");

dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(cors({
  origin: "http://localhost:3000",
  
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Routes
app.use("/api/grants", grantRoutes);

// AUTH LOGIN ENDPOINT
app.post("/api/auth/login", (req, res) => {
  const { username, password } = req.body;
  console.log("Login attempt:", username, password);
  
  if (username === "admin" && password === "1234") {
    res.json({
      success: true,
      token: "mock-jwt-token-" + Date.now(),
      user: { username: "admin", role: "administrator" }
    });
  } else {
    res.status(401).json({ 
      success: false, 
      message: "Invalid credentials. Use admin / 1234" 
    });
  }
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;