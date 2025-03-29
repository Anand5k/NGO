import "./ForgetPassword.css";
import { RiLockPasswordFill } from "react-icons/ri";
import { MdEmail } from "react-icons/md";
import { FaHashtag } from "react-icons/fa6";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Navbar from './Navbar'

import axios from "axios";

function ForgetPassword() {
  const [rollno, setRollno] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [checkPassword, setcheckPassword] = useState("");
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleforgetPassword = async (e) => {
    if (password == checkPassword) {
      try {
        e.preventDefault();

        await axios.post("https://nss-orcin.vercel.app/forgetPassword", {
          rollno,
          email,
          password,
        });
        console.log("Password Changed successfully");
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Your Password has been changed",
          showConfirmButton: false,
          timer: 1500,
        });

        navigate("/login");
      } catch (error) {
        console.error("Error signing up:", error.response.data.error);
        setError("Invalid credentials. Please try again.");
        Swal.fire({
          title: "Oops!",
          text: "Invalid credentials. Please try again",
          icon: "error",
        });
        setRollno("");
        setEmail("");
        setcheckPassword("");
      }
    } 
    else {
      //console.error("Password donot match:", error.response.data.error);
      setError("Password donot match. Please try again.");
      setPassword("");
      setcheckPassword("");
      Swal.fire({
        
        title: "Oops!",
        text: "Password not match. Please try again",
        icon: "error",
      });
      
      
    }
  };
  return (
    <>
    <Navbar/>
    <div className="fpbg">
      <div className="wrapper-fp">
        <form action="">
          <h1>Change Password</h1>

          <div className="input-box">
            <input
              type="int"
              placeholder="Register Number"
              value={rollno}
              onChange={(e) => setRollno(e.target.value)}
              required
            />
            <FaHashtag className="icon" />
          </div>

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
              type="password"
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              pattern=".{5,}"
              //title="Please enter a password of minimum 5 characters"
              required
            />
            <RiLockPasswordFill className="icon" />
          </div>
          <div className="input-box">
            <input
              type="password"
              placeholder="Confirm Password"
              value={checkPassword}
              onChange={(e) => setcheckPassword(e.target.value)}
              pattern=".{5,}"
              title="Please enter a password of minimum 5 characters"
              required
            />
            <RiLockPasswordFill className="icon" />
          </div>

          <button onClick={handleforgetPassword} type="submit">
            Submit
          </button>

          <div className="reglink">
            <p>
              Have an account? <a href="/login">Login</a>
            </p>
          </div>
          <div style={{ textAlign: "center", marginTop: "20px" }}>
            {error && <div className="error">{error}</div>}
          </div>
        </form>
      </div>
    </div>
    </>
  );
}
export default ForgetPassword;
