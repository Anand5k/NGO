import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import './UserCheckStatus.css';
import Navlog from './Navout';

function UserCheckStatus() {
  const location = useLocation();
  const email = location.state?.email;

  const [userName, setUserName] = useState('');
  const [applicationID, setApplicationID] = useState('');
  const [entryDetails, setEntryDetails] = useState(null);

  // Fetch logged-in user name
  useEffect(() => {
    const fetchUserName = async () => {
      try {
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

  // Handle ID input change
  const handleIDChange = (e) => {
    setApplicationID(e.target.value);
  };

  // Handle submit to get entry details
  const handleSubmit = async () => {
    try {
      const response = await axios.post('http://localhost:5000/user/track', { id: applicationID });
      setEntryDetails(response.data.entry);
    } catch (error) {
      console.error("Error fetching entry details:", error);
      setEntryDetails(null);
    }
  };

  return (
    <>
      <Navlog />
      <div className="ucsbg">
        <div className="user-check-status">
          <h1>User Check Status</h1>
          <h2>Welcome, {userName}!</h2>

          <label htmlFor="applicationID"><strong>Enter Application ID:</strong></label>
          <input
            type="text"
            id="applicationID"
            value={applicationID}
            onChange={handleIDChange}
            placeholder="Enter ID (e.g., R001)"
          />
          <button onClick={handleSubmit} disabled={!applicationID}>Submit</button>

          {entryDetails && (
            <div>
              <h3>Entry Details:</h3>
              <p><strong>ID:</strong> {entryDetails.id}</p>
              <p><strong>Applicant Name:</strong> {entryDetails.applicantName}</p>
              <p><strong>Location:</strong> {entryDetails.location}</p>
              <p><strong>Type:</strong> {entryDetails.type}</p>
              <p><strong>Status:</strong> {entryDetails.status}</p>
              <p><strong>NGO:</strong> {entryDetails.ngo || "Not Assigned"}</p>

              {/* Display Image */}
              {entryDetails.image && (
                <div>
                  <h3>Uploaded Image:</h3>
                  <img
                    src={`data:image/jpeg;base64,${entryDetails.image}`}
                    alt="Uploaded"
                    style={{ width: '300px', height: 'auto', borderRadius: '8px' }}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default UserCheckStatus;
