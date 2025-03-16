import { useState } from "react";
import AssignEmployee from "./AssignEmployee";

const MachineAllocations = ({ machineAllocations }) => {
    const [selectedMachineAllocation, setSelectedMachineAllocation] = useState(null);

    return (
        <div>
            <h2>Machine Allocations</h2>
            <table style={styles.table}>
                <thead>
                    <tr>
                        <th>Order ID</th>
                        <th>Step</th>
                        <th>Machine ID</th>
                        <th>Assign Employee</th>
                    </tr>
                </thead>
                <tbody>
                    {machineAllocations.map(allocation => (
                        <tr key={allocation.id}>
                            <td>{allocation.order_id}</td>
                            <td>{allocation.step}</td>
                            <td>{allocation.machine_id}</td>
                            <td>
                                <button 
                                    onClick={() => setSelectedMachineAllocation(allocation.id)} 
                                    style={styles.assignButton}
                                >
                                    Assign Employee
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {selectedMachineAllocation && (
                <AssignEmployee 
                    machineAllocationId={selectedMachineAllocation}
                    onClose={() => setSelectedMachineAllocation(null)}
                />
            )}
        </div>
    );
};

// ✅ CSS Styles
const styles = {
    table: { width: "100%", marginTop: "20px", borderCollapse: "collapse" },
    assignButton: { padding: "8px", backgroundColor: "#007bff", color: "white", border: "none", cursor: "pointer" },
};

export default MachineAllocations;
