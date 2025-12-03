require("dotenv").config();              // 1. Load environment variables

const express = require("express");
const session = require("express-session");
const passport = require("./config/passport");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

// 2. CREATE APP BEFORE USING IT
const app = express();

// 3. MIDDLEWARE
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));

app.use(express.json());

// 4. SESSION MIDDLEWARE
app.use(
  session({
    secret: process.env.SESSION_SECRET || "fallbacksecret",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
  })
);

// 5. PASSPORT INITIALIZATION
app.use(passport.initialize());
app.use(passport.session());

// 6. CONNECT TO DATABASE
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("Mongo error:", err));

// 7. ROUTES
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/asteroids", require("./routes/asteroidRoutes"));

// 8. START SERVER
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
