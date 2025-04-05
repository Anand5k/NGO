import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2'; // 🔹 SweetAlert import
import './UserCheckStatus.css';
import Navlog from './Navout';

function UserCheckStatus() {
  const location = useLocation();
  const email = location.state?.email;

  const [userName, setUserName] = useState('');
  const [applicationID, setApplicationID] = useState('');
  const [entryDetails, setEntryDetails] = useState(null);
  const [submitted, setSubmitted] = useState(false); // 🔹 Track submit state

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

  const handleIDChange = (e) => {
    setApplicationID(e.target.value);
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post('http://localhost:5000/user/track', { id: applicationID });
      if (response.data.entry) {
        setEntryDetails(response.data.entry);
        setSubmitted(true); // 🔹 Hide input & button
        Swal.fire({
          title: 'Success!',
          text: 'Entry details fetched successfully!',
          icon: 'success',
          confirmButtonText: 'OK'
        });
      } else {
        Swal.fire({
          title: 'Not Found',
          text: 'No entry found with this Application ID.',
          icon: 'info',
          confirmButtonText: 'OK'
        });
      }
    } catch (error) {
      console.error("Error fetching entry details:", error);
      setEntryDetails(null);
      Swal.fire({
        title: 'Error!',
        text: 'Failed to fetch entry details. Please try again.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  };

  return (
    <>
      <Navlog />
      <div className="ucsbg">
        <div className="user-check-status">
          <h1>User Check Status</h1>
          <h2>Welcome, {userName}!</h2>

          {/* 🔹 Hide form after submit */}
          {!submitted && (
            <>
              <input
                type="text"
                id="applicationID"
                value={applicationID}
                onChange={handleIDChange}
                placeholder="Enter Application ID (e.g., R001)"
              />
              <button onClick={handleSubmit} disabled={!applicationID}>Submit</button>
            </>
          )}

          {entryDetails && (
            <div>
              <h3>Entry Details:</h3>
              <p><strong>ID:</strong> {entryDetails.id}</p>
              <p><strong>Applicant Name:</strong> {entryDetails.applicantName}</p>
              <p><strong>Location:</strong> {entryDetails.location}</p>
              <p><strong>Type:</strong> {entryDetails.type}</p>
              <p><strong>Status:</strong> {entryDetails.status}</p>
              <p><strong>NGO:</strong> {entryDetails.ngo || "Not Assigned"}</p>

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
