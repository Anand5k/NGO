import './AdminLogin.css';
import { FaUser } from "react-icons/fa";
import { RiLockPasswordFill } from "react-icons/ri";
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import Navlog from './Nav';

function AdminLogin() {
    const [id, setId] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/admin/login', {
                id,
                password
            });

            Swal.fire({
                position: "center",
                icon: "success",
                title: response.data.message || "Login Successfully",
                showConfirmButton: false,
                timer: 2000
            });

            navigate("/siteAdmin");
        } catch (error) {
            console.error('Error logging in:', error.response?.data?.message);
            setError('Invalid credentials. Please try again.');
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: error.response?.data?.message || "Invalid ID or Password",
            });
            setId('');
            setPassword('');
        }
    };

    return (
        <>
            <Navlog />
            <div className="admin-login-bg">
                <div className='admin-wrapper'>
                    <form onSubmit={handleLogin}>
                        <h1>Admin Login</h1>
                        <div className='admin-input-box'>
                            <input
                                type='text'
                                placeholder='Admin ID'
                                value={id}
                                onChange={(e) => setId(e.target.value)}
                                required
                            />
                            <FaUser className='admin-icon' />
                        </div>
                        <div className='admin-input-box'>
                            <input
                                type='password'
                                placeholder='Password'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <RiLockPasswordFill className='admin-icon' />
                        </div>

                        <div className='admin-remember'>
                            <a href="/admin/forgotPassword"></a>
                        </div>

                        <button type="submit" className='admin-login-btn'>Login</button>

                        <div className='admin-reglink'>
                            <p>Not an Admin? <a href="/">Go Home</a></p>
                        </div>
                    </form>

                    <div style={{ textAlign: "center", marginTop: "20px" }}>
                        {error && <div className="admin-error">{error}</div>}
                    </div>
                </div>
            </div>
        </>
    );
}

export default AdminLogin;
