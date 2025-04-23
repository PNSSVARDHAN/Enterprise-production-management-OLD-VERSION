import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { 
  FaHome, FaClipboardList, FaUsers, FaTasks, 
  FaPlus, FaIndustry, FaUserPlus, FaCogs, FaSignOutAlt 
} from "react-icons/fa";
import { jwtDecode } from "jwt-decode"; // Correct named import for jwt-decode
import "./Navbar.css"; // Import the CSS file
import { Tooltip, OverlayTrigger } from "react-bootstrap"; // Import Bootstrap Tooltip

const Navbar = ({ setAuth }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [role, setRole] = useState(""); // State to hold the role of the user
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token); // Correct function call
      setRole(decoded.role); // Set the role based on decoded JWT token
    }
  }, []);

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
          

          {/* Conditional Rendering of Nav Items based on Role */}
          {(role === "admin" || role === "manager" || role === "employee") && (
            <>
              <NavItem to="/office-dashboard" icon={<FaHome />} text="Office Dashboard" collapsed={collapsed} />
              <NavItem to="/orders" icon={<FaClipboardList />} text="Orders" collapsed={collapsed} />
              <NavItem to="/employees" icon={<FaUsers />} text="Employees" collapsed={collapsed} />
              <NavItem to="/work-tracking" icon={<FaTasks />} text="Work Tracking" collapsed={collapsed} />
              <NavItem to="/add-employee" icon={<FaUserPlus />} text="Add Employee" collapsed={collapsed} />
              <NavItem to="/add-machine" icon={<FaIndustry />} text="Add Machine" collapsed={collapsed} />
              <NavItem to="/create-order" icon={<FaPlus />} text="Create Order" collapsed={collapsed} />
              <NavItem to="/assign-employee" icon={<FaCogs />} text="Assign Employee" collapsed={collapsed} />
              <NavItem to="/productivity" icon={<span role="img" aria-label="graphs">📊</span>} text="Productivity Graphs" collapsed={collapsed} />
              <NavItem to="/register" icon={<FaUserPlus />} text="Register" collapsed={collapsed} />

            </>
          )}

          {/* For Admin Only */}
          {(role === "admin" || role === "Cutting" || role === "Sewing" || role === 'Quality control' || role === "Packing") && (
            <>
              <NavItem to="/production-flow" icon={<span role="img" aria-label="flow">🔄</span>} text="Production Flow" collapsed={collapsed} />
            </>
          )}
        </ul>

        {/* Logout */}
        <button className="btn btn-danger mt-auto w-100" onClick={handleLogout}>
          <FaSignOutAlt /> {!collapsed && <span className="ms-2">Logout</span>}
        </button>
      </nav>
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
