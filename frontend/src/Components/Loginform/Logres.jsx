import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Navlog from './Navout';
import './Logres.css'; // Import CSS

function Logres() {
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userDOB, setUserDOB] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [userGender, setUserGender] = useState('');

  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  // Format DOB to DD-MM-YYYY
  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  // Convert single-letter gender to full word
  const formatGender = (gender) => {
    switch (gender?.toUpperCase()) {
      case 'M':
        return 'Male';
      case 'F':
        return 'Female';
      case 'O':
        return 'Other';
      default:
        return 'Prefer not to say';
    }
  };

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.post('http://localhost:5000/user/details', { email });

        const { name, emailID, dob, phoneNo, gender } = response.data;

        setUserName(name);
        setUserEmail(emailID);
        setUserDOB(formatDate(dob));
        setUserPhone(phoneNo);
        setUserGender(formatGender(gender)); // format gender here
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
      <div className='lsbg'>
        <div className="user-info-container">
          <h1>User Information</h1>
          <div className="user-details">
            <p><strong>Name:</strong> {userName}</p>
            <p><strong>Email:</strong> {userEmail}</p>
            <p><strong>DOB:</strong> {userDOB}</p>
            <p><strong>Phone Number:</strong> {userPhone}</p>
            <p><strong>Gender:</strong> {userGender}</p>
          </div>
          <div className="button-container">
            <button onClick={goToNewApplication} className="styled-button">New Application</button>
            <button onClick={goToCheckStatus} className="styled-button">Check Status</button>
            <button onClick={goToPreviousHistory} className="styled-button">Previous History</button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Logres;
