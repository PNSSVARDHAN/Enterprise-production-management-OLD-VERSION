import { useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css"; // ✅ Ensure Bootstrap is imported
import "./AddEmployee.css"; // ✅ Your custom tweaks if needed

const AddEmployee = () => {
    const [latestRFID, setLatestRFID] = useState(null);
    const [name, setName] = useState("");

    const fetchLatestRFID = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/employees/latest-scan`);
            console.log("✅ Latest RFID Fetched:", response.data);
            setLatestRFID(response.data.rfid || "No recent scan found");
        } catch (error) {
            console.error("❌ Error fetching latest RFID:", error);
            setLatestRFID("Error fetching RFID");
        }
    };

    const handleRegister = async () => {
        if (!latestRFID || latestRFID === "No recent scan found") {
            alert("⚠️ No RFID scan available!");
            return;
        }
        if (!name) {
            alert("⚠️ Please enter employee name.");
            return;
        }

        try {
            await axios.post(`${process.env.REACT_APP_API_URL}/api/employees/register`, { name, rfid: latestRFID });
            alert("✅ Employee registered successfully!");
            setName("");
            setLatestRFID(null);
        } catch (error) {
            console.error("❌ Error registering employee:", error);
            alert("❌ Failed to register employee.");
        }
    };

    return (
        <div className="container-Addemployee my-5">
            <div className="card shadow p-4">
                <h1 className="mb-4 text-center">Add Employee</h1>

                <div className="d-grid gap-2 mb-3">
                    <button className="btn btn-primary" onClick={fetchLatestRFID}>
                        📡 Fetch Latest RFID
                    </button>
                </div>

                <div className="mb-3 text-center">
                    <p className="fw-bold">
                        Latest RFID:{" "}
                        <span className="text-success">{latestRFID || "No scan yet"}</span>
                    </p>
                </div>

                <div className="mb-3">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Enter Employee Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>

                <div className="d-grid gap-2">
                    <button className="btn btn-success" onClick={handleRegister}>
                        ✅ Register Employee
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddEmployee;
