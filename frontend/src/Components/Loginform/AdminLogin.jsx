import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";

function AdminLogin() {
    const [id, setId] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:5000/admin/login", {
                id,
                password,
            });

            Swal.fire("Success", response.data.message, "success");
            navigate("/siteAdmin");
        } catch (error) {
            Swal.fire("Error", error.response.data.message, "error");
        }
    };

    return (
        <div>
            <h1>Admin Login</h1>
            <form onSubmit={handleLogin}>
                <div>
                    <label>Admin ID</label>
                    <input
                        type="text"
                        value={id}
                        onChange={(e) => setId(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Login</button>
            </form>
        </div>
    );
}

export default AdminLogin;
