import { useState, useEffect } from "react";
import axios from "axios";
import "./OfficeDashboard.css"; // ✅ Import external CSS file

const OfficeDashboard = () => {
    const [dashboardData, setDashboardData] = useState(null);

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_URL}/api/dashboard/office`)
            .then((response) => setDashboardData(response.data))
            .catch((error) => console.error("❌ Error fetching office dashboard data:", error));
    }, []);

    return (
        <div className="dashboard-container">
            <h1>Dashboard - Production Overview</h1>

            {dashboardData ? (
                <>
                    {/* ✅ Stats Section - Boxes */}
                    <div className="stats-container">
                        <div className="stat-box">
                            <h3>Total Orders</h3>
                            <p>{dashboardData.totalOrders || 0}</p>
                        </div>
                        <div className="stat-box">
                            <h3>Active Orders</h3>
                            <p>{dashboardData.activeOrders || 0}</p>
                        </div>
                        <div className="stat-box">
                            <h3>Completed Orders</h3>
                            <p>{dashboardData.completedOrders || 0}</p>
                        </div>
                        <div className="stat-box">
                            <h3>Total Employees</h3>
                            <p>{dashboardData.totalEmployees || 0}</p>
                        </div>
                        <div className="stat-box">
                            <h3>Employees Working</h3>
                            <p>{dashboardData.employeesWorking || 0}</p>
                        </div>
                        <div className="stat-box">
                            <h3>Machines In Use</h3>
                            <p>{dashboardData.inUseMachines || 0}</p>
                        </div>
                    </div>

                    {/* ✅ Live Task Progress Table */}
                    <h3>Live Task Progress:</h3>
                    {dashboardData.tasks.length > 0 ? (
                        <table className="task-table">
                            <thead>
                                <tr>
                                    <th>Order ID</th>
                                    <th>Step Name</th>
                                    <th>Employee</th>
                                    <th>Completed</th>
                                    <th>Target</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dashboardData.tasks.map((task, index) => (
                                    <tr key={index}>
                                        <td>{task.order_id || "N/A"}</td>
                                        <td>{task.step_name || "N/A"}</td>
                                        <td>{task.employee_name || "N/A"}</td>
                                        <td>{task.completed || 0}</td>
                                        <td>{task.target || 0}</td>
                                        <td className={`status-${task.status.toLowerCase().replace(" ", "-")}`}>
                                            {task.status}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>No active tasks.</p>
                    )}
                </>
            ) : (
                <p>Loading data...</p>
            )}
        </div>
    );
};

export default OfficeDashboard;
