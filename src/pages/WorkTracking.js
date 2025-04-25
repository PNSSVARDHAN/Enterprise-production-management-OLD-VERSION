import { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css"; 
import "./WorkTracking.css"; // ✅ Ensure your styles are correctly linked

const WorkTracking = () => {
    const [employeeTasks, setEmployeeTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchTasks();

        // Fetch live updates every 15 seconds (to reduce unnecessary load)
        const interval = setInterval(fetchTasks, 15000);
        return () => clearInterval(interval);
    }, []);

    const fetchTasks = () => {
        setLoading(true); // Show loading state
        setError(null); // Reset error state before new request

        axios.get(`${process.env.REACT_APP_API_URL}/api/employee-tasks/assigned`)
            .then(response => {
                setEmployeeTasks(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching tasks:", error);
                setError("Failed to load tasks. Please try again.");
                setLoading(false);
            });
    };

    if (loading) {
        return <div className="alert alert-info" role="alert">Loading tasks...</div>;
    }

    return (
        <div className="d-flex justify-content-center align-items-center mt-4">
            <div className="container-worktracking">
                <h1 className="mb-4 text-center">Work Tracking</h1>

                {/* Display error message if fetching fails */}
                {error && <div className="alert alert-danger text-center" role="alert">{error}</div>}

                {employeeTasks.length === 0 ? (
                    <div className="alert alert-warning text-center" role="alert">
                        No active tasks assigned.
                    </div>
                ) : (
                    <table className="table table-striped table-bordered table-responsive">
                        <thead className="thead-dark">
                            <tr>
                                <th>Employee</th>
                                <th>Machine</th>
                                <th>Target</th>
                                <th>Completed</th>
                                <th>Status</th>
                                <th>Assign Date</th>
                                <th>Last Scan</th>
                            </tr>
                        </thead>
                        <tbody>
                            {employeeTasks.map(task => (
                                <tr key={task.id}>
                                    <td>{task.Employee?.name} (RFID: {task.Employee?.rfid})</td>
                                    <td>{task.MachineAllocation?.machine_id}</td>
                                    <td>{task.target}</td>
                                    <td>{task.completed}</td>
                                    <td className={task.status === "Completed" ? "badge bg-success" : "badge bg-warning"}>
                                        {task.status}
                                    </td>
                                    <td>{new Date(task.createdAt).toLocaleString()}</td>
                                    <td>{new Date(task.updatedAt).toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default WorkTracking;
