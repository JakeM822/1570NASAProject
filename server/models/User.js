// server/models/User.js
const mongoose = require("mongoose");

const FavoriteAsteroidSchema = new mongoose.Schema(
  {
    asteroidId: { type: String, required: true },
    name: String,
    hazardous: Boolean
  },
  { _id: false }
);

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    favorites: [FavoriteAsteroidSchema]
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
