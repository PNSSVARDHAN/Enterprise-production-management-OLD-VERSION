import { useState, useEffect } from "react";
import axios from "axios";
import "./AssignEmployee.css"; // ✅ Import the CSS

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
        <div className="assign-employee-container">
            <h1>Assign Employee</h1>

            {orders.map(order => (
                <div key={order.id} className="order-box">
                    <h2>Order {order.id} - {order.product}</h2>
                    
                    <div className="steps-container">
                        {order.MachineAllocations.map(machine => (
                            <div key={machine.id} className="step-box">
                                <p><b>Step:</b> {machine.step}</p>
                                <p><b>Machine:</b> {machine.machine_id}</p>

                                {machine.EmployeeTasks.length > 0 ? (
                                    <div>
                                        <p><b>Assigned:</b> {machine.EmployeeTasks[0].Employee.name}</p>
                                        <p><b>Target:</b> {machine.EmployeeTasks[0].target}</p>
                                        <p><b>Status:</b> {machine.EmployeeTasks[0].status}</p>
                                        
                                        {machine.EmployeeTasks[0].status === "Completed" ? (
                                            <p className="completed">✅ Completed</p>
                                        ) : (
                                            <button 
                                                onClick={() => openEditModal(machine, machine.EmployeeTasks[0])} 
                                                className="edit-button"
                                            >
                                                Edit Task
                                            </button>
                                        )}
                                    </div>
                                ) : (
                                    <button onClick={() => setSelectedTask(machine)} className="assign-button">
                                        Assign Employee
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            ))}

            {selectedTask && (
                <div className="modal">
                    <h2>Assign Employee to Machine {selectedTask.machine_id} (Step: {selectedTask.step})</h2>

                    <label>Select Employee:</label>
                    <select value={selectedEmployee} onChange={(e) => setSelectedEmployee(e.target.value)} className="input">
                        <option value="">-- Select Employee --</option>
                        {employees
                            .filter(emp => emp.name.toLowerCase().includes(searchQuery.toLowerCase()))
                            .map(emp => (
                                <option key={emp.id} value={emp.id}>{emp.name}</option>
                            ))
                        }
                    </select>

                    <label>Target:</label>
                    <input 
                        type="number" 
                        value={target} 
                        onChange={(e) => setTarget(e.target.value)} 
                        className="input"
                    />

                    <label>Duration:</label>
                    <select value={duration} onChange={(e) => setDuration(e.target.value)} className="input">
                        <option value="One Day">One Day</option>
                        <option value="Multiple Days">Multiple Days</option>
                    </select>

                    <button onClick={handleAssign} className="save-button">Save Changes</button>
                    <button onClick={() => setSelectedTask(null)} className="close-button">Cancel</button>
                </div>
            )}
        </div>
    );
};

export default AssignEmployee;
