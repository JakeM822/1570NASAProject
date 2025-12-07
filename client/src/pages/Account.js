import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";

export default function Account() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("http://localhost:4000/user/me")
      .then(res => setUser(res.data))
      .catch(err => {
        console.log("ME ERROR:", err);
        navigate("/login");
      });
  }, []);

  const handleLogout = () => {
    api.post("/auth/logout").then(() => navigate("/login"));
  };

  if (!user) {
    return React.createElement("p", null, "Loading account...");
  }

  // -------------------- INLINE STYLES --------------------

  const containerStyle = {
    padding: "50px 0",
    color: "#e0f7ff",
    fontFamily: "'Orbitron', sans-serif",
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  };
  const titleStyle = {
    fontSize: "32px",
    marginBottom: "25px",
    textShadow: "0 0 10px rgba(0,255,255,0.6)"
  };

  const cardStyle = {
    width: "70%",                 
    maxWidth: "900px",            
    minWidth: "500px",            
    margin: "0 auto",             
    padding: "30px",
    background: "rgba(0, 15, 30, 0.75)",
    borderRadius: "12px",
    border: "1px solid rgba(0,255,255,0.3)",
    backdropFilter: "blur(8px)",
    boxShadow: "0 0 25px rgba(0,255,255,0.2)"
  };


  const infoTextStyle = {
    marginBottom: "12px",
    fontSize: "16px"
  };

  const editBtnStyle = {
    width: "100%",
    marginTop: "10px",
    padding: "10px",
    borderRadius: "6px",
    background: "#1b6eff",
    border: "none",
    color: "#fff",
    cursor: "pointer",
    transition: "0.2s"
  };

  const logoutBtnStyle = {
    width: "100%",
    marginTop: "15px",
    padding: "10px",
    borderRadius: "6px",
    background: "#c53030",
    border: "none",
    color: "#fff",
    cursor: "pointer",
    transition: "0.2s"
  };

  // -------------------------------------------------------

  return React.createElement(
    "div",
    { style: containerStyle },
    [
      React.createElement(
        "h2",
        { key: "title", style: titleStyle },
        "Account Management"
      ),

      React.createElement(
        "div",
        { key: "card", style: cardStyle },
        [
          React.createElement(
            "p",
            { key: "username", style: infoTextStyle },
            `Username: ${user.name || "Not provided"}`
          ),

          React.createElement(
            "p",
            { key: "email", style: infoTextStyle },
            `Email: ${user.email}`
          ),

          React.createElement(
            "p",
            { key: "type", style: infoTextStyle },
            `Account Type: ${user.githubId ? "GitHub Login" : "Email Login"}`
          ),

          React.createElement(
            "p",
            { key: "created", style: infoTextStyle },
            `Member Since: ${
              user.createdAt
                ? new Date(user.createdAt).toLocaleDateString()
                : "Unknown"
            }`
          ),

          React.createElement(
            "p",
            { key: "lastLogin", style: infoTextStyle },
            `Last Login: ${
              user.lastLogin
                ? new Date(user.lastLogin).toLocaleString()
                : "Unavailable"
            }`
          ),

          // EDIT PROFILE BUTTON
          React.createElement(
            "button",
            {
              key: "edit",
              style: editBtnStyle,
              onMouseEnter: e => (e.target.style.background = "#0057e7"),
              onMouseLeave: e => (e.target.style.background = "#1b6eff"),
              onClick: () => alert("Edit profile coming soon!")
            },
            "Edit Profile"
          ),

          // SIGN OUT
          React.createElement(
            "button",
            {
              key: "logout",
              style: logoutBtnStyle,
              onMouseEnter: e => (e.target.style.background = "#9b1c1c"),
              onMouseLeave: e => (e.target.style.background = "#c53030"),
              onClick: handleLogout
            },
            "Sign Out"
          )
        ]
      )
    ]
  );
}
