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
        <div className="container-fluid employee-container">
            <h1 className="text-center mb-4">Employee List</h1>
            <div className="table-responsive">
                <table className="table table-bordered table-hover">
                    <thead className="table-dark">
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
                                    <button
                                        className="btn btn-danger btn-sm"
                                        onClick={() => deleteEmployee(emp.id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default EmployeeList;
