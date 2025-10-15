import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function EditUser() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [contactNo, setContactNo] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setName(data.name);
      setContactNo(data.contactNo);
      setEmail(data.email);
      setAddress(data.address);
    };
    fetchUser();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const res = await fetch(`http://localhost:5000/api/users/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ name, contactNo, email, password, address }),
    });
    const data = await res.json();
    if (res.ok) {
      setMessage("User updated successfully");
      setTimeout(() => navigate("/users"), 1000);
    } else {
      alert(data.message);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card fade-in">
        <h2>Edit User</h2>
        {message && <p className="success-text">{message}</p>}
        <form onSubmit={handleSubmit} className="form-animate">
          <input type="text" placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
          <input type="text" placeholder="Contact No" value={contactNo} onChange={e => setContactNo(e.target.value)} />
          <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
          <input type="password" placeholder="Password (leave blank to keep)" value={password} onChange={e => setPassword(e.target.value)} />
          <input type="text" placeholder="Address" value={address} onChange={e => setAddress(e.target.value)} />
          <button type="submit">Update User</button>
        </form>
      </div>
    </div>
  );
}
