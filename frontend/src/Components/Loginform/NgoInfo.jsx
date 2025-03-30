import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

function NgoInfo() {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;

  const [ngoName, setNgoName] = useState('');
  const [completedCount, setCompletedCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    const fetchNgoInfo = async () => {
      try {
        const response = await axios.get('http://localhost:5000/ngo/info', {
          params: { email },
        });

        setNgoName(response.data.ngoName);
        setCompletedCount(parseInt(response.data.completedCount));
        setPendingCount(parseInt(response.data.pendingCount));
      } catch (error) {
        console.error('Error fetching NGO info:', error);
      }
    };

    if (email) {
      fetchNgoInfo();
    }
  }, [email]);

  // Navigate to Notifications
  const handleNotifications = () => {
    navigate('/ngo/notifications', { state: { email } });
  };

  // Navigate to Update Status
  const handleUpdateStatus = () => {
    navigate('/ngo/update-status', { state: { email } });
  };

  return (
    <>
      <div className="ngo-info-container">
        <h1>NGO Information</h1>
        <div className="ngo-details">
          <p><strong>NGO Name:</strong> {ngoName}</p>
          <p><strong>Completed Applications:</strong> {completedCount}</p>
          <p><strong>Pending Applications:</strong> {pendingCount}</p>
          <p><strong>Total Work:</strong> {completedCount + pendingCount}</p>
        </div>
        <button onClick={handleNotifications}>Notifications</button>
        <button onClick={handleUpdateStatus}>Update Status</button>
      </div>
    </>
  );
}

export default NgoInfo;
