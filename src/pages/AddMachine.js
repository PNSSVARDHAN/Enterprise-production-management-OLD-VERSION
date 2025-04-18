import { useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css"; // ✅ Ensure Bootstrap is imported
import "./AddMachine.css"; // ✅ Your custom tweaks

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
        <div className="container-addmachine my-5">
            <div className="card shadow p-4">
                <h1 className="mb-4 text-center">Add Machine</h1>

                <form onSubmit={handleSubmit} className="add-machine-form">
                    <div className="mb-3">
                        <input
                            type="text"
                            placeholder="Enter Machine Number"
                            value={machineNumber}
                            onChange={(e) => setMachineNumber(e.target.value)}
                            required
                            className="form-control"
                        />
                    </div>

                    <div className="d-grid gap-2">
                        <button type="submit" className="btn btn-primary">
                            Add Machine
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddMachine;
