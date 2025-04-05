import React, { useState } from "react";
import "./UserNewApplication.css";
import Navlog from './Navout';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';

function UserNewApplication() {
    const location = useLocation();
    const email = location.state?.email;
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewURL, setPreviewURL] = useState(null);
    const [result, setResult] = useState(null);
    const [userLocation, setUserLocation] = useState('');
    const [confirmation, setConfirmation] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setSelectedFile(file);
        if (file) {
            setPreviewURL(URL.createObjectURL(file));
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Please select an image first.'
            });
            return;
        }

        setLoading(true);

        const formData = new FormData();
        formData.append("file", selectedFile);

        try {
            const response = await fetch("http://127.0.0.1:8000/predict", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Failed to upload image");
            }

            const data = await response.json();
            if (data.error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Prediction Failed',
                    text: data.error
                });
            } else {
                setResult(data.class);
                setConfirmation(true);
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Upload Error',
                text: error.message
            });
        } finally {
            setLoading(false);
        }
    };

    const handleConfirm = async () => {
        if (!userLocation) {
            Swal.fire({
                icon: 'warning',
                title: 'Missing Location',
                text: 'Please enter a location.'
            });
            return;
        }

        const confirmResult = await Swal.fire({
            title: 'Are you sure?',
            html: `
                <p>Please confirm the details:</p>
                <p><strong>Type:</strong> ${result}</p>
                <p><strong>Location:</strong> ${userLocation}</p>
            `,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, submit it!'
        });

        if (confirmResult.isConfirmed) {
            try {
                const formData = new FormData();
                formData.append("email", email);
                formData.append("location", userLocation);
                formData.append("type", result);
                formData.append("image", selectedFile);

                await axios.post('http://localhost:5000/ngo/new-application', formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    }
                });

                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: 'Application submitted successfully with image.',
                    confirmButtonColor: '#3085d6'
                });

                setSelectedFile(null);
                setPreviewURL(null);
                setResult(null);
                setUserLocation('');
                setConfirmation(false);
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Submission Error',
                    text: error.message
                });
            }
        }
    };

    return (
        <>
        <Navlog />
        <div className="unabg">
            <div className="user-new-application">
                <h1>Deterioration Detection</h1>

                {!confirmation && (
                    <>
                        <input
                            type="file"
                            accept=".jpg, .jpeg, .png"
                            onChange={handleFileChange}
                        />
                        <button onClick={handleUpload} disabled={!selectedFile || loading}>
                            {loading ? "Uploading..." : "Upload"}
                        </button>
                    </>
                )}

                {previewURL && (
                    <div>
                        <h3>Uploaded Image Preview</h3>
                        <img src={previewURL} alt="Preview" />
                    </div>
                )}

                {confirmation && (
                    <div>
                        <h2>Confirm Predicted Type</h2>
                        <p>
                            <strong>Type:</strong> {result}
                        </p>
                        <input
                            type="text"
                            placeholder="Enter Location"
                            value={userLocation}
                            onChange={(e) => setUserLocation(e.target.value)}
                        />
                        <button onClick={handleConfirm}>Confirm and Insert</button>
                    </div>
                )}
            </div>
        </div>
        </>
    );
}

export default UserNewApplication;
