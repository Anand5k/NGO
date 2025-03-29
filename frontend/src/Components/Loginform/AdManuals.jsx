import "./AdManuals.css";
import axios from 'axios';
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navlog from "./Navout";


function AdManuals() {
    const location = useLocation();
    const [userUnit, setUserUnit] = useState('');
    const [manuals, setManuals] = useState([]);
    const [filteredManuals, setFilteredManuals] = useState([]); // State for filtered results
    const [searchTerm, setSearchTerm] = useState(''); // State for search term
    const [error, setError] = useState('');
  
    useEffect(() => {
      const { AdUnit } = location.state || {};
      setUserUnit(AdUnit || '');
    }, [location.state]);
  
    const fetchManuals = async () => {
      try {
        const response = await axios.get('https://nss-orcin.vercel.app/manuals', { params: { unit: userUnit } });
        setManuals(response.data.manuals);
        setFilteredManuals(response.data.manuals); // Initialize filtered results with all manuals
        setError('');
      } catch (err) {
        setError(err.response?.data?.error || 'Error fetching manuals');
        setManuals([]);
        setFilteredManuals([]);
      }
    };
  
    useEffect(() => {
      if (userUnit) {
        fetchManuals();
      }
    }, [userUnit]);
  
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    };
  
    const handleSearch = (event) => {
      const newSearchTerm = event.target.value.toLowerCase(); // Ensure case-insensitive search
      setSearchTerm(newSearchTerm);
  
      if (newSearchTerm) {
        const filteredResults = manuals.filter((manual) =>
          manual.theme.toLowerCase().includes(newSearchTerm) ||
          manual.description.toLowerCase().includes(newSearchTerm) // Include description in search
        );
        setFilteredManuals(filteredResults);
      } else {
        setFilteredManuals(manuals); // Reset to all manuals if search term is empty
      }
    };
  
    return (
      <>
        <Navlog />
        <div className="usrmbg">
          <h1>Manuals Table</h1>
          <input
            id="search-input"
            type="text"
            placeholder="Search by theme or description..."
            value={searchTerm}
            onChange={handleSearch}
          />
          {error && <p className="error-message">{error}</p>}
          {filteredManuals.length > 0 ? (
            <table className="manuals-table">
              <thead>
                <tr>
                  <th>Manual ID</th>
                  <th>Theme</th>
                  <th className="description-col">Description</th>
                  <th className="date-col">Date</th>
                  <th>Duration</th>
                  <th>Location</th>
                  <th>Lead Organiser</th>
                </tr>
              </thead>
              <tbody>
                {filteredManuals.map((manual) => (
                  <tr key={manual.manual_id}>
                    <td>{manual.manual_id}</td>
                    <td>{manual.theme}</td>
                    <td>{manual.description}</td>
                    <td>{formatDate(manual.date)}</td>
                    <td>{manual.duration}</td>
                    <td>{manual.location}</td>
                    <td>{manual.lead_organiser}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
              <div className="no-results-container">
                <p className="no-results-text">No manuals found matching your search criteria.</p>
              </div>
            )}
        </div>
      </>
    );
  }


export default AdManuals;  
