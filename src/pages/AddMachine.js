import { useState } from "react";
import axios from "axios";
import "./AddMachine.css"; // ✅ Import CSS

const AddMachine = () => {
    const [machineNumber, setMachineNumber] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();

        axios.post(`${process.env.REACT_APP_API_URL}/api/machines/add`, { machine_number: machineNumber })
            .then(() => {
                alert("✅ Machine added successfully!");
                setMachineNumber("");
            })
            .catch(error => console.error("❌ Error adding machine:", error));
    };

    return (
        <div className="add-machine-container">
            <h1>Add Machine</h1>
            <form onSubmit={handleSubmit} className="add-machine-form">
                <input 
                    type="text" 
                    placeholder="Enter Machine Number" 
                    value={machineNumber} 
                    onChange={(e) => setMachineNumber(e.target.value)} 
                    required 
                    className="add-machine-input"
                />
                <button type="submit" className="add-machine-button">Add Machine</button>
            </form>
        </div>
    );
};

export default AddMachine;
