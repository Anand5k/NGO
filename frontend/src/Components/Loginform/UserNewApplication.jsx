import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

function UserNewApplication() {
  const [userName, setUserName] = useState('');
  
  const location = useLocation();
  const email = location.state?.email;

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        // API call to fetch name using email
        const response = await axios.post('http://localhost:5000/user/name', { email });
        setUserName(response.data.name);
      } catch (error) {
        console.error("Error fetching user name:", error);
      }
    };

    if (email) {
      fetchUserName();
    }
  }, [email]);

  return (
    <>
      <h2>User New Application</h2>
      {userName ? (
        <p>Name: {userName}</p>
      ) : (
        <p>Loading...</p>
      )}
    </>
  );
}

export default UserNewApplication;
