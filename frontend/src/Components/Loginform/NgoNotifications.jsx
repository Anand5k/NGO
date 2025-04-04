import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2'; // SweetAlert2
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

  const fetchNotifications = async () => {
    try {
      const response = await axios.get('http://localhost:5000/ngo/notifications', {
        params: { email }
      });

      setNgoName(response.data.name);
      setEntries(response.data.entries);
      setSelectedIds([]);
      setSelectedImage(null);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  useEffect(() => {
    if (email) {
      fetchNotifications();
    }
  }, [email]);

  const handleSelection = async (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id));
      setSelectedImage(null);
    } else {
      setSelectedImage(null);
      setSelectedIds([id]);

      try {
        const response = await axios.get('http://localhost:5000/ngo/get-image', {
          params: { id }
        });

        setSelectedImage(response.data.image);
      } catch (error) {
        console.error("Error fetching image:", error);
      }
    }
  };

  const handleAssign = async () => {
    if (selectedIds.length === 0) return;

    const confirmResult = await Swal.fire({
      title: 'Are you sure?',
      text: `You are about to take over ${selectedIds.length} entry(ies).`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, Takeover',
      cancelButtonText: 'Cancel',
    });

    if (confirmResult.isConfirmed) {
      try {
        await axios.post('http://localhost:5000/ngo/assign', {
          email,
          selectedIds
        });

        Swal.fire('Success!', 'Entries assigned successfully!', 'success');
        fetchNotifications();
      } catch (error) {
        console.error('Error assigning NGO:', error);
        Swal.fire('Error!', 'Failed to assign entries.', 'error');
      }
    }
  };

  const handleMarkInvalid = async () => {
    if (selectedIds.length !== 1) {
      Swal.fire('Oops!', 'Please select a single entry to mark as invalid.', 'warning');
      return;
    }

    const confirmResult = await Swal.fire({
      title: 'Mark as Invalid?',
      text: 'This will remove the entry permanently.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Delete',
      cancelButtonText: 'Cancel',
    });

    if (confirmResult.isConfirmed) {
      try {
        await axios.post('http://localhost:5000/ngo/delete-entry', {
          id: selectedIds[0]
        });

        Swal.fire('Deleted!', 'Entry marked as invalid.', 'success');
        fetchNotifications();
      } catch (error) {
        console.error("Error deleting entry:", error);
        Swal.fire('Error!', 'Failed to delete the entry.', 'error');
      }
    }
  };

  return (
    <>
      <Navnnot />
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

              <div style={{ marginTop: '10px' }}>
                <button onClick={handleAssign} disabled={selectedIds.length === 0}>
                  Confirm Assignment
                </button>
                <button
                  onClick={handleMarkInvalid}
                  disabled={selectedIds.length !== 1}
                  style={{ marginLeft: '10px', backgroundColor: 'crimson', color: 'white' }}
                >
                  Mark as Invalid
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default NgoNotifications;
