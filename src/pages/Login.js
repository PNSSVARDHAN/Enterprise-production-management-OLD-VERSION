import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS

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
        <div className="container mt-5">
            <div className="row">
                <div className="col-md-12"> {/* Move container to the right */}
                    <div className="card">
                        <div className="card-body">
                            <h2 className="card-title text-center mb-4">Login</h2>
                            {error && <div className="alert alert-danger">{error}</div>}
                            <form onSubmit={handleLogin}>
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">Email</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        id="email"
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="password" className="form-label">Password</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        id="password"
                                        placeholder="Enter your password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                                <button type="submit" className="btn btn-primary w-100">Login</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
