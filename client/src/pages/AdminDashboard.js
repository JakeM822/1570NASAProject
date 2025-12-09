import { useEffect, useState } from "react";
import api from "../api/axiosConfig";
import "../styles/AdminDashboard.css";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const loadUsers = async () => {
      const res = await api.get("/admin/users", { withCredentials: true });
      setUsers(res.data);
    };
    loadUsers();
  }, []);

  const promote = async (id) => {
    await api.put(`/admin/users/${id}/make-admin`, {}, { withCredentials: true });
    window.location.reload();
  };

  const demote = async (id) => {
    await api.put(`/admin/users/${id}/make-user`, {}, { withCredentials: true });
    window.location.reload();
  };

  const remove = async (id) => {
    await api.delete(`/admin/users/${id}`, { withCredentials: true });
    window.location.reload();
  };

  return (
    <div className="admin-dashboard-container">
      <h1 className="admin-title">Admin Dashboard</h1>

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u._id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td>
                  {u.role !== "admin" ? (
                    <button
                      className="admin-btn make-admin-btn"
                      onClick={() => promote(u._id)}
                    >
                      Make Admin
                    </button>
                  ) : (
                    <button
                      className="admin-btn demote-btn"
                      onClick={() => demote(u._id)}
                    >
                      Demote
                    </button>
                  )}

                  <button
                    className="admin-btn delete-btn"
                    onClick={() => delete(u._id)}
                  >
                    Delete User
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
