import "./UserUpdatePhoneno.css";
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';
import Navlog from './Navout';

function UserUpdatePhoneno() {
  const location = useLocation();
  const [rollno, setRollno] = useState('');
  const [phoneno, setPhoneno] = useState('');
  const [newPhoneno, setConfirmPhoneno] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const { rollno } = location.state || {};
    setRollno(rollno || '');  // Default to empty string if rollno is undefined
  }, [location.state]);

  const handleUpdatePhoneno = async (e) => {
    e.preventDefault();
    const rollnoInt = parseInt(rollno, 10);
      try {
        await axios.post("https://nss-orcin.vercel.app/user/updatePhoneno", {
          rollno: rollnoInt,
          phoneno: phoneno,
          newPhoneno: newPhoneno

        });
        console.log("PhoneNo. updated successfully");
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Your PhoneNo. Updated",
          showConfirmButton: false,
          timer: 1500,
        });
        navigate(`/logres`, { state: { rollno: rollnoInt } });
      } catch (error) {
        console.error("Error updating Phoneno:", error.response?.data?.error || error.message);
        setError("Failed to update phone number. Please try again.");
        Swal.fire({
          title: "Oops!",
          text: "Failed to update phone number. Please try again.",
          icon: "error",
        });
        setPhoneno('');
        setConfirmPhoneno('');
      }
    
  };

  return (
    <>
      <Navlog />
      <div className="lnbg">
        <div className='wrapper-lg'>
          <form onSubmit={handleUpdatePhoneno}>
            <h1>Update Phone Number</h1>
            
            <div className='input-box'>
              <input
                type='text'
                placeholder='PhoneNo.'
                value={phoneno}
                onChange={(e) => setPhoneno(e.target.value)}
                required
              />
            </div>
            <div className='input-box'>
              <input
                type='text'
                placeholder='New PhoneNo.'
                value={newPhoneno}
                onChange={(e) => setConfirmPhoneno(e.target.value)}
                required
              />
            </div>
            <button type="submit">Confirm</button>
          </form>
          <div style={{ textAlign: "center", marginTop: "20px" }}>
            {error && <div className="error">{error}</div>}
          </div>
        </div>
      </div>
    </>
  );
}

export default UserUpdatePhoneno;
