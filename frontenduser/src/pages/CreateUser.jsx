import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Auth.css";

export default function CreateUser() {
  const [name, setName] = useState("");
  const [contactNo, setContactNo] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!name || !contactNo || !email || !password) {
      setError("Name, Contact No, Email, and Password are required");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/users/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, contactNo, email, password, address }),
      });
      const data = await res.json();
      setLoading(false);

      if (res.ok) {
        setMessage(data.message);
        setTimeout(() => navigate("/dashboard"), 1000);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setLoading(false);
      setError("Something went wrong");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card fade-in">
        <h2>Create New User</h2>
        <form onSubmit={handleSubmit} className="form-animate">
          <div className="input-group">
            <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)}/>
          </div>
          <div className="input-group">
            <input type="text" placeholder="Contact No" value={contactNo} onChange={(e) => setContactNo(e.target.value)}/>
          </div>
          <div className="input-group">
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="input-group">
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}/>
          </div>
          <div className="input-group">
            <input type="text" placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)}/>
          </div>

          {error && <p className="error-text">{error}</p>}
          {message && <p className="success-text">{message}</p>}

          <button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create User"}
          </button>
        </form>

        <div  style={{ marginTop: "20px" }}>
            <button
            onClick={() => navigate("/dashboard")}
            className="back-btn"
            >
            ← Back to Dashboard
            </button>
        </div>
      </div>
    </div>
  );
}
