import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom"; // ✅ Get employee ID from URL
import "./EmployeeDashboard.css";
import API_BASE_URL from "../config";

const EmployeeDashboard = () => {
    const { employeeId } = useParams(); // ✅ Get employeeId from route
    const [taskData, setTaskData] = useState(null);
    const [loading, setLoading] = useState(true); // ✅ Track loading state

    useEffect(() => {
        console.log(`🔍 Fetching data for Employee ID: ${employeeId}`);
        
        axios.get(`${API_BASE_URL}/api/dashboard/employee/${employeeId}`)
            .then((response) => {
                console.log("✅ API Response:", response.data);
                setTaskData(response.data);
                setLoading(false); // ✅ Stop loading when data is received
            })
            .catch((error) => {
                console.error("❌ Error fetching employee dashboard data:", error);
                setLoading(false); // ✅ Stop loading on error
            });
    }, [employeeId]);

    if (loading) {
        return <p>Loading...</p>; // ✅ Show loading only while fetching data
    }

    return (
        <div className="employee-dashboard">
            <h1>Employee Dashboard</h1>
            {taskData && taskData.order_id ? (
                <div className="task-box">
                    <h2>Current Task</h2>
                    <ul>
                        <li><b>Employee:</b> {taskData.employee_name || "N/A"}</li>
                        <li><b>Order ID:</b> {taskData.order_id}</li>
                        <li><b>Product:</b> {taskData.product || "N/A"}</li>
                        <li><b>Step:</b> {taskData.step || "N/A"}</li>
                        <li><b>Machine ID:</b> {taskData.machine_id || "N/A"}</li>
                        <li><b>Target:</b> {taskData.target || "N/A"}</li>
                        <li><b>Completed:</b> {taskData.completed || 0}</li>
                    </ul>
                </div>
            ) : (
                <p className="no-task">No active tasks assigned</p>
            )}
        </div>
    );
};

export default EmployeeDashboard;
