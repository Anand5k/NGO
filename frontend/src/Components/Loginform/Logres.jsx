import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Navlog from './Navout';

function Logres() {
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userDOB, setUserDOB] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [userGender, setUserGender] = useState('');

  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.post('http://localhost:5000/user/details', { email });

        // Destructuring response with correct variable names
        const { name, emailID, dob, phoneNo, gender } = response.data;

        // Setting state variables
        setUserName(name);
        setUserEmail(emailID); // Corrected emailID -> emailid
        setUserDOB(dob);
        setUserPhone(phoneNo); // Corrected phoneNo -> phoneno
        setUserGender(gender);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    if (email) {
      fetchUserDetails();
    }
  }, [email]);

  // Button Handlers
  const goToNewApplication = () => navigate('/user/new-application', { state: { email } });
  const goToCheckStatus = () => navigate('/user/check-status', { state: { email } });
  const goToPreviousHistory = () => navigate('/user/previous-history', { state: { email } });

  return (
    <>
      <Navlog />
      <div>
        <h2>Welcome, {userName}!</h2>
        <h2>User Details</h2>
        <div>
          <p>Name: {userName}</p>
          <p>Email: {userEmail}</p>
          <p>DOB: {userDOB}</p>
          <p>Phone Number: {userPhone}</p>
          <p>Gender: {userGender}</p>
        </div>

        <div>
          <button onClick={goToNewApplication}>New Application</button>
          <button onClick={goToCheckStatus}>Check Status</button>
          <button onClick={goToPreviousHistory}>Previous History</button>
        </div>
      </div>
    </>
  );
}

export default Logres;
