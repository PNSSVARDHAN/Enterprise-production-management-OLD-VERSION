import { useState, useEffect } from "react";
import axios from "axios";

const styles = {
    modal: { 
        position: "fixed", 
        top: "50%", 
        left: "50%", 
        transform: "translate(-50%, -50%)", 
        backgroundColor: "white", 
        padding: "20px", 
        boxShadow: "0px 0px 10px rgba(0,0,0,0.5)", 
        width: "90vw", 
        maxWidth: "1600px", 
        height: "90vh", 
        overflowY: "auto", 
        borderRadius: "10px"
    },
    grid: { 
        display: "grid", 
        gridTemplateColumns: "repeat(6, 1fr)", 
        gap: "10px", 
        justifyContent: "center",
        alignItems: "center"
    },
    machineButton: { 
        padding: "5px", 
        fontSize: "12px", 
        width: "100px", 
        height: "30px", 
        backgroundColor: "#28a745", 
        color: "white", 
        border: "none", 
        cursor: "pointer",
        textAlign: "center",
        borderRadius: "5px",
        margin: "5px" // Added margin to create gap between machines
    },
    selected: { 
        padding: "5px", 
        fontSize: "12px", 
        width: "100px", 
        height: "30px", 
        backgroundColor: "#007bff", 
        color: "white", 
        border: "none", 
        cursor: "pointer",
        textAlign: "center",
        borderRadius: "5px",
        margin: "5px" // Added margin to create gap between machines
    },
    assigned: { 
        padding: "5px", 
        fontSize: "12px", 
        width: "100px", 
        height: "30px", 
        backgroundColor: "#FF5733", 
        color: "white", 
        border: "none", 
        cursor: "not-allowed",
        textAlign: "center",
        borderRadius: "5px",
        margin: "5px" // Added margin to create gap between machines
    },
    closeButton: {
        padding: "5px", 
        fontSize: "12px", 
        width: "100px", 
        height: "30px", 
        backgroundColor: "#dc3545", 
        color: "white", 
        border: "none", 
        cursor: "pointer",
        textAlign: "center",
        borderRadius: "5px",
        margin: "5px" // Added margin to create gap between machines
    }
};

const AssignMachine = ({ stepId, onClose }) => {
    const [machines, setMachines] = useState([]);
    const [assignedMachines, setAssignedMachines] = useState([]);
    const [selectedMachine, setSelectedMachine] = useState(null);
    const [isAssigning, setIsAssigning] = useState(false);

    useEffect(() => {
        fetchMachines();
        fetchAssignedMachines();
    }, []);

    const fetchMachines = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/machines/`);
            console.log("✅ Machines Fetched:", response.data);
            setMachines(response.data);
        } catch (error) {
            console.error("❌ Error fetching machines:", error);
        }
    };

    const fetchAssignedMachines = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/machine-allocations/`);
            console.log("🔴 Assigned Machines:", response.data);
            setAssignedMachines(response.data);
        } catch (error) {
            console.error("❌ Error fetching assigned machines:", error);
        }
    };

    const handleAssign = async () => {
        if (!selectedMachine) {
            alert("⚠️ Please select a machine before assigning.");
            return;
        }

        setIsAssigning(true);

        try {
            console.log("🟢 Assigning Machine:", { 
                order_id: stepId.order_id, 
                step: stepId.step, 
                machine_id: selectedMachine 
            });

            await axios.post(`${process.env.REACT_APP_API_URL}/api/machine-allocations/assign`, {
                order_id: stepId.order_id,
                step: stepId.step,
                machine_id: selectedMachine
            });

            alert("✅ Machine assigned successfully!");
            fetchMachines();
            fetchAssignedMachines();
            onClose();
        } catch (error) {
            console.error("❌ Error assigning machine:", error.response ? error.response.data : error);
            alert("❌ Failed to assign machine. Check console for details.");
        } finally {
            setIsAssigning(false);
        }
    };

    const lines = [];
    for (let i = 0; i < 6; i++) {
        lines.push(machines.slice(i * 50, (i + 1) * 50));
    }

    return (
        <div style={styles.modal}>
            <h2>Assign Machine for Step: <b>{stepId.step}</b> (Order ID: {stepId.order_id})</h2>

            <div style={styles.grid}>
                {lines.map((line, lineIndex) => (
                    <div key={lineIndex}>
                        <h3>Line {lineIndex + 1}</h3>
                        {line.map(machine => {
                            const assignedInfo = assignedMachines.find(item => item.machine_id === machine.id);
                            const isAssigned = !!assignedInfo;

                            return (
                                <button
                                    key={machine.id}
                                    style={isAssigned ? styles.assigned : selectedMachine === machine.id ? styles.selected : styles.machineButton}
                                    onClick={() => !isAssigned && setSelectedMachine(machine.id)}
                                    disabled={isAssigned}
                                >
                                    {machine.machine_number} {isAssigned ? `(Assigned)` : ""}
                                </button>
                            );
                        })}
                    </div>
                ))}
            </div>

            <button onClick={handleAssign} style={styles.machineButton} disabled={isAssigning}>
                {isAssigning ? "Assigning..." : "Assign Machine"}
            </button>
            <button onClick={onClose} style={styles.closeButton}>Close</button>
        </div>
    );
};

export default AssignMachine;
