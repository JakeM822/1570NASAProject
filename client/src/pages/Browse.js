import { useEffect, useState } from "react";
import api from "../api/axiosConfig";

export default function Browse() {
  const [page, setPage] = useState(0);
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get(`/asteroids/browse?page=${page}`).then(res => setData(res.data));
  }, [page]);

  return (
    <div>
      <h2>Browse Asteroids</h2>

      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}

      <button onClick={() => setPage(page - 1)} disabled={page <= 0}>Prev</button>
      <button onClick={() => setPage(page + 1)}>Next</button>
    </div>
  );
}
