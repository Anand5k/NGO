import React, { useState } from 'react';
import axios from 'axios';
import Navlog from './Navout';
import './SiteAdmin.css';
function SiteAdmin() {
    const [ngoName, setNgoName] = useState('');
    const [emailid, setEmailid] = useState('');
    const [password, setPassword] = useState('');
    const [restore, setRestore] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!ngoName || !emailid || !password || !restore) {
            setError("All fields are required");
            setMessage('');
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/siteAdmin', {
                name: ngoName,
                emailid,
                password,
                restore
            });

            if (response.data.message) {
                setMessage(response.data.message);
                setError('');
                setNgoName('');
                setEmailid('');
                setPassword('');
                setRestore('');
            }
        } catch (err) {
            setError("Error adding NGO");
            setMessage('');
        }
    };

    return (
        <>
            <Navlog />
            <div className="background-container">
                <div className="site-admin-container">
                    <h1>NGO Registration</h1>
                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            value={ngoName}
                            onChange={(e) => setNgoName(e.target.value)}
                            placeholder="NGO Name"
                        />

                        <input
                            type="email"
                            value={emailid}
                            onChange={(e) => setEmailid(e.target.value)}
                            placeholder="Email ID"
                        />

                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                        />

                        <input
                            type="text"
                            value={restore}
                            onChange={(e) => setRestore(e.target.value)}
                            placeholder="Restore Status"
                        />

                        <button type="submit">Register NGO</button>
                    </form>

                    {message && <p className="success">{message}</p>}
                    {error && <p className="error">{error}</p>}
                </div>
            </div>
        </>
    );
}

export default SiteAdmin;
