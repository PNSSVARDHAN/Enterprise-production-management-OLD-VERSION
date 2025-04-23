import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css"; // ✅ Using same CSS for simplicity

const Login = ({ setAuth }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        try {
            // Send login request
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/login`, { email, password });
            
            // Save JWT and role to localStorage
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("role", response.data.user.role);  // Save role as well
            
            // Update auth status
            setAuth(true);

            // Redirect based on role or to the last visited page
            const lastVisited = localStorage.getItem("lastVisited") || "/orders";  // Default to '/orders'
            navigate(lastVisited);

        } catch (err) {
            setError(err.response?.data?.message || "Login failed. Try again.");
        }
    };

    return (
        <div className="login-container">
            <h2>Login</h2>
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={handleLogin}>
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
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default Login;
