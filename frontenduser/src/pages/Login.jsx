// src/pages/Login.jsx
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import "../Auth.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setServerError("");

    // 🔹 Basic Frontend Validation
    const newErrors = {};
    if (!email) newErrors.email = "Email is required";
    if (!password) newErrors.password = "Password is required";
    if (password && password.length < 8)
      newErrors.password = "Password must be at least 8 characters";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      setLoading(false);

      if (res.ok) {
        // success message fade-in
        localStorage.setItem("token", data.token);
        navigate("/dashboard", { state: { successMessage: data.message || "Login successful!" } });
      } else {
        // show specific field error or general error
        if (data.message?.toLowerCase().includes("email"))
          setErrors({ email: data.message });
        else if (data.message?.toLowerCase().includes("password"))
          setErrors({ password: data.message });
        else setServerError(data.message || "Login failed");
      }
    } catch (err) {
      setLoading(false);
      setServerError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card fade-in">
        <h2>Login</h2>

        <form onSubmit={handleSubmit} className="form-animate">
          <div className="input-group">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErrors({ ...errors, email: "" });
              }}
              className={errors.email ? "input-error" : ""}
            />
            {errors.email && (
              <p className="error-text">{errors.email}</p>
            )}
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
              className={errors.password ? "input-error" : ""}
            />
            {errors.password && (
              <p className="error-text">{errors.password}</p>
            )}
          </div>

          {serverError && (
            <p className="error-text fade-in" style={{ textAlign: "center" }}>
              {serverError}
            </p>
          )}

          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p>
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
      </div>
    </div>
  );
}
