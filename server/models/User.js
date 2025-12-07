const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    // ⭐ FIX: ADD FAVORITES ARRAY HERE
    favorites: [
      {
        asteroidId: { type: String, required: true },
        name: { type: String, required: true },
        hazardous: { type: Boolean, default: false },
      },
    ],
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema, "login");

module.exports = User;
