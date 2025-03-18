import { useState, useEffect } from "react";
import axios from "axios";
import "./WorkTracking.css"; // ✅ Import CSS

const WorkTracking = () => {
    const [employeeTasks, setEmployeeTasks] = useState([]);

    useEffect(() => {
        fetchTasks();

        // Fetch live updates every 5 seconds
        const interval = setInterval(fetchTasks, 5000);
        return () => clearInterval(interval);
    }, []);

    const fetchTasks = () => {
        axios.get(`${process.env.REACT_APP_API_URL}/api/employee-tasks/assigned`)
            .then(response => setEmployeeTasks(response.data))
            .catch(error => console.error("Error fetching tasks:", error));
    };

    return (
        <div className="work-tracking-container">
            <h1>Work Tracking</h1>
            {employeeTasks.length === 0 ? (
                <p>No active tasks assigned.</p>
            ) : (
                <table className="work-tracking-table">
                    <thead>
                        <tr>
                            <th>Employee</th>
                            <th>Machine</th>
                            <th>Target</th>
                            <th>Completed</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {employeeTasks.map(task => (
                            <tr key={task.id}>
                                <td>{task.Employee?.name} (RFID: {task.Employee?.rfid})</td>
                                <td>{task.MachineAllocation?.machine_id}</td>
                                <td>{task.target}</td>
                                <td>{task.completed}</td>
                                <td className={task.status === "Completed" ? "status-completed" : "status-incomplete"}>
                                    {task.status}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default WorkTracking;
