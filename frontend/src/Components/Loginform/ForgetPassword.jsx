import { RiLockPasswordFill } from "react-icons/ri";
import { MdEmail } from "react-icons/md";
import { FaHashtag } from "react-icons/fa6";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Navbar from './Navbar';
import axios from "axios";
import './ForgetPassword.css';

function ForgetPassword() {
    const [email, setEmail] = useState("");
    const [dob, setDOB] = useState("");
    const [password, setPassword] = useState("");
    const [checkPassword, setCheckPassword] = useState("");
    const navigate = useNavigate();
    const [error, setError] = useState("");

    const handleForgetPassword = async (e) => {
        e.preventDefault();

        if (password !== checkPassword) {
            setError("Passwords do not match");
            Swal.fire("Error", "Passwords do not match", "error");
            return;
        }

        try {
            await axios.post("http://localhost:5000/user/forget-password", {
                email,
                dob,
                password,
            });

            Swal.fire("Success", "Password changed successfully", "success");
            navigate("/login");
        } catch (error) {
            setError("Invalid credentials");
            Swal.fire("Error", "Invalid credentials. Please try again.", "error");
        }
    };

    return (
        <>
        <Navbar/>
            <div className="background-container">
                <div className="forget-password-container">
                    <form onSubmit={handleForgetPassword}>
                        <h1>Change Password</h1>

                        <div className="input-box">
                            <input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <MdEmail className="icon" />
                        </div>

                        <div className="input-box">
                            <input
                                type="date"
                                placeholder="D.O.B"
                                value={dob}
                                onChange={(e) => setDOB(e.target.value)}
                                required
                            />
                            <FaHashtag className="icon" />
                        </div>

                        <div className="input-box">
                            <input
                                type="password"
                                placeholder="New Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <RiLockPasswordFill className="icon" />
                        </div>

                        <div className="input-box">
                            <input
                                type="password"
                                placeholder="Confirm Password"
                                value={checkPassword}
                                onChange={(e) => setCheckPassword(e.target.value)}
                                required
                            />
                            <RiLockPasswordFill className="icon" />
                        </div>

                        <button type="submit">Submit</button>

                        <div className="message">
                            <p>Have an account? <a href="/login">Login</a></p>
                        </div>

                        {error && <div className="error">{error}</div>}
                    </form>
                </div>
            </div>
        </>
    );
}

export default ForgetPassword;
