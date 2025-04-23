import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css"; // ✅ Using same CSS for simplicity

const Register = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("employee");  // Default role is 'employee'
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setError("");

        try {
            // Send the role along with the name, email, and password
            await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/register`, { name, email, password, role });
            navigate("/login");  // ✅ Redirect to login page after success
        } catch (err) {
            setError(err.response?.data?.message || "Registration failed. Try again.");
        }
    };

    return (
        <div className="login-container">
            <h2>Register</h2>
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={handleRegister}>
                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                {/* Role Dropdown */}
                <select value={role} onChange={(e) => setRole(e.target.value)} required>
                    <option value="employee">Employee</option>
                    <option value="manager">Manager</option>
                    <option value="admin">Admin</option>
                    <option value="Cutting">Cutting</option>
                    <option value="Sewing">Sewing</option>
                    <option value="Quality control">Quality Control</option>
                    <option value="Packing">Packing</option>
                    {/* Add more roles as needed */}
                </select>
                <button type="submit">Register</button>
            </form>
        </div>
    );
};

export default Register;


