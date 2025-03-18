import { useState } from "react";
import axios from "axios";
import "./AddEmployee.css"; // ✅ Import the CSS

const AddEmployee = () => {
    const [latestRFID, setLatestRFID] = useState(null);
    const [name, setName] = useState("");

    // ✅ Fetch the latest scanned RFID
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

    // ✅ Register Employee with latest RFID
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
        <div className="add-employee-container">
            <h1>Add Employee</h1>
            <button className="button fetch-rfid-button" onClick={fetchLatestRFID}>📡 Fetch Latest RFID</button>
            <p className="rfid-display"><b>Latest RFID:</b> {latestRFID || "No scan yet"}</p>
            <input 
                type="text" 
                className="input-field"
                placeholder="Enter Employee Name" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
            />
            <button className="button register-button" onClick={handleRegister}>✅ Register Employee</button>
        </div>
    );
};

export default AddEmployee;
