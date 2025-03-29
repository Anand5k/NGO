import { useState, useEffect } from 'react';
import { useNavigate, useLocation} from 'react-router-dom';
import axios from 'axios';
import Navreg from './Navout';
import './Regres2.css';


function Regres2() {
    const navigate = useNavigate();
    const location = useLocation();
    

    useEffect(() => {
        const { unitNo } = location.state || {};
        setAdUnit(unitNo || '');  
    }, [location.state]);


  const [AdID, setAdID] = useState('');

  const [AdUnit, setAdUnit] = useState('');
  const [unitManualsConducted, setUnitManualsConducted] =  useState('');
  const [unitGS, setUnitGS]= useState('');
  const [unitJS, setUnitJS]= useState('');
  const [unitVolunteers, setUnitVolunteers]= useState('');
  

 
  useEffect(() => {
    const fetchUnitDetails = async () => {
      try {
        const response = await axios.get(`https://nss-orcin.vercel.app/Ad/unitDetails`,{
            params: { unit: AdUnit },
          }
        );
        setUnitManualsConducted(response.data.unitManualsConducted);
        setUnitGS(response.data.unitGS);
        setUnitJS(response.data.unitJS);
        setUnitVolunteers(response.data.unitVolunteers);

      } catch (error) {
        console.error("Error:", error);
      }
    };
    if (AdUnit) {
      fetchUnitDetails();
    }
  }, [AdUnit]);


  const goToAttendenceDetails = () => {
    navigate('/Ad/attendence', { state: { AdUnit } });
  };
  const goToUnitManuals = () => {
    navigate('/Ad/manuals', { state: { AdUnit } });
  }; 
  
  const goToVolunteersDetails = () => {
    navigate('/Ad/volunteersDetails', { state: { AdUnit } });
  };

  const handleUpdateProgramOfficer = (e) => {
    e.preventDefault();
    navigate('/Ad/update', { state: { AdUnit } });
  };

  return (
    <>
      <Navreg />
      <div className="lgrbg2">
        
        <div className="wrapper-lgr2">
        <center><div className="label-input-pair2">
            <label>Unit:</label>
            <input type="text" value={AdUnit} readOnly />
          </div></center>
          
          <div className="label-input-pair2">
            <label>Volunteers in Unit:</label>
            <input type="text" value={unitVolunteers} readOnly />
          </div>
          <div className="label-input-pair2">
            <label>Manuals Conducted:</label>
            <input type="text" value={unitManualsConducted} readOnly />
          </div>
          <div className="label-input-pair2 ss">
            <label>GS:</label>
            <input type="text" value={unitGS} readOnly />
          </div>
          <div className="label-input-pair2">
            <label>JS:</label>
            <input type="text" value={unitJS} readOnly />
          </div>
          

        
          <div className="Remember2lg2" style={{visibility:'hidden'}}>
            <button>Manuals Details</button>
          </div>
          <div className="Remember2lg2">
            <button onClick={goToAttendenceDetails}>Attendence Details</button>
          </div>
          
          <div className="Remember2lg2">
            <button onClick={goToVolunteersDetails}>Volunteers Details</button>
          </div>

          <div className="Remember2lg2">
            <button onClick={handleUpdateProgramOfficer}>Update Program Officer</button>
          </div>
          <div className="Remember2lg2">
            <button onClick={goToUnitManuals}>Manuals Details</button>
          </div>
          
          


        </div>
      </div>
    </>
  );
}

export default Regres2;
