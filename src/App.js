import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import Orders from "./pages/Orders";
import Employees from "./pages/EmployeeList";
import Navbar from "./components/Navbar";
import WorkTracking from "./pages/WorkTracking";
import AddEmployee from "./pages/AddEmployee";
import AddMachine from "./pages/AddMachine";
import CreateOrder from "./pages/CreateOrder";
import AssignEmployee from "./pages/AssignEmployee";
import OfficeDashboard from "./pages/OfficeDashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";

function Layout({ auth, setAuth }) {
    const location = useLocation();
    const hideNavbar = location.pathname === "/login" || location.pathname === "/register";

    return (
        <div className="layout">
            {!hideNavbar && <Navbar setAuth={setAuth} />} {/* ✅ Pass setAuth */}
            <div className="content">
                <Routes>
                    <Route path="/" element={<Navigate to={auth ? "/orders" : "/login"} />} />
                    <Route path="/login" element={auth ? <Navigate to="/orders" /> : <Login setAuth={setAuth} />} />
                    <Route path="/register" element={auth ? <Navigate to="/orders" /> : <Register />} />

                    {/* ✅ Protect routes */}
                    <Route path="/orders" element={auth ? <Orders /> : <Navigate to="/login" />} />
                    <Route path="/employees" element={auth ? <Employees /> : <Navigate to="/login" />} />
                    <Route path="/work-tracking" element={auth ? <WorkTracking /> : <Navigate to="/login" />} />
                    <Route path="/add-employee" element={auth ? <AddEmployee /> : <Navigate to="/login" />} />
                    <Route path="/add-machine" element={auth ? <AddMachine /> : <Navigate to="/login" />} />
                    <Route path="/create-order" element={auth ? <CreateOrder /> : <Navigate to="/login" />} />
                    <Route path="/assign-employee" element={auth ? <AssignEmployee /> : <Navigate to="/login" />} />
                    <Route path="/office-dashboard" element={auth ? <OfficeDashboard /> : <Navigate to="/login" />} />
                </Routes>
            </div>
        </div>
    );
}

function App() {
    const [auth, setAuth] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            setAuth(true);
        }
    }, []);

    return (
        <Router>
            <Layout auth={auth} setAuth={setAuth} />
        </Router>
    );
}

export default App;
