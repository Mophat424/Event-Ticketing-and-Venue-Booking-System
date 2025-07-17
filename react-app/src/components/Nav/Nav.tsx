// import { Link } from "react-router-dom";

// const Nav = () => {
//   return (
//     <nav>
//       <ul style={{ display: "flex", gap: "1rem" }}>
//         <li><Link to="/">Home</Link></li>
//         <li><Link to="/about">About</Link></li>
//         <li><Link to="/dashboard">Dashboard</Link></li>
//       </ul>
//     </nav>
//   );
// };

// export default Nav;

import { useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../Sidebar/sidebar"; // Adjust path if different

const Nav = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <>
      <header className="nav-header">
        <button className="menu-btn" onClick={toggleSidebar}>
          ☰
        </button>
        {/* Removed: <div className="logo">EventMaster</div> */}
        <nav className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
        </nav>
      </header>

      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      {sidebarOpen && <div className="overlay" onClick={closeSidebar}></div>}
    </>
  );
};

export default Nav;
