import { useState } from "react";
import { Link } from "react-router-dom";
import { FaHome, FaUser, FaClipboardList, FaUsers, FaTasks, FaPlus, FaIndustry, FaUserPlus, FaCogs } from "react-icons/fa";
import "./Navbar.css"; // ✅ Import CSS file for better styling

const Navbar = ({ children }) => {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <div className="layout">
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
                </div>
            </nav>

            {/* ✅ Main Content Area (Where pages load) */}
            <div className="content">
                {children}
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
