import { Link } from "react-router-dom";

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar = ({ isOpen, toggleSidebar }: SidebarProps) => {
  return (
    <div className={`sidebar ${isOpen ? "open" : ""}`}>
      <nav className="sidebar-links">
        <Link to="/dashboard" onClick={toggleSidebar}>
          Dashboard
        </Link>
      </nav>
    </div>
  );
};

export default Sidebar;
