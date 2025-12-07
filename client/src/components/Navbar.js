import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="navbar">
      <a href="/" className="glow">Feed</a>
      <a href="/browse">Browse</a>
      <a href="/favorites">Favorites</a>
      <a href="/orbit">Orbit View</a>
      {!user && <a href="/login">Login</a>}
      {user && <button onClick={logout} className="cyber-btn">Logout</button>}
    </div>
  );
}
