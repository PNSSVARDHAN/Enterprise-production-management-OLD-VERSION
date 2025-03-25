import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
    FaHome, FaClipboardList, FaUsers, FaTasks, 
    FaPlus, FaIndustry, FaUserPlus, FaCogs, FaSignOutAlt 
} from "react-icons/fa";
import "./Navbar.css"; // ✅ Import CSS file

const Navbar = ({ setAuth }) => {
    const [collapsed, setCollapsed] = useState(false);
    const navigate = useNavigate();

    // ✅ Logout function
    const handleLogout = () => {
        localStorage.removeItem("token"); // ✅ Remove token
        setAuth(false); // ✅ Update auth state
        navigate("/login"); // ✅ Redirect to login page
    };

    return (
        <div className={`layout ${collapsed ? "collapsed" : ""}`}>
            {/* ✅ Sidebar Navigation */}
            <nav className={`navbar ${collapsed ? "collapsed" : ""}`}>
                <h2 className="navbar-title">{collapsed ? "SMO" : "SMO Tracking System"}</h2>

                <button onClick={() => setCollapsed(!collapsed)} className="toggle-button">
                    ☰
                </button>

                <div className="link-container">
                    <NavItem to="/office-dashboard" icon={<FaHome />} text="Office Dashboard" collapsed={collapsed} />
                    <NavItem to="/orders" icon={<FaClipboardList />} text="Orders" collapsed={collapsed} />
                    <NavItem to="/employees" icon={<FaUsers />} text="Employees" collapsed={collapsed} />
                    <NavItem to="/work-tracking" icon={<FaTasks />} text="Work Tracking" collapsed={collapsed} />
                    <NavItem to="/add-employee" icon={<FaUserPlus />} text="Add Employee" collapsed={collapsed} />
                    <NavItem to="/add-machine" icon={<FaIndustry />} text="Add Machine" collapsed={collapsed} />
                    <NavItem to="/create-order" icon={<FaPlus />} text="Create Order" collapsed={collapsed} />
                    <NavItem to="/assign-employee" icon={<FaCogs />} text="Assign Employee" collapsed={collapsed} />
                    <NavItem to="/productivity" icon={<span role="img" aria-label="graphs">📊</span>} text="Productivity Graphs" collapsed={collapsed} />
                </div>

                {/* ✅ Logout Button */}
                <button className="logout-btn" onClick={handleLogout}>
                    <FaSignOutAlt /> <span className="nav-text">{collapsed ? "" : "Logout"}</span>
                </button>
            </nav>

            {/* ✅ Main Content Area (Adjusting based on collapsed state) */}
            <div className={`content ${collapsed ? "expanded" : ""}`}>
                {/* The child components (pages) will load here */}
            </div>
        </div>
    );
};

// ✅ Navbar Item Component
const NavItem = ({ to, icon, text, collapsed }) => (
    <Link to={to} className="nav-link" title={text}>
        {icon} <span className="nav-text">{collapsed ? "" : text}</span>
    </Link>
);

export default Navbar;
