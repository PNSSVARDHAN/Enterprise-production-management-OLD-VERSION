import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Orders from "./pages/Orders";
import Employees from "./pages/EmployeeList";
import Navbar from "./components/Navbar";
import WorkTracking from "./pages/WorkTracking";
import AddEmployee from "./pages/AddEmployee";
import AddMachine from "./pages/AddMachine";
import CreateOrder from "./pages/CreateOrder";
import AssignEmployee from "./pages/AssignEmployee";
import OfficeDashboard from "./pages/OfficeDashboard";





function App() {
    return (
        <Router>
            <div className="layout">
                <Navbar /> {/* ✅ Navbar is separate */}
                <div className="content"> {/* ✅ Pages will load here */}
                    <Routes>
                    <Route path="/orders" element={<Orders />} />
                    <Route path="/employees" element={<Employees />} />
                    <Route path="/work-tracking" element={<WorkTracking />} />
                    <Route path="/add-employee" element={<AddEmployee />} />
                    <Route path="/add-machine" element={<AddMachine />} />
                    <Route path="/create-order" element={<CreateOrder />} />
                    <Route path="/assign-employee" element={<AssignEmployee />} />
                    <Route path="/office-dashboard" element={<OfficeDashboard />} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
}

export default App;

