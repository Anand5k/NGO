import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

function NgoNotifications() {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;

  const [ngoName, setNgoName] = useState('');
  const [entries, setEntries] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);

  // Function to fetch notifications
  const fetchNotifications = async () => {
    try {
      const response = await axios.get('http://localhost:5000/ngo/notifications', {
        params: { email }
      });

      setNgoName(response.data.ngoname);
      setEntries(response.data.entries);
      setSelectedIds([]); // Reset selection after reload
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  useEffect(() => {
    if (email) {
      fetchNotifications();
    }
  }, [email]);

  // Toggle selection
  const handleSelection = (id) => {
    setSelectedIds(prevSelected =>
      prevSelected.includes(id) ? prevSelected.filter(i => i !== id) : [...prevSelected, id]
    );
  };

  // Confirm assignment
  const handleAssign = async () => {
    try {
      await axios.post('http://localhost:5000/ngo/assign', {
        email,
        selectedIds
      });

      alert('Entries assigned successfully!');
      fetchNotifications(); // Reload after assignment
    } catch (error) {
      console.error('Error assigning NGO:', error);
    }
  };

  return (
    <>
      <h1>Notifications for {ngoName}</h1>
      {entries.length === 0 ? (
        <p>No pending entries to assign.</p>
      ) : (
        <div>
          <table border="1">
            <thead>
              <tr>
                <th>Select</th>
                <th>ID</th>
                <th>Location</th>
                <th>Type</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry) => (
                <tr key={entry.id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(entry.id)}
                      onChange={() => handleSelection(entry.id)}
                    />
                  </td>
                  <td>{entry.id}</td>
                  <td>{entry.location}</td>
                  <td>{entry.type}</td>
                  <td>{entry.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={handleAssign} disabled={selectedIds.length === 0}>
            Confirm Assignment
          </button>
        </div>
      )}
    </>
  );
}

export default NgoNotifications;
