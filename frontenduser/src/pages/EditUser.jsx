// src/pages/EditUser.jsx
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function EditUser() {
  const { id } = useParams(); // get user id from route
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [contactNo, setContactNo] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState(""); // optional
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");

  // Fetch user data on mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/users/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const data = await res.json();
        if (res.ok) {
          setName(data.user.name);
          setEmail(data.user.email);
          setContactNo(data.user.contactNo);
          setAddress(data.user.address || "");
        } else {
          setServerError(data.message);
        }
      } catch (err) {
        setServerError("Error fetching user data");
      }
    };

    fetchUser();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setServerError("");

    const tempErrors = {};
    if (!name) tempErrors.name = "Name is required";
    if (!email) tempErrors.email = "Email is required";
    if (!contactNo) tempErrors.contactNo = "Contact Number is required";

    if (Object.keys(tempErrors).length > 0) {
      setErrors(tempErrors);
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/users/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ name, email, contactNo, address, password }),
      });
      const data = await res.json();
      if (res.ok) {
        alert("User updated successfully");
        navigate("/dashboard"); // or redirect to user list
      } else {
        setServerError(data.message);
      }
    } catch (err) {
      setServerError("Server error");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card fade-in">
        <h2>Edit User</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {errors.name && <p className="error-text">{errors.name}</p>}
          </div>

          <div className="input-group">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && <p className="error-text">{errors.email}</p>}
          </div>

          <div className="input-group">
            <input
              type="text"
              placeholder="Contact Number"
              value={contactNo}
              onChange={(e) => setContactNo(e.target.value)}
            />
            {errors.contactNo && <p className="error-text">{errors.contactNo}</p>}
          </div>

          <div className="input-group">
            <input
              type="text"
              placeholder="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          <div className="input-group">
            <input
              type="password"
              placeholder="Password (leave blank if unchanged)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {serverError && <p className="error-text">{serverError}</p>}
          <button type="submit">Update User</button>
        </form>
      </div>
    </div>
  );
}
