import { useState, useEffect } from "react";
import axios from "axios";
import { QRCodeCanvas } from "qrcode.react";
import { Modal, Button, InputGroup, FormControl } from 'react-bootstrap';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
  } from 'recharts';
import "bootstrap/dist/css/bootstrap.min.css";
import "./EmployeeList.css";

const EmployeeList = () => {
    const [employees, setEmployees] = useState([]);
    const [filteredEmployees, setFilteredEmployees] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [historyData, setHistoryData] = useState([]);
    const [filteredHistoryData, setFilteredHistoryData] = useState([]);
    const [showHistoryModal, setShowHistoryModal] = useState(false);
    const [showQRCodeModal, setShowQRCodeModal] = useState(false);
    const [showGraphModal, setShowGraphModal] = useState(false);
    const [graphData, setGraphData] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [historySearchTerm, setHistorySearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [graphType, setGraphType] = useState("area"); // or "bar"
    const employeesPerPage = 6;

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_URL}/api/employees/`)
            .then(response => {
                setEmployees(response.data);
                setFilteredEmployees(response.data);
            })
            .catch(error => console.error("Error fetching employees:", error));
    }, []);

    useEffect(() => {
        if (searchTerm === "") {
            setFilteredEmployees(employees);
        } else {
            setFilteredEmployees(
                employees.filter(emp =>
                    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    emp.rfid.toLowerCase().includes(searchTerm.toLowerCase())
                )
            );
        }
    }, [searchTerm, employees]);

    const deleteEmployee = (id) => {
        if (!window.confirm("⚠️ Are you sure you want to delete this employee?")) return;

        axios.delete(`${process.env.REACT_APP_API_URL}/api/employees/${id}`)
            .then(() => {
                setEmployees(employees.filter(emp => emp.id !== id));
            })
            .catch(error => {
                console.error("❌ Error deleting employee:", error);
                alert("❌ Failed to delete employee!");
            });
    };

    const fetchHistory = (employeeId, showGraph = false) => {
        axios.get(`${process.env.REACT_APP_API_URL}/api/employees/history/${employeeId}`)
            .then(response => {
                const history = response.data.history || [];
                setHistoryData(history);
                setFilteredHistoryData(history);

                if (showGraph) {
                    const data = history.map(entry => ({
                        date: new Date(entry.working_date).toLocaleDateString(),
                        target: entry.target
                    }));
                    setGraphData(data);
                    setShowGraphModal(true);
                } else {
                    setShowHistoryModal(true);
                }
            })
            .catch(error => {
                console.error("Error fetching history:", error);
                setHistoryData([]);
                setFilteredHistoryData([]);
                if (showGraph) {
                    setGraphData([]);
                    setShowGraphModal(true);
                } else {
                    setShowHistoryModal(true);
                }
            });
    };

    const handleGenerateQR = (employee) => {
        setSelectedEmployee(employee);
        setShowQRCodeModal(true);
    };

    const handlePrintQR = () => {
        window.print();
    };

    const indexOfLastEmployee = currentPage * employeesPerPage;
    const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage;
    const currentEmployees = filteredEmployees.slice(indexOfFirstEmployee, indexOfLastEmployee);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const totalPages = Math.ceil(filteredEmployees.length / employeesPerPage);

    useEffect(() => {
        if (historySearchTerm === "") {
            setFilteredHistoryData(historyData);
        } else {
            setFilteredHistoryData(
                historyData.filter(record =>
                    (record.order_Number && record.order_Number.toString().toLowerCase().includes(historySearchTerm.toLowerCase())) ||
                    (record.Step_Name && record.Step_Name.toLowerCase().includes(historySearchTerm.toLowerCase())) ||
                    (record.machine_number && record.machine_number.toString().toLowerCase().includes(historySearchTerm.toLowerCase())) ||
                    (record.target && record.target.toString().toLowerCase().includes(historySearchTerm.toLowerCase())) ||
                    (record.working_date && new Date(record.working_date).toLocaleDateString().toLowerCase().includes(historySearchTerm.toLowerCase()))
                )
            );
        }
    }, [historySearchTerm, historyData]);

    return (
        <div className="container-fluid">
            <h1 className="text-center mb-4">Employee List</h1>

            {/* Search Bar */}
            <InputGroup className="mb-3">
                <FormControl
                    placeholder="Search Employee by Name or RFID"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </InputGroup>

            {/* Employee Cards */}
            <div className="row">
                {currentEmployees.map(emp => (
                    <div key={emp.id} className="col-md-6 mb-4">
                        <div className="employee-card card">
                            <div className="card-body">
                                <h5 className="card-title">{emp.name}</h5>
                                <p><strong>RFID:</strong> {emp.rfid}</p>

                                <div className="button-group">
                                    <button className="btn btn-danger btn-sm" onClick={() => deleteEmployee(emp.id)}>Delete</button>
                                    <button className="btn btn-success btn-sm" onClick={() => fetchHistory(emp.id, true)}>Analyze</button>
                                    <button className="btn btn-warning btn-sm" onClick={() => fetchHistory(emp.id)}>Previous Data</button>
                                    <button className="btn btn-primary btn-sm" onClick={() => handleGenerateQR(emp)}>Generate QR</button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination Controls */}
            <div className="pagination">
                {Array.from({ length: totalPages }, (_, index) => (
                    <button
                        key={index + 1}
                        className={`page-btn ${currentPage === index + 1 ? 'active' : ''}`}
                        onClick={() => handlePageChange(index + 1)}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>

            {/* History Modal */}
            {showHistoryModal && (
                <div className="modal-overlay" onClick={() => setShowHistoryModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h4 className="mb-3">Employee Task History</h4>
                        <InputGroup className="mb-3">
                            <FormControl
                                placeholder="Search History"
                                value={historySearchTerm}
                                onChange={(e) => setHistorySearchTerm(e.target.value)}
                            />
                        </InputGroup>

                        {filteredHistoryData.length > 0 ? (
                            <div className="table-responsive">
                                <table className="table table-bordered">
                                    <thead className="table-dark">
                                        <tr>
                                            <th>Order Number</th>
                                            <th>Step Name</th>
                                            <th>Machine Number</th>
                                            <th>Target</th>
                                            <th>Working Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredHistoryData.map((record, idx) => (
                                            <tr key={idx}>
                                                <td>{record.order_Number}</td>
                                                <td>{record.Step_Name}</td>
                                                <td>{record.machine_number}</td>
                                                <td>{record.target}</td>
                                                <td>{new Date(record.working_date).toLocaleDateString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p>No history records found 🚫</p>
                        )}

                        <button className="btn btn-secondary mt-3" onClick={() => setShowHistoryModal(false)}>Close</button>
                    </div>
                </div>
            )}

            {/* Graph Modal */}
            <Modal show={showGraphModal} onHide={() => setShowGraphModal(false)} size="lg">
  <Modal.Header closeButton>
    <Modal.Title>Target per Date (Area Chart)</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    {graphData.length > 0 ? (
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={graphData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorTarget" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="date" />
          <YAxis />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip />
          <Area type="monotone" dataKey="target" stroke="#8884d8" fillOpacity={1} fill="url(#colorTarget)" />
        </AreaChart>
      </ResponsiveContainer>
    ) : (
      <p>No data available for graph.</p>
    )}
  </Modal.Body>
</Modal>

            {/* QR Code Modal */}
            <Modal show={showQRCodeModal} onHide={() => setShowQRCodeModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>QR Code for {selectedEmployee?.name}</Modal.Title>
                </Modal.Header>
                <Modal.Body className="text-center">
                    {selectedEmployee && (
                        <>
                            <QRCodeCanvas value={selectedEmployee.rfid} size={150} />
                            <div className="mt-3">
                                <Button variant="success" onClick={handlePrintQR}>Print</Button>
                            </div>
                        </>
                    )}
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default EmployeeList;
