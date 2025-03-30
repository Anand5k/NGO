import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';
import Navad from "./Navout";

function UserPreviousHistory() {
  const location = useLocation();
  const { email } = location.state || {};
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (email) {
      fetchUserHistory();
    }
  }, [email]);

  // Fetch History Function
  const fetchUserHistory = async () => {
    try {
      const response = await axios.get('http://localhost:5000/user/previousHistory', {
        params: { email }
      });
      setHistory(response.data.history);
    } catch (error) {
      console.error('Error fetching history:', error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.response?.data?.error || "Failed to fetch history",
      });
    }
  };

  return (
    <>
      
      <div className="mibg">
        <div className="wrapper-mi">
          <h1>User Previous History</h1>

          {history.length === 0 ? (
            <p>No history available</p>
          ) : (
            <table border="1">
              <thead>
                <tr>
                  <th>Application ID</th>
                  <th>Location</th>
                  <th>Type</th>
                  <th>NGO</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {history.map((record) => (
                  <tr key={record.id}>
                    <td>{record.id}</td>
                    <td>{record.location}</td>
                    <td>{record.type}</td>
                    <td>{record.ngo}</td>
                    <td>{record.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
}

export default UserPreviousHistory;
