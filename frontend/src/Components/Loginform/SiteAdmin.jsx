import React, { useState } from 'react';
import axios from 'axios';
import Navlog from './Navout';
import Swal from 'sweetalert2';
import './SiteAdmin.css';

function SiteAdmin() {
    const [ngoName, setNgoName] = useState('');
    const [emailid, setEmailid] = useState('');
    const [password, setPassword] = useState('');
    const [restore, setRestore] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!ngoName || !emailid || !password || !restore) {
            Swal.fire({
                title: 'Missing Fields!',
                text: 'All fields are required.',
                icon: 'warning',
                confirmButtonColor: '#d33',
                confirmButtonText: 'Close'
            });
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
                Swal.fire({
                    title: 'Success!',
                    text: response.data.message,
                    icon: 'success',
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'OK'
                });

                setNgoName('');
                setEmailid('');
                setPassword('');
                setRestore('');
            }
        } catch (err) {
            Swal.fire({
                title: 'Error!',
                text: 'Failed to add NGO.',
                icon: 'error',
                confirmButtonColor: '#d33',
                confirmButtonText: 'Close'
            });
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
                </div>
            </div>
        </>
    );
}

export default SiteAdmin;
