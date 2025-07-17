import { Link } from "react-router-dom";

const Dashboard = () => {
  return (
    <div style={{ padding: "2rem" }}>
      <h1>Dashboard</h1>
      <p>Select your dashboard type:</p>
      <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
        <Link to="/dashboard/admin" style={buttonStyle}>
          Admin Dashboard
        </Link>
        <Link to="/dashboard/user" style={buttonStyle}>
          User Dashboard
        </Link>
      </div>
    </div>
  );
};

const buttonStyle: React.CSSProperties = {
  padding: "0.75rem 1.5rem",
  backgroundColor: "#007bff",
  color: "#fff",
  textDecoration: "none",
  borderRadius: "5px",
};

export default Dashboard;
