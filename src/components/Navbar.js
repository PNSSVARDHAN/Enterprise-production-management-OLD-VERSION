import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { 
  FaHome, FaClipboardList, FaUsers, FaTasks, 
  FaPlus, FaIndustry, FaUserPlus, FaCogs, FaSignOutAlt 
} from "react-icons/fa";
import "./Navbar.css"; // Import the CSS file
import { Tooltip, OverlayTrigger } from "react-bootstrap"; // Import Bootstrap Tooltip

const Navbar = ({ setAuth }) => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    setAuth(false);
    navigate("/login");
  };

  return (
    <div className="d-flex">
        <nav className={`sidebar bg-dark text-white p-3 vh-100 ${collapsed ? "collapsed-navbar" : ""}`}>
          <div className="d-flex align-items-center justify-content-center mb-4">
            <h4 className="mb-0">{collapsed ? "SMO" : "SMO Tracking "}</h4>
          </div>
          <button className="btn btn-sm btn-outline-light toggle-btn d-block mx-auto" onClick={() => setCollapsed(!collapsed)}>
          ☰
            </button>

          <ul className="nav flex-column text-center">
            <NavItem to="/office-dashboard" icon={<FaHome />} text="Office Dashboard" collapsed={collapsed} />
            <NavItem to="/orders" icon={<FaClipboardList />} text="Orders" collapsed={collapsed} />
            <NavItem to="/employees" icon={<FaUsers />} text="Employees" collapsed={collapsed} />
            <NavItem to="/work-tracking" icon={<FaTasks />} text="Work Tracking" collapsed={collapsed} />
            <NavItem to="/add-employee" icon={<FaUserPlus />} text="Add Employee" collapsed={collapsed} />
            <NavItem to="/add-machine" icon={<FaIndustry />} text="Add Machine" collapsed={collapsed} />
            <NavItem to="/create-order" icon={<FaPlus />} text="Create Order" collapsed={collapsed} />
            <NavItem to="/assign-employee" icon={<FaCogs />} text="Assign Employee" collapsed={collapsed} />
            <NavItem to="/productivity" icon={<span role="img" aria-label="graphs">📊</span>} text="Productivity Graphs" collapsed={collapsed} />
            <NavItem to="/production-flow" icon={<span role="img" aria-label="flow">🔄</span>} text="Production Flow" collapsed={collapsed} />
          </ul>

          {/* Logout */}
        <button className="btn btn-danger mt-auto w-100" onClick={handleLogout}>
          <FaSignOutAlt /> {!collapsed && <span className="ms-2">Logout</span>}
        </button>
      </nav>

      {/* Content Area */}
    </div>
  );
};

// Navbar Item Component with Tooltip
const NavItem = ({ to, icon, text, collapsed }) => {
  return (
    <li className="nav-item mb-2">
      <OverlayTrigger
        placement="right"
        overlay={<Tooltip id={`tooltip-${text}`}>{text}</Tooltip>}
      >
        <NavLink 
          to={to} 
          className={`nav-link text-white d-flex align-items-center`}
        >
          {icon}
          {!collapsed && <span className="ms-2">{text}</span>}
        </NavLink>
      </OverlayTrigger>
    </li>
  );
};

export default Navbar;
