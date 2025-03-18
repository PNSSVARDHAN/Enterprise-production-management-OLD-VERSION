import { useState, useEffect } from "react";
import axios from "axios";
import "./EmployeeList.css"; // ✅ Import CSS

const EmployeeList = () => {
    const [employees, setEmployees] = useState([]);

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_URL}/api/employees/`)
            .then(response => setEmployees(response.data))
            .catch(error => console.error("Error fetching employees:", error));
    }, []);

    const deleteEmployee = (id) => {
        if (!window.confirm("⚠️ Are you sure you want to delete this employee?")) return;

        axios.delete(`${process.env.REACT_APP_API_URL}/api/employees/${id}`)
            .then(response => {
                console.log(response.data.message);
                setEmployees(employees.filter(emp => emp.id !== id)); // ✅ Remove from UI
            })
            .catch(error => {
                console.error("❌ Error deleting employee:", error);
                alert("❌ Failed to delete employee!");
            });
    };
    return (
        <div className="employee-container">
            <h1>Employee List</h1>
            <table className="employee-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>RFID</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {employees.map(emp => (
                        <tr key={emp.id}>
                            <td>{emp.id}</td>
                            <td>{emp.name}</td>
                            <td>{emp.rfid}</td>
                            <td>
                                <button className="delete-button" onClick={() => deleteEmployee(emp.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default EmployeeList;
