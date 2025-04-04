import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './NgoNotifications.css';
import Navnnot from './Navnnot';

function NgoNotifications() {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;

  const [ngoName, setNgoName] = useState('');
  const [entries, setEntries] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      const response = await axios.get('http://localhost:5000/ngo/notifications', {
        params: { email }
      });

      setNgoName(response.data.name);
      setEntries(response.data.entries);
      setSelectedIds([]);
      setSelectedImage(null); // Reset image on reload
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  useEffect(() => {
    if (email) {
      fetchNotifications();
    }
  }, [email]);

  // Toggle selection and fetch image
  // Toggle selection and fetch image
const handleSelection = async (id) => {
  if (selectedIds.includes(id)) {
    // Deselect the current entry
    setSelectedIds(selectedIds.filter(i => i !== id));
    setSelectedImage(null);
  } else {
    // Clear existing image first
    setSelectedImage(null);
    setSelectedIds([id]);

    try {
      // Fetch the new image
      const response = await axios.get('http://localhost:5000/ngo/get-image', {
        params: { id }
      });

      // Display the fetched image
      setSelectedImage(response.data.image);
    } catch (error) {
      console.error("Error fetching image:", error);
    }
  }
};


  // Confirm assignment
  const handleAssign = async () => {
    try {
      await axios.post('http://localhost:5000/ngo/assign', {
        email,
        selectedIds
      });

      alert('Entries assigned successfully!');
      fetchNotifications(); // Reload
    } catch (error) {
      console.error('Error assigning NGO:', error);
    }
  };

  return (
    <>
      <Navnnot /> {/* Navbar Included Here */}
      <div className="ngobg">
        <div className="ngo-wrapper">
          <h1>Notifications for {ngoName}</h1>
          {entries.length === 0 ? (
            <p>No pending entries to assign.</p>
          ) : (
            <div>
              <table>
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

              {selectedImage && (
                <div>
                  <h3>Uploaded Image:</h3>
                  <img
                    src={`data:image/png;base64,${selectedImage}`}
                    alt="Selected Entry"
                    style={{ maxWidth: "400px", maxHeight: "300px" }}
                  />
                </div>
              )}

              <button onClick={handleAssign} disabled={selectedIds.length === 0}>
                Confirm Assignment
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default NgoNotifications;
