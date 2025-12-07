import React, { useState } from "react";
import axios from "axios";
import "../styles/Auth.css";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await axios.post(
        "http://localhost:4000/api/auth/signup",
        { email, password, name },
        { withCredentials: true }
      );

      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.error || "Signup failed.");
    }
  };

  return React.createElement(
    "div",
    { className: "auth-container" },
    React.createElement(
      "div",
      { className: "auth-box" },

      React.createElement("h2", null, "Create an Account"),

      React.createElement(
        "form",
        { onSubmit: handleSignup },

        React.createElement("input", {
          type: "text",
          placeholder: "Full Name",
          value: name,
          onChange: (e) => setName(e.target.value),
          required: true,
        }),

        React.createElement("input", {
          type: "email",
          placeholder: "Email Address",
          value: email,
          onChange: (e) => setEmail(e.target.value),
          required: true,
        }),

        React.createElement("input", {
          type: "password",
          placeholder: "Create Password",
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
          "Sign Up"
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
        "Continue With GitHub"
      ),

      React.createElement(
        "p",
        { className: "switch-text" },
        "Already have an account? ",
        React.createElement(
          "span",
          { onClick: () => navigate("/login") },
          "Log in"
        )
      )
    )
  );
}
