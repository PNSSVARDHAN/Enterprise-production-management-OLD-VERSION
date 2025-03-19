import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css"; // ✅ Import the updated CSS

const Login = ({ setAuth }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/login`, {
                email,
                password
            });

            localStorage.setItem("token", response.data.token);
            setAuth(true);
            navigate("/office-dashboard");
        } catch (err) {
            setError("Login failed. Invalid email or password.");
        }
    };

    return (
        <div className="login-container">
            {/* ✅ Animated Background Circles */}
            <div className="background-circles">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className={`circle circle${i + 1}`}></div>
                ))}
            </div>

            {/* ✅ Login Box */}
            <div className="login-box">
            <div className="testing-notice">
                    <strong>THE APPLICATION IS UNDER TESTING PHASE</strong> <br />
                    Username: <b>test@gmail.com</b> <br />
                    Password: <b>123456789</b> <br />
                    Please enter the details to log in.
                </div>
                <h2>Welcome Back</h2>
                <p className="subtitle">Sign in to continue</p>
                {error && <p className="error-message">{error}</p>}
                <form onSubmit={handleLogin}>
                    <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    <button type="submit">Login</button>
                </form>
            </div>
        </div>
    );
};

export default Login;
