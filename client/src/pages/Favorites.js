import { useEffect, useState, useContext } from "react";
import api from "../api/axiosConfig";
import { AuthContext } from "../context/AuthContext";

export default function Favorites() {
  const { user } = useContext(AuthContext);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    api.get("/asteroids/favorites/list").then(res => {
      setFavorites(res.data.favorites);
    });
  }, []);

  return (
    <div>
      <h2>{user?.name}'s Favorites</h2>
      <pre>{JSON.stringify(favorites, null, 2)}</pre>
    </div>
  );
}
