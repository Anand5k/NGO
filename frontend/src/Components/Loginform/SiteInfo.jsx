import './SiteInfo.css';
import Navlog from "./Navout";
import axios from 'axios';
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function SiteInfo() {
  const [units, setUnits] = useState([]);
  const [unitNo, setUnitNo] = useState('');
  const [error, setError] = useState('');
  const [maxUnitNo, setMaxUnitNo] = useState(0);
  const navigate = useNavigate();

  const fetchUnits = async () => {
    try {
      const response = await axios.get('https://nss-orcin.vercel.app/unit');
      const fetchedUnits = response.data.unit;
      setUnits(fetchedUnits);
      setMaxUnitNo(Math.max(...fetchedUnits.map(unit => unit.unit_no)));
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Error fetching Unit Details');
      setUnits([]);
    }
  };

  useEffect(() => {
    fetchUnits();
  }, []);

  const handleUnitNoChange = (e) => {
    setUnitNo(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (parseInt(unitNo) > maxUnitNo) {
      setError(`Unit No. ${unitNo} exceeds the maximum Unit No. ${maxUnitNo}`);
    } else {
      navigate('/regres2', { state: { unitNo } });
    }
  };



  return (
    <>
      <Navlog />
      <div className="sibg">
        <h1>Unit Details</h1>
        
        <table className="si-table">
          <thead>
            <tr>
              <th>Unit No.</th>
              <th>Program Officer</th>
              <th>Designation</th>
              <th>Department</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {units.map((unit) => (
              <tr key={unit.unit_no}>
                <td>{unit.unit_no}</td>
                <td>{unit.name}</td>
                <td>{unit.designation}</td>
                <td>{unit.department}</td>
                <td>{unit.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <h2 style={{color:'black'}}>For More Details</h2>
        <div className="filter-section">
          <form onSubmit={handleSubmit}>
          <div className='unit-input'> <input
              type="text"
              value={unitNo}
              onChange={handleUnitNoChange}
              placeholder="Enter Unit No."
            
            /><div className='filter-button'>
            <button type="submit">Submit</button>
            </div>
            </div>
          </form>
        </div>
        <div className="update-section">
        {error && <p className="error-message">{error}</p>}
        </div>
      </div>
    </>
  );
}

export default SiteInfo;
