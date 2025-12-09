import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);

  return React.createElement(
    "div",
    { className: "navbar" },
    [
      // Feed
      React.createElement(
        Link,
        { key: "feed", to: "/", className: "glow" },
        "Feed"
      ),

      // Browse
      React.createElement(
        Link,
        { key: "browse", to: "/browse" },
        "Browse"
      ),

      // Favorites
      React.createElement(
        Link,
        { key: "favorites", to: "/favorites" },
        "Favorites"
      ),

      // Orbit View
      React.createElement(
        Link,
        { key: "orbit", to: "/orbit" },
        "Orbit View"
      ),

      // Account
      React.createElement(
        Link,
        { key: "account", to: "/account" },
        "Account"
      ),

      // Login (if no user)
      !user &&
        React.createElement(
          Link,
          { key: "login", to: "/login" },
          "Login"
        ),

      // Logout button (if user exists)
      user &&
        React.createElement(
          "button",
          {
            key: "logout",
            onClick: logout,
            className: "cyber-btn"
          },
          "Logout"
        ),
      user?.role === "admin" &&
            React.createElement(
              Link, { to: "/admin", className: "cyber-btn" }, "Admin"
        )
    ]
  );
}
