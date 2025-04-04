import './Registerform.css';
import { FaUser } from "react-icons/fa";
import { RiLockPasswordFill } from "react-icons/ri";
import { MdEmail } from "react-icons/md";
import { FaPhone } from "react-icons/fa6";
import { FaHashtag } from "react-icons/fa6";
import  { useState } from 'react';
import {useNavigate} from 'react-router-dom';
import Swal from 'sweetalert2'
import axios from 'axios';
import Navreg from './Navreg'

function Registerform (){
    
    const [name, setUsername] = useState(''); 
    
    const [dob, setDob] = useState('');
   
    const [phoneno, setPhoneno] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [gender, setGender] = useState('');
    const navigate = useNavigate();
    const [error, setError]= useState('');
    
    const handleOptionChange = (event) => {
        setGender(event.target.value);
      }; 
  const handleSignup = async (e) => {
    try {
         e.preventDefault();
      await axios.post('http://localhost:5000/user/signup', { name, dob, phoneno, email,  password, gender });
      console.log('Signup successful');
      Swal.fire({
        icon: "success",
        title: "Sign Up Successfully",
        text: "You will be Redirected to Login Page",
        //footer: '<a href="#">Why do I have this issue?</a>'
      });
      
      navigate('/login');
      
    } catch (error) {
      console.error('Error signing up:', error.response.data.error);
      setError('Invalid credentials. Please try again.');
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Invalid credentials. Please try again.",
        
      });
         
          setEmail('');
          
    }
    
  };
    return(
        <>
        <Navreg/>
        <div className="rgbg">    
        <div className='wrapper-rg'>
            <form action=''>
                <h1>Register</h1>

                <div className='input-box'>
                    <input type='text' placeholder='Username' value={name} onChange={(e) => setUsername(e.target.value)} required />
                    <FaUser className='icon'/>
                </div>
                
                <div className='solitude'  required>
                        <input type="radio" id="option1" name='gender' value="M" checked={gender === 'M'} onChange={handleOptionChange} />
                        <label  value="M" htmlFor="option1">Male</label>

                        <input type="radio" id="option2" name='gender' value="F" checked={gender === 'F'} onChange={handleOptionChange} />
                        <label value="F" htmlFor="option2">Female</label>

                        <input type="radio" id="option3" name='gender' value="O" checked={gender === 'O'} onChange={handleOptionChange} />
                        <label value="O" htmlFor="option3">Other</label>
                    </div>   
                <div className='input-box'>
                  <input 
                  type="text" 
                  onFocus={(e) => e.target.type = 'date'} 
                  onBlur={(e) => !e.target.value && (e.target.type = 'text') && (e.target.value = 'D.O.B') }
                  value={dob} 
                  onChange={(e) => setDob(e.target.value)} 
                  required 
                />
                </div>
            
                <div className='input-box'>
                <input type="tel" placeholder="Phone no" value={phoneno} onChange={(e) => setPhoneno(e.target.value)} pattern="\d{10}" title="Please enter a valid phone number starting with 20 and consisting of 10 digits" required />
                    <FaPhone className='icon'/>
                </div>
                <div className='input-box'>
                    <input type='email' placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} required />
                    <MdEmail  className='icon'/>
                </div>
                <div className='input-box'>
                    <input type='password' placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} pattern='.{5,}' title="Please enter a password of minimum 5 characters" required />
                    <RiLockPasswordFill className='icon'/>
                </div>

                <button onClick={handleSignup}  type='submit'>Register</button>

                <div className='reglink'>
                    <p>Have an account? <a href="/login">Login</a></p>
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
export default Registerform;
