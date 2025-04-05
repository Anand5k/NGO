import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import './NgoUpdateStatus.css';
import Navnnot from './Navout';

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
        Swal.fire({
          title: 'Error!',
          text: 'Failed to fetch entries.',
          icon: 'error',
          confirmButtonColor: '#d33',
          confirmButtonText: 'Close'
        });
      }
    };

    if (email) fetchEntries();
  }, [email]);

  const handleStatusUpdate = async (id, currentStatus) => {
    const newStatus = currentStatus === 'ngo assigned' ? 'restoration in progress' : 'completed';
    const actionText = newStatus === 'restoration in progress' ? 'start restoration' : 'mark as completed';

    Swal.fire({
      title: `Are you sure?`,
      text: `You are about to ${actionText} for ID ${id}.`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, proceed!',
      cancelButtonText: 'Cancel'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.post('http://localhost:5000/ngo/update-status', {
            email,
            id,
            newStatus
          });

          Swal.fire({
            title: 'Success!',
            text: 'Status updated successfully.',
            icon: 'success',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'OK'
          });

          setEntries(entries.map(entry =>
            entry.id === id ? { ...entry, status: newStatus } : entry
          ));
        } catch (error) {
          console.error('Error updating status:', error);
          Swal.fire({
            title: 'Error!',
            text: 'Failed to update status.',
            icon: 'error',
            confirmButtonColor: '#d33',
            confirmButtonText: 'Close'
          });
        }
      }
    });
  };

  return (
    <>
      <Navnnot />
      <div className="lnbg4">
        <div className="update-status-container">
          <h1>Update Status for {ngoName}</h1>
          {entries.length === 0 ? (
            <p className="no-entries">No entries available to update.</p>
          ) : (
            <div className="status-table-container">
              <table className="status-table">
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
                          <button
                            className="status-button"
                            onClick={() => handleStatusUpdate(entry.id, entry.status)}
                          >
                            {entry.status === 'ngo assigned' ? 'Start Restoration' : 'Complete Restoration'}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default NgoUpdateStatus;
