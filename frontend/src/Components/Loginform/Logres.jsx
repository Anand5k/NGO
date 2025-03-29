import { useState, useEffect } from 'react';
import { useNavigate, useLocation} from 'react-router-dom';
import axios from 'axios';
import Navlog from './Navout';
import './Logres.css';

function Logres() {
  const [userName, setUserName] = useState('');
  const [userUnit, setUserUnit] = useState('');
  const [userUnitGS, setUserUnitGS] = useState('');
  const [userUnitJS, setUserUnitJS] = useState('');
  const [userUnitManualsConducted, setUserUnitManualsConducted] = useState('');
  const [userProgramOfficer, setUserProgramOfficer] = useState('');
  const [userUnitVolunteers, setUserUnitVolunteers] = useState('');

  const navigate = useNavigate();
  const location = useLocation();
  const rollno = location.state?.rollno;

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const response = await axios.get(`https://nss-orcin.vercel.app/user/name`, {
          params: { rollno: rollno },
        });
        setUserName(response.data.name);
      } catch (error) {
        console.error("Error:", error);
      }
    };
    if (rollno) {
      fetchUserName();
    }
  }, [rollno]);

  useEffect(() => {
    const fetchUserUnit = async () => {
      try {
        const response = await axios.get(`https://nss-orcin.vercel.app/user/unit`, {
          params: { rollno: rollno },
        });
        setUserUnit(response.data.unit);
      } catch (error) {
        console.error("Error:", error);
      }
    };
    if (rollno) {
      fetchUserUnit();
    }
  }, [rollno]);

  useEffect(() => {
    const fetchUserProgramOfficer = async () => {
      try {
        const response = await axios.get(
          `https://nss-orcin.vercel.app/user/programOfficer`,
          {
            params: { unit: userUnit },
          }
        );
        setUserProgramOfficer(response.data.programOfficer);
      } catch (error) {
        console.error("Error:", error);
      }
    };
    if (userUnit) {
      fetchUserProgramOfficer();
    }
  }, [userUnit]);

  useEffect(() => {
    const fetchUserUnitVolunteers = async () => {
      try {
        const response = await axios.get(
          `https://nss-orcin.vercel.app/user/unitVolunteers`,
          {
            params: { unit: userUnit },
          }
        );
        setUserUnitVolunteers(response.data.unitVolunteers);
      } catch (error) {
        console.error("Error:", error);
      }
    };
    if (userUnit) {
      fetchUserUnitVolunteers();
    }
  }, [userUnit]);

  useEffect(() => {
    const fetchUserUnitGS = async () => {
      try {
        const response = await axios.get(`https://nss-orcin.vercel.app/user/unitGS`, {
          params: { unit: userUnit },
        });
        setUserUnitGS(response.data.unitGS);
      } catch (error) {
        console.error("Error:", error);
      }
    };
    if (userUnit) {
      fetchUserUnitGS();
    }
  }, [userUnit]);

  useEffect(() => {
    const fetchUserUnitJS = async () => {
      try {
        const response = await axios.get(`https://nss-orcin.vercel.app/user/unitJS`, {
          params: { unit: userUnit },
        });
        setUserUnitJS(response.data.unitJS);
      } catch (error) {
        console.error("Error:", error);
      }
    };
    if (userUnit) {
      fetchUserUnitJS();
    }
  }, [userUnit]);

  useEffect(() => {
    const fetchUserUnitManualsConducted = async () => {
      try {
        const response = await axios.get(
          `https://nss-orcin.vercel.app/user/unitManualsConducted`,
          {
            params: { unit: userUnit },
          }
        );
        setUserUnitManualsConducted(response.data.unitManualsConducted);
      } catch (error) {
        console.error("Error:", error);
      }
    };
    if (userUnit) {
      fetchUserUnitManualsConducted();
    }
  }, [userUnit]);

  const goToUserDetails = () => {
    navigate('/user/details', { state: { rollno } });
  };
  const goToUserManuals = () => {
    navigate('/user/manuals', { state: { userUnit } });
  };
  const goToUserUpdatephoneno = () => {
    navigate('/user/updatePhoneno', { state: { rollno } });
  };
  const goToUserAddPhoneno = () => {
    navigate('/user/addPhoneno', { state: { rollno } });
  };

  

  return (
    <>
      <Navlog />
      <div className="lgrbg">
        <div className="tl">
          <div className="tt3">Welcome</div>
          <div className="tt4">{userName}!</div>
        </div>
        <div className="wrapper-lgrs">
          <div className="label-input-pair">
            <label>Unit:</label>
            <input type="text" value={userUnit} readOnly />
          </div>
          <div className="label-input-pair">
            <label>Program Officer:</label>
            <input type="text" value={userProgramOfficer} readOnly />
          </div>
          <div className="label-input-pair">
            <label>Volunteers in Unit:</label>
            <input type="text" value={userUnitVolunteers} readOnly />
          </div>
          <div className="label-input-pair">
            <label>Manuals Conducted:</label>
            <input type="text" value={userUnitManualsConducted} readOnly />
          </div>
          <div className="label-input-pair">
            <label>GS:</label>
            <input type="text" value={userUnitGS} readOnly />
          </div>
          <div className="label-input-pair">
            <label>JS:</label>
            <input type="text" value={userUnitJS} readOnly />
          </div>

          <div className="Rememberlg1">
            <button onClick={goToUserDetails}>Personal Details</button>
          </div>
          
          <div className="Rememberlg2">
            <button onClick={goToUserManuals}>Unit Manuals</button>
          </div>
          <div className="Rememberlg2">
            <button onClick={goToUserUpdatephoneno}>Update PhoneNo</button>
          </div>
          <div className="Rememberlg2">
            <button onClick={goToUserAddPhoneno}>Add PhoneNo.</button>
          </div>

        </div>
      </div>
    </>
  );
}

export default Logres;
