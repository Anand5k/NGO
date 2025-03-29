import "./UserDetails.css";
import Navlog from "./Navout";
import axios from 'axios';
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

function UserDetails() {
    const location = useLocation();
    const [rollno, setRollno] = useState('');

    useEffect(() => {
        const { rollno } = location.state || {};
        setRollno(rollno || '');  // Default to empty string if rollno is undefined
    }, [location.state]);

    const [userEmail, setUserEmail] = useState('');
    const [userDOB, setUserDOB] = useState('');
    const [userJoinDate, setUserJoinDate] = useState('');
    const [userRole, setUserRole] = useState('');
    const [userManualsAttended, setUserManualsAttended] = useState('');
    const [userName, setUserName] = useState('');
    

    useEffect(() => {
        const fetchUserEmail = async () => {
          try {
            const response = await axios.get(`https://nss-orcin.vercel.app/user/Email`, {
              params: { rollno: rollno },
            });
            setUserEmail(response.data.Email);
          } catch (error) {
            console.error("Error:", error);
          }
        };
        if (rollno) {
          fetchUserEmail();
        }
      }, [rollno]);

      useEffect(() => {
        const fetchUserDOB = async () => {
          try {
            const response = await axios.get(`https://nss-orcin.vercel.app/user/DOB`, {
              params: { rollno: rollno },
            });
            setUserDOB(response.data.DOB);
          } catch (error) {
            console.error("Error:", error);
          }
        };
        if (rollno) {
          fetchUserDOB();
        }
      }, [rollno]);

      useEffect(() => {
        const fetchUserJoinDate = async () => {
          try {
            const response = await axios.get(`https://nss-orcin.vercel.app/user/joinDate`, {
              params: { rollno: rollno },
            });
            setUserJoinDate(response.data.joinDate);
          } catch (error) {
            console.error("Error:", error);
          }
        };
        if (rollno) {
          fetchUserJoinDate();
        }
      }, [rollno]);

      useEffect(() => {
        const fetchUserRole = async () => {
          try {
            const response = await axios.get(`https://nss-orcin.vercel.app/user/role`, {
              params: { rollno: rollno },
            });
            setUserRole(response.data.role);
          } catch (error) {
            console.error("Error:", error);
          }
        };
        if (rollno) {
          fetchUserRole();
        }
      }, [rollno]);

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
        const fetchUserManualAttended = async () => {
          try {
            const response = await axios.get(`https://nss-orcin.vercel.app/user/manualsAttended`, {
              params: { rollno: rollno },
            });
            setUserManualsAttended(response.data.manualCount);
          } catch (error) {
            console.error("Error:", error);
          }
        };
        if (rollno) {
          fetchUserManualAttended();
        }
      }, [rollno]);

      const Dob1 = userDOB.slice(0, 10);
      const joinDate1 = userJoinDate.slice(0, 10);

    return (
        <>
          <Navlog />
          <div className="usrbg">
            <div className="tlu">
              <div className="tt3u">Welcome</div>
              <div className="tt4u">{userName}</div>
            </div>
            <div className="wrapper-usr">
              <div className="label-input-pair-u">
                <label>Roll Number:</label>
                <input type="text" value={rollno} readOnly />
              </div>
              <div className="label-input-pair-u">
                <label>Email:</label>
                <input type="text"  value={userEmail} readOnly />
              </div>
              <div className="label-input-pair-u">
                <label>Date of Birth:</label>
                <input type="text" value={Dob1} readOnly />
              </div>
              <div className="label-input-pair-u">
                <label>Joining Date:</label>
                <input type="text" value={joinDate1} readOnly />
              </div>
              <div className="label-input-pair-u">
                <label>Role:</label>
                <input type="text" value={userRole} readOnly />
              </div>
              <div className="label-input-pair-u">
                <label>Manuals Attended:</label>
                <input type="text" value={userManualsAttended} readOnly />
              </div>
            </div>
          </div>
        </>
    );
}

export default UserDetails;
