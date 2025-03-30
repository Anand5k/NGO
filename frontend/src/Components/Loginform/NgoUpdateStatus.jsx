import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

function NgoUpdateStatus() {
  const location = useLocation();
  const email = location.state?.email;

  const [ngoName, setNgoName] = useState('');
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const response = await axios.get('http://localhost:5000/ngo/update-status', {
          params: { email }
        });

        setNgoName(response.data.ngoName);
        setEntries(response.data.entries);
      } catch (error) {
        console.error('Error fetching entries:', error);
      }
    };

    if (email) fetchEntries();
  }, [email]);

  const handleStatusUpdate = async (id, currentStatus) => {
    const newStatus = currentStatus === 'ngo assigned' ? 'restoration in progress' : 'completed';

    try {
      await axios.post('http://localhost:5000/ngo/update-status', {
        email,
        id,
        newStatus
      });
      alert('Status updated successfully');
      setEntries(entries.map(entry => entry.id === id ? { ...entry, status: newStatus } : entry));
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  return (
    <>
      <h1>Update Status for {ngoName}</h1>
      {entries.length === 0 ? (
        <p>No entries available to update.</p>
      ) : (
        <table border="1">
          <thead>
            <tr>
              <th>ID</th>
              <th>Location</th>
              <th>Type</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => (
              <tr key={entry.id}>
                <td>{entry.id}</td>
                <td>{entry.location}</td>
                <td>{entry.type}</td>
                <td>{entry.status}</td>
                <td>
                  {entry.status !== 'completed' && (
                    <button onClick={() => handleStatusUpdate(entry.id, entry.status)}>
                      {entry.status === 'ngo assigned' ? 'Start Restoration' : 'Complete Restoration'}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}

export default NgoUpdateStatus;
