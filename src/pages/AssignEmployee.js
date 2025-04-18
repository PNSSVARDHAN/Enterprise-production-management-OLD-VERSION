import { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css"; // ✅ Ensure Bootstrap is imported
import "./AssignEmployee.css"; // ✅ Your custom tweaks

const AssignEmployee = () => {
    const [orders, setOrders] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [selectedTask, setSelectedTask] = useState(null);
    const [selectedEmployee, setSelectedEmployee] = useState("");
    const [target, setTarget] = useState("");
    const [duration, setDuration] = useState("One Day");
    const [searchQuery, setSearchQuery] = useState("");

    // ✅ Fetch Orders with Assigned Machines
    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_URL}/api/orders/assigned-machines`)
            .then(response => setOrders(response.data))
            .catch(error => console.error("❌ Error fetching orders:", error));
    }, []);

    // ✅ Fetch Employees for Selection
    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_URL}/api/employees/`)
            .then(response => setEmployees(response.data))
            .catch(error => console.error("❌ Error fetching employees:", error));
    }, []);

    // ✅ Open Modal and Pre-Fill Data for Editing
    const openEditModal = (machine, task) => {
        setSelectedTask({ ...machine, task_id: task.id });
        setSelectedEmployee(task.employee_id);
        setTarget(task.target);
        setDuration(task.duration);
    };

    // ✅ Assign or Edit Employee Task
    const handleAssign = () => {
        if (!selectedEmployee || !target) {
            alert("⚠️ Please select an employee and enter a target.");
            return;
        }
    
        const apiEndpoint = selectedTask.task_id 
            ? `${process.env.REACT_APP_API_URL}/api/employee-tasks/update/${selectedTask.task_id}`  
            : `${process.env.REACT_APP_API_URL}/api/employee-tasks/assign`; 
    
        axios.post(apiEndpoint, {
            employee_id: selectedEmployee,
            machine_allocation_id: selectedTask.id,
            target,
            duration
        })
        .then(() => {
            alert(selectedTask.task_id ? "✅ Task updated successfully!" : "✅ Employee assigned successfully!");
    
            // ✅ **Update UI without refreshing**
            setOrders((prevOrders) =>
                prevOrders.map(order => ({
                    ...order,
                    MachineAllocations: order.MachineAllocations.map(machine => 
                        machine.id === selectedTask.id 
                            ? {
                                ...machine,
                                EmployeeTasks: [{
                                    id: selectedTask.task_id || Math.random(), // Use actual task_id from API
                                    employee_id: selectedEmployee,
                                    target,
                                    duration,
                                    status: target > 0 ? "In Progress" : "Completed",
                                    Employee: employees.find(emp => emp.id === selectedEmployee) || { name: "Unknown" }
                                }]
                            }
                            : machine
                    )
                }))
            );
    
            setSelectedTask(null); // Close modal after assignment
        })
        .catch(error => {
            console.error("❌ Error updating task:", error);
            alert("❌ Failed to update task.");
        });
    };

    return (
        <div className="container-AssignEmployee my-5">
            <h1 className="text-center mb-4">Assign Employee</h1>

            {orders.map(order => (
                <div key={order.id} className="card mb-4 shadow-sm">
                    <div className="card-body">
                        <h5 className="card-title">Order {order.id} - {order.product}</h5>
                        
                        <div className="row">
                            {order.MachineAllocations.map(machine => (
                                <div key={machine.id} className="col-12 col-md-6 col-lg-4">
                                    <div className="step-box border p-3 rounded">
                                        <p><b>Step:</b> {machine.step}</p>
                                        <p><b>Machine:</b> {machine.machine_id}</p>

                                        {machine.EmployeeTasks.length > 0 ? (
                                            <div>
                                                <p><b>Assigned:</b> {machine.EmployeeTasks[0].Employee.name}</p>
                                                <p><b>Target:</b> {machine.EmployeeTasks[0].target}</p>
                                                <p><b>Status:</b> {machine.EmployeeTasks[0].status}</p>
                                                
                                                {machine.EmployeeTasks[0].status === "Completed" ? (
                                                    <p className="text-success">✅ Completed</p>
                                                ) : (
                                                    <button 
                                                        onClick={() => openEditModal(machine, machine.EmployeeTasks[0])} 
                                                        className="btn btn-warning btn-sm">
                                                        Edit Task
                                                    </button>
                                                )}
                                            </div>
                                        ) : (
                                            <button 
                                                onClick={() => setSelectedTask(machine)} 
                                                className="btn btn-primary btn-sm">
                                                Assign Employee
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ))}

            {selectedTask && (
                <div className="modal d-block show" style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Assign Employee to Machine {selectedTask.machine_id} (Step: {selectedTask.step})</h5>
                                <button onClick={() => setSelectedTask(null)} className="btn-close"></button>
                            </div>
                            <div className="modal-body">
                                <label>Select Employee:</label>
                                <input 
                                    type="text" 
                                    className="form-control mb-3" 
                                    placeholder="Search employee..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />

                                <select 
                                    value={selectedEmployee} 
                                    onChange={(e) => setSelectedEmployee(e.target.value)} 
                                    className="form-select mb-3">
                                    <option value="">-- Select Employee --</option>
                                    {employees
                                        .filter(emp => emp.name.toLowerCase().includes(searchQuery.toLowerCase()))
                                        .map(emp => (
                                            <option key={emp.id} value={emp.id}>{emp.name}</option>
                                        ))}
                                </select>

                                <label>Target:</label>
                                <input 
                                    type="number" 
                                    value={target} 
                                    onChange={(e) => setTarget(e.target.value)} 
                                    className="form-control mb-3"
                                />

                                <label>Duration:</label>
                                <select value={duration} onChange={(e) => setDuration(e.target.value)} className="form-select mb-3">
                                    <option value="One Day">One Day</option>
                                    <option value="Multiple Days">Multiple Days</option>
                                </select>
                            </div>
                            <div className="modal-footer">
                                <button onClick={handleAssign} className="btn btn-success">Save Changes</button>
                                <button onClick={() => setSelectedTask(null)} className="btn btn-secondary">Cancel</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AssignEmployee;
