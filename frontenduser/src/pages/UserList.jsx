import { useEffect, useState } from "react";

export default function UserList() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/users", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await res.json();
      if (res.ok) setUsers(data.users);
      else alert(data.message);
    } catch (err) {
      alert("Error fetching users");
    }
  };

  const handleEdit = (id) => {
    // navigate to edit page or show modal
    alert("Edit user " + id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/users/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await res.json();
      if (res.ok) fetchUsers(); // refresh table
      else alert(data.message);
    } catch (err) {
      alert("Error deleting user");
    }
  };

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
          {users.length === 0 ? (
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
                  <button onClick={() => handleEdit(user._id)}>Edit</button>
                  <button onClick={() => handleDelete(user._id)}>Delete</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
