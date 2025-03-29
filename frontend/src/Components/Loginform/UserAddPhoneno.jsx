import "./UserAddPhoneno.css";
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';
import Navlog from './Navout';

function UserAddPhoneno() {
  const location = useLocation();
  const [rollno, setRollno] = useState('');
  const [phoneno, setPhoneno] = useState('');
  const [confirmPhoneno, setConfirmPhoneno] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const { rollno } = location.state || {};
    setRollno(rollno || '');  // Default to empty string if rollno is undefined
  }, [location.state]);

  const handleAddPhoneno = async (e) => {
    e.preventDefault();
    const rollnoInt = parseInt(rollno, 10);
    

    
    

    if (phoneno === confirmPhoneno) {
      try {
        await axios.post("https://nss-orcin.vercel.app/user/addPhoneno", {
          rollno: rollnoInt,
          phoneno: phoneno
        });
        console.log("PhoneNo. Added successfully");
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Your PhoneNo. Added",
          showConfirmButton: false,
          timer: 1500,
        });
        navigate(`/logres`, { state: { rollno: rollnoInt } });
      } catch (error) {
        console.error("Error Adding Phoneno:", error.response?.data?.error || error.message);
        setError("Failed to add phone number. Please try again.");
        Swal.fire({
          title: "Oops!",
          text: "Failed to add phone number. Please try again.",
          icon: "error",
        });
        setPhoneno('');
        setConfirmPhoneno('');
      }
    } else {
      setError("Phone numbers do not match. Please try again.");
      setPhoneno('');
      setConfirmPhoneno('');
      Swal.fire({
        title: "Oops!",
        text: "Phone numbers do not match. Please try again.",
        icon: "error",
      });
    }
  };

  return (
    <>
      <Navlog />
      <div className="lnbg">
        <div className='wrapper-lg'>
          <form onSubmit={handleAddPhoneno}>
            <h1>Add Phone Number</h1>
            
            <div className='input-box'>
              <input
                type='text'
                placeholder='New PhoneNo.'
                value={phoneno}
                onChange={(e) => setPhoneno(e.target.value)}
                required
              />
            </div>
            <div className='input-box'>
              <input
                type='text'
                placeholder='Confirm New PhoneNo.'
                value={confirmPhoneno}
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

export default UserAddPhoneno;
