import './SiteAdmin.css';
import { FaUser } from "react-icons/fa";
import { RiLockPasswordFill } from "react-icons/ri";
import { useState } from 'react';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import Swal from 'sweetalert2'
import Navlog from './Navsad'
function SiteAdmin () {
  const [AdID, setAdId] = useState('');
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [error, setError]= useState('');
  const history = useNavigate();
  

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://nss-orcin.vercel.app/siteAdmin', { AdID, password });
      console.log('Login successful');
      
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Login Successfully",
        showConfirmButton: false,
        timer: 2000
      });
      history(`/siteinfo`, { state: { AdID } });
      
    } catch (error) {
      console.error('Error logging in Site Admin:', error.response.data.error);
      setError('Invalid credentials. Please try again.');
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Invalid Email or Password",
        
      });
      setAdId('');
      setPassword('');
    }
};
    return(
      <>
      <Navlog/>
        <div className="lnbg">
            <div className='wrapper-lg'>
                <form onSubmit={handleLogin}>
                    <h1>Site Admin Sign in</h1>
                    <div className='input-box'>
                        <input type='int' placeholder='ID' value={AdID} onChange={(e) => setAdId(e.target.value)} required />
                        <FaUser className='icon'/>
                    </div>
                    <div className='input-box'>
                        <input type='password' placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} required />
                        <RiLockPasswordFill className='icon'/>
                    </div>

                    

                    <button>Login</button>

                    
                </form>
                <div style={{ textAlign: "center", marginTop: "20px" }}>
                        {error && <div className="error">{error}</div>}
                    </div>


            </div>
        </div>
        </>
    );
}

export default SiteAdmin;
