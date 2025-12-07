import React, { useState } from "react";
import api from "../api/axiosConfig";
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
      await api.post("/auth/login", { email, password });

      // FIXED DESTINATION
      navigate("/account");
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
        [
          React.createElement("input", {
            key: "email",
            type: "email",
            placeholder: "Email Address",
            value: email,
            onChange: (e) => setEmail(e.target.value),
            required: true,
          }),
          React.createElement("input", {
            key: "password",
            type: "password",
            placeholder: "Enter Password",
            value: password,
            onChange: (e) => setPassword(e.target.value),
            required: true,
          }),
          error
            ? React.createElement(
                "p",
                { key: "err", className: "error-text" },
                error
              )
            : null,
          React.createElement(
            "button",
            { key: "loginbtn", className: "auth-btn", type: "submit" },
            "Login"
          )
        ]
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
