import "./AdAttendence.css";
import Navad from "./Navout";
import axios from 'axios';
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

function AdAttendence() {
  const location = useLocation();
  const [userUnit, setUserUnit] = useState('');
  const [attendence, setAttendence] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
      const { AdUnit } = location.state || {};
      setUserUnit(AdUnit || '');
  }, [location.state]);

  const fetchAttendence = async () => {
      try {
          const response = await axios.get('https://nss-orcin.vercel.app/Ad/attendence', {
              params: { unit: userUnit }
          });
          setAttendence(response.data.attendence);
          setError('');
      } catch (err) {
          setError(err.response?.data?.error || 'Error fetching attendence');
          setAttendence([]);
      }
  };

  useEffect(() => {
      if (userUnit) {
          fetchAttendence();
      }
  }, [userUnit]);

  return (
    <>
        <Navad/>
        <div className="adattbg">
            <h1>Attendence Table</h1>
            {error && <p className="error-message">{error}</p>}
            {attendence.length > 0 ? (
                <table className="adatt-table">
                    <thead>
                        <tr>
                            <th>Manual ID</th>
                            <th>Theme</th>
                            {/* <th className="description-col">Description</th> */}
                            {/* <th className="date-col">Date</th> */}
                            <th>no_of_present</th>
                            <th>no_of_absent</th>
                            <th className="abs-col">absentees_volunteer_id</th>
                        </tr>
                    </thead>
                    <tbody>
                        {attendence.map((att) => (
                            <tr key={att.manual_id}>
                                <td>{att.manual_id}</td>
                                <td>{att.theme}</td>
                                <td>{att.no_of_present}</td>
                                <td>{att.no_of_absent}</td>
                                <td>{att.absentees_volunteer_id}</td>
                                
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No Attendence found</p>
            )}
        </div>
    </>
);
}

export default AdAttendence;
