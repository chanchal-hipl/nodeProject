import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "../Dashboard.css";
import UserList from "./UserList";

export default function Dashboard() {
  const navigate = useNavigate();
  const [showUsers, setShowUsers] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="dashboard-container">
      <nav className="dashboard-nav">
        <h1>Dashboard</h1>
      </nav>

      <main className="dashboard-main">
        <div className="dashboard-buttons">
          <button onClick={() => setShowUsers(!showUsers)}>
            {showUsers ? "Hide Users" : "Manage Users"}
          </button>
          <button
            onClick={() => navigate("/create-user")}
            className="create-user-btn"
          >
            ➕ Create New User
          </button>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>

        {!showUsers ? (
          <>
            <h2>Welcome to your Dashboard!</h2>
            <p>Here you can manage your profile and explore features.</p>
          </>
        ) : (
          <UserList />
        )}
      </main>
    </div>
  );
}
