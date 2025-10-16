import { useEffect, useState } from "react";

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/users", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await res.json();

      if (res.ok) {
        if (Array.isArray(data)) {
          setUsers(data);
        } else if (Array.isArray(data.users)) {
          setUsers(data.users);
        } else {
          setUsers([]);
        }
      } else {
        alert(data.message || "Failed to fetch users");
      }
    } catch (err) {
      alert("Error fetching users");
    } finally {
      setLoading(false);
    }
  };


    const handleEdit = (id) => {
    navigate(`/edit-user/${id}`);
    };


  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/users/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await res.json();
       if (res.ok) fetchUsers();
      else alert(data.message);
    } catch (err) {
      alert("Error deleting user");
    }
  };

  if (loading) {
    return <p style={{ textAlign: "center" }}>Loading users...</p>;
  }

  return (
    <div className="user-table-container">
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Contact No</th>
            <th>Email</th>
            <th>Address</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {!users || users.length === 0 ? (
            <tr>
              <td colSpan={5} style={{ textAlign: "center", padding: "20px" }}>
                No users found
              </td>
            </tr>
          ) : (
            users.map((user) => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.contactNo || "-"}</td>
                <td>{user.email}</td>
                <td>{user.address || "-"}</td>
                <td>
                    <div className="action-buttons">
                        <button onClick={() => handleEdit(user._id)}>Edit</button>
                        <button onClick={() => handleDelete(user._id)}>Delete</button>
                    </div>
                </td>

              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
