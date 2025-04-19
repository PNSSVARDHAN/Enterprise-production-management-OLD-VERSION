import { useState, useEffect } from "react";
import axios from "axios";
import { QRCodeCanvas } from "qrcode.react";
 // ✅ Install this: npm install qrcode.react
import "./EmployeeList.css";

const EmployeeList = () => {
    const [employees, setEmployees] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState(null); // ✅ Track which employee's QR to show

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
                setEmployees(employees.filter(emp => emp.id !== id));
            })
            .catch(error => {
                console.error("❌ Error deleting employee:", error);
                alert("❌ Failed to delete employee!");
            });
    };

    const handleGenerateQR = (employee) => {
        setSelectedEmployee(employee);
    };

    const handlePrint = () => {
        const printWindow = window.open("", "Print QR Code", "width=600,height=600");
        printWindow.document.write(`
            <html>
                <head>
                    <title>Print QR Code</title>
                </head>
                <body style="text-align:center; margin-top:50px;">
                    <h2>${selectedEmployee.name}</h2>
                    <div id="qrcode"></div>
                    <script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"></script>
                    <script>
                        new QRCode(document.getElementById("qrcode"), "${selectedEmployee.rfid}");
                    </script>
                </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
        printWindow.close();
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
                            <th>QR Code</th> {/* ✅ Added header for QR Code */}
                        </tr>
                    </thead>
                    <tbody>
                        {employees.map(emp => (
                            <tr key={emp.id}>
                                <td>{emp.id}</td>
                                <td>{emp.name}</td>
                                <td>{emp.rfid}</td>
                                <td className="d-flex gap-2">
                                    <button
                                        className="btn btn-danger btn-sm"
                                        onClick={() => deleteEmployee(emp.id)}
                                    >
                                        Delete
                                    </button>
                                    <button
                                        className="btn btn-primary btn-sm"
                                        onClick={() => handleGenerateQR(emp)}
                                    >
                                        Generate QR
                                    </button>
                                </td>
                                <td>
                                    {selectedEmployee?.id === emp.id && (
                                        <div className="text-center">
                                            <QRCodeCanvas value={selectedEmployee.rfid} size={100}/>
                                        </div>
                                    )}
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
