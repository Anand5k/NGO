import './AdManualInsert.css';
import Navad from "./Navout";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Swal from 'sweetalert2';

function AdManualInsert() {
  const location = useLocation();
  const [AdUnit, setAdUnit] = useState('');
  const [email, setAdEmail] = useState('');
  const navigate = useNavigate('');

  useEffect(() => {
    const { AdUnit, AdEmail } = location.state || {};
    setAdUnit(AdUnit || '');
    setAdEmail(AdEmail || '');
  }, [location.state]);

  const [theme, setTheme] = useState('');
  const [description, setDescription] = useState('');
  const [absentees, setAbsentees] = useState('');
  const [manualDate, setManualDate] = useState('');
  const [duration, setDuration] = useState('');
  const [Location, setLocation] = useState('');
  const [LO, setLO] = useState('');

  const handleInsertManual = async (e) => {
    try {
      e.preventDefault();
      await axios.post('https://nss-orcin.vercel.app//Ad/manualInsert', { AdUnit, theme, description, manualDate, duration, Location, LO, absentees });
      console.log('Manual Inserted successful');
      Swal.fire({
        icon: "success",
        title: "Manual Inserted Successfully",
      });
      navigate('/Regres', { state: { email } });
    } catch (error) {
      console.error('Error signing up:', error.response.data.error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Invalid credentials. Please try again.",
      });
      setAbsentees('');
      setTheme('');
      setDescription('');
      setDuration('');
      setManualDate('');
      setLO('');
    }
  }

  return (
    <>
      <Navad />
      <div className="mibg">
        <div className="wrapper-mi">
          <form action="">
            <h1>New Manual</h1>
            <div className="input-box-mi">
              <input type="text" placeholder="Theme" value={theme} onChange={(e) => setTheme(e.target.value)} required />
            </div>
            <div className="input-box-mid">
              <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} required></textarea>
            </div>
            <div className="input-row">
              <div className="input-box-mi-half">
                <input 
                  type="text" 
                  onFocus={(e) => e.target.type = 'date'} 
                  onBlur={(e) => !e.target.value && (e.target.type = 'text') && (e.target.value = 'Date') }
                  value={manualDate} 
                  onChange={(e) => setManualDate(e.target.value)} 
                  required 
                />
              </div>
              <div className="input-box-mi-half">
                <input type="text" className='half' placeholder="Duration in days" value={duration} onChange={(e) => setDuration(e.target.value)} required />
              </div>
            </div>
            <div className="input-box-mi">
              <input type="text" placeholder="Location" value={Location} onChange={(e) => setLocation(e.target.value)} required />
            </div>
            <div className="input-box-mi">
              <input type="text" placeholder="Lead Organizer" value={LO} onChange={(e) => setLO(e.target.value)} required />
            </div>
            <div className="input-box-mid">
              <textarea placeholder="Absentees Role No." value={absentees} onChange={(e) => setAbsentees(e.target.value)} required></textarea>
            </div>
            <button onClick={handleInsertManual} type='submit'>Register</button>
          </form>
        </div>
      </div>
    </>
  );
}

export default AdManualInsert;
