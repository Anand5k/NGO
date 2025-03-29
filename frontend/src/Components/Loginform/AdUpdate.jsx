import './AdUpdate.css';
import Navad from "./Navout";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Swal from 'sweetalert2';

function AdUpdate() {
  const location = useLocation();
  const [unit, setUnit] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const { AdUnit } = location.state || {};
    setUnit(AdUnit || '');
  }, [location.state]);

  const [name, setName] = useState('');
  const [designation, setDesignation] = useState('');
  const [department, setDepartment] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const fetchPODetails = async () => {
      try {
        const response = await axios.get(`https://nss-orcin.vercel.app/poUpdate`, {
          params: { unit: unit },
        });
        const data = response.data.detail[0] || {}; // Ensure data is an object and access the first element in detail
        setName(data.name || '');
        setDepartment(data.department || '');
        setDesignation(data.designation || '');
        setEmail(data.email || '');
      } catch (error) {
        console.error("Error:", error);
      }
    };
    if (unit) {
      fetchPODetails();
    }
  }, [unit]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://nss-orcin.vercel.app/Ad/update', { unit, name, designation, department, email, password });
      console.log('Program Officer Updated successfully');
      Swal.fire({
        icon: "success",
        title: "Program Officer Updated Successfully",
      });
      navigate('/Siteinfo');
    } catch (error) {
      console.error('Error Updating Program Officer:', error.response?.data?.error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Invalid credentials. Please try again.",
      });
      navigate('/Siteinfo');
    }
  };

  return (
    <>
      <Navad />
      <div className="aubg">
        <div className="wrapper-au">
          <form onSubmit={handleUpdate}>
            <h1>Update Program Officer</h1>
            <div className="input-box-au">
              <input 
                type="text" 
                placeholder="Name" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                required 
              />
            </div>
              <div className="input-box-au">
                <input 
                  type="text" 
                  className="half" 
                  placeholder="Designation" 
                  value={designation} 
                  onChange={(e) => setDesignation(e.target.value)} 
                />
              </div>
          
            <div className="input-box-au">
              <input 
                type="text" 
                placeholder="Department" 
                value={department} 
                onChange={(e) => setDepartment(e.target.value)} 
              />
            </div>
            <div className="input-box-au">
              <input 
                type="email" 
                placeholder="Email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
              />
            </div>
            <div className="input-box-au">
              <input 
                type='Password'
                placeholder="Password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required
              />
            </div>
            <button type="submit">Update</button>
          </form>
        </div>
      </div>
    </>
  );
}

export default AdUpdate;
