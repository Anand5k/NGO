import './Adlogin.css';
import { FaUser } from "react-icons/fa";
import { RiLockPasswordFill } from "react-icons/ri";
import { useState } from 'react';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import Swal from 'sweetalert2'
import Navad from './Navad'


function Adloginform () {
    const [email, setEmail] = useState('');
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [error, setError]= useState('')

    const handleAdLogin = async (e) => {
        e.preventDefault()
        try {
          const reps=await axios.post('http://localhost:5000/NGO/login', { email, password });
          console.log(reps)
          console.log('Login successful');
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Login Successfully",
            showConfirmButton: false,
            timer: 2000
          });

          //navigate('/Regres', { state: { email } });
        } catch (error) {
          console.error('Error Admin logging in:', error.response.data.error);
          setError('Invalid credentials. Please try again.');
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Invalid Email or Password",
            
          });
          
          setProid('');
          setPassword('');
        }
      };

    return(
      <>
      <Navad/>
        <div className="adlnbg">
            <div className='wrapper-adln'>
                <form onSubmit={handleAdLogin}>
                    <h1>NGO Sign in</h1>
                    <div className='input-box'>
                        <input type='text' placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} required />
                        <FaUser className='icon'/>
                    </div>
                    <div className='input-box'>
                        <input type='password' placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} required />
                        <RiLockPasswordFill className='icon'/>
                    </div>              

                    <button type='submit'>Login</button>


                </form>
                <div style={{ textAlign: "center", marginTop: "20px" }}>
                        {error && <div className="error">{error}</div>}
                    </div>

            </div>
        </div>
        </>
    );
}
export default Adloginform;
