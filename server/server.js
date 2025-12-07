require("dotenv").config();

const express = require("express");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const passport = require("passport");
require("./config/passport")(passport);
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));

app.use(express.json());

// SESSION BEFORE PASSPORT
app.use(
  session({
    secret: process.env.SESSION_SECRET || "superSecret123",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      collectionName: "sessions",
      touchAfter: 24 * 3600,
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7, 
      httpOnly: true,
      secure: false,     // ← REQUIRED FOR localhost
      sameSite: "lax"    // ← REQUIRED for cross-port requests
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

// ROUTES
app.use("/api/auth", require("./routes/authRoutes"));        // <-- email/password
app.use("/api/auth", require("./routes/githubAuthRoutes"));  // <-- GitHub OAuth

app.use("/api/asteroids", require("./routes/asteroidRoutes"));
app.use("/user", require("./routes/userRoutes"));
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("Mongo error:", err));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
