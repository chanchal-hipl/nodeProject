import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import "../Auth.css";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset errors
    setErrors({});
    setServerError("");

    // Frontend validation
    const tempErrors = {};
    if (!name) tempErrors.name = "Name is required";
    if (!email) tempErrors.email = "Email is required";
    if (!password) tempErrors.password = "Password is required";
    if (password && password.length > 8) tempErrors.password = "Password max 8 characters";

    if (Object.keys(tempErrors).length > 0) {
      setErrors(tempErrors);
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();

      if (res.ok) {
        alert(data.message || "Registered successfully!");
        navigate("/login");
      } else {
        // Map server errors to field
        const fieldErrors = {};
        if (data.message.toLowerCase().includes("name")) fieldErrors.name = data.message;
        else if (data.message.toLowerCase().includes("email")) fieldErrors.email = data.message;
        else if (data.message.toLowerCase().includes("password")) fieldErrors.password = data.message;
        else setServerError(data.message);

        setErrors(fieldErrors);
      }
    } catch (err) {
      setServerError("Server error or network issue");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card fade-in">
        <h2>Register</h2>
        <form onSubmit={handleSubmit} className="form-animate">
          
          <div className="input-group">
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setErrors({ ...errors, name: "" });
              }}
            />
            {errors.name && <p className="error-text">{errors.name}</p>}
          </div>

          <div className="input-group">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErrors({ ...errors, email: "" });
              }}
            />
            {errors.email && <p className="error-text">{errors.email}</p>}
          </div>

          <div className="input-group">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setErrors({ ...errors, password: "" });
              }}
            />
            {errors.password && <p className="error-text">{errors.password}</p>}
          </div>

          {serverError && <p className="error-text">{serverError}</p>}

          <button type="submit">Register</button>
        </form>

        <p>
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  );
}
