import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './NgoNotifications.css';
import Navnnot from './Navout';
import Swal from 'sweetalert2';

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
      setSelectedIds([]);
      setSelectedImage(null);
    } else {
      setSelectedIds([id]);
      setSelectedImage(null);

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

  const handleRevert = () => {
    setSelectedImage(null);
    setSelectedIds([]);
  };

  const handleAssign = async () => {
    const entryId = selectedIds[0]; // Assuming only one selected
    Swal.fire({
      title: 'Confirm Assignment',
      html: `Are you sure you want to assign <strong>Entry ID: ${entryId}</strong> to <strong>${ngoName}</strong>?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, Assign',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.post('http://localhost:5000/ngo/assign', {
            email,
            selectedIds
          });

          Swal.fire({
            icon: 'success',
            title: 'Assigned!',
            text: 'The entry has been successfully assigned.'
          });
          fetchNotifications();
        } catch (error) {
          console.error('Error assigning NGO:', error);
          Swal.fire('Error!', 'Failed to assign entry.', 'error');
        }
      }
    });
  };

  const handleDelete = async () => {
    const entryId = selectedIds[0]; // Assuming only one selected
    Swal.fire({
      title: 'Mark as Invalid',
      html: `Are you sure you want to <strong>remove Entry ID: ${entryId}</strong>?<br>This cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Delete',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete('http://localhost:5000/ngo/delete-entry', {
            data: { id: entryId }
          });

          Swal.fire({
            icon: 'success',
            title: 'Deleted!',
            text: 'The entry has been removed.'
          });
          fetchNotifications();
        } catch (error) {
          console.error('Error deleting entry:', error);
          Swal.fire('Error!', 'Failed to delete entry.', 'error');
        }
      }
    });
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
              {!selectedImage && (
                <div className="scroll-table">
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
                </div>
              )}

              {selectedImage && (
                <div className="image-section">
                  <h3>Uploaded Image:</h3>
                  <img
                    src={`data:image/png;base64,${selectedImage}`}
                    alt="Selected Entry"
                    className="selected-image"
                  />
                  <br />
                  <button onClick={handleRevert} className="revert-btn">
                    Back to Table
                  </button>
                </div>
              )}

              <div className="action-buttons">
                <button onClick={handleAssign} disabled={selectedIds.length === 0}>
                  Confirm Assignment
                </button>
                <button
                  onClick={handleDelete}
                  disabled={selectedIds.length === 0}
                  className="delete-btn"
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
