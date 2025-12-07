import React, { useState } from "react";
import axios from "axios";
import "../styles/Auth.css";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await axios.post(
        "http://localhost:4000/api/auth/login",
        { email, password },
        { withCredentials: true }
      );

      navigate("/profile");
    } catch (err) {
      setError(err.response?.data?.error || "Login failed.");
    }
  };

  return React.createElement(
    "div",
    { className: "auth-container" },
    React.createElement(
      "div",
      { className: "auth-box" },

      React.createElement("h2", null, "Welcome Back"),

      React.createElement(
        "form",
        { onSubmit: handleLogin },

        React.createElement("input", {
          type: "email",
          placeholder: "Email Address",
          value: email,
          onChange: (e) => setEmail(e.target.value),
          required: true,
        }),

        React.createElement("input", {
          type: "password",
          placeholder: "Enter Password",
          value: password,
          onChange: (e) => setPassword(e.target.value),
          required: true,
        }),

        error
          ? React.createElement(
              "p",
              { className: "error-text" },
              error
            )
          : null,

        React.createElement(
          "button",
          { className: "auth-btn", type: "submit" },
          "Login"
        )
      ),

      React.createElement(
        "button",
        {
          className: "github-btn",
          onClick: () =>
            (window.location.href =
              "http://localhost:4000/api/auth/github"),
        },
        "Sign in with GitHub"
      ),

      React.createElement(
        "p",
        { className: "switch-text" },
        "Don’t have an account? ",
        React.createElement(
          "span",
          { onClick: () => navigate("/") },
          "Sign up"
        )
      )
    )
  );
}
