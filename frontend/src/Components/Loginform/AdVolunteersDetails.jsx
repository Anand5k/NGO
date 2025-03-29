import "./AdVolunteersDetails.css";
import Navad from "./Navout";
import axios from 'axios';
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { FaSearch } from 'react-icons/fa'; // Import search icon from react-icons library

function AdVolunteersDetails() {
  const location = useLocation();
  const [AdUnit, setAdUnit] = useState('');
  const [details, setVolunteersDetails] = useState([]);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredDetails, setFilteredDetails] = useState([]);

  useEffect(() => {
    const { AdUnit } = location.state || {};
    setAdUnit(AdUnit || '');
  }, [location.state]);

  const fetchVolunteersDetails = async () => {
    try {
      const response = await axios.get('https://nss-orcin.vercel.app/Ad/volunteerDetails', {
        params: { unit: AdUnit }
      });
      setVolunteersDetails(response.data.details);
      setFilteredDetails(response.data.details); // Initialize filteredDetails with the full data set
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Error fetching volunteers details by Admin');
      setVolunteersDetails([]);
      setFilteredDetails([]);
    }
  };

  useEffect(() => {
    if (AdUnit) {
      fetchVolunteersDetails();
    }
  }, [AdUnit]);

  useEffect(() => {
    const searchRegex = new RegExp(searchTerm, 'i'); // Case-insensitive regex pattern
    const filtered = details.filter(volunteer => searchRegex.test(volunteer.volunteer_id.toString()));
    setFilteredDetails(filtered);
  }, [searchTerm, details]);

  return (
    <>
      <Navad/>
      <div className="adusrbg">
        <h1>Volunteers Details</h1>
        <div className="search-container">
          <FaSearch className="search-icon" /> {/* Search icon */}
          <input
            type="text"
            placeholder="Search by Volunteer ID"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        {error && <p className="error-message">{error}</p>}
        {filteredDetails.length > 0 ? (
          <table className="aduser-table">
            <thead>
              <tr className="trh">
                <th>Volunteer ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th className="man_ptd">Manuals Participated</th>
                <th>Phone Number</th>
              </tr>
            </thead>
            <tbody>
              {filteredDetails.map((volunteer) => (
                <tr key={volunteer.volunteer_id}>
                  <td>{volunteer.volunteer_id}</td>
                  <td>{volunteer.name}</td>
                  <td>{volunteer.email}</td>
                  <td>{volunteer.role}</td>
                  <td>{volunteer.no_of_manuals_attended}</td>
                  <td>{volunteer.phone_numbers}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No Volunteer Details found</p>
        )}
      </div>
    </>
  );
}

export default AdVolunteersDetails;
