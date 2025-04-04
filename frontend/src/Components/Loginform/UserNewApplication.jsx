import React, { useState } from "react";
import "./UserNewApplication.css";
import Navlog from './Navout';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

function UserNewApplication() {
    const location = useLocation();
    const email = location.state?.email;
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewURL, setPreviewURL] = useState(null);
    const [result, setResult] = useState(null);
    const [userLocation, setUserLocation] = useState('');
    const [confirmation, setConfirmation] = useState(false);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    // Handle file selection
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setSelectedFile(file);
        if (file) {
            setPreviewURL(URL.createObjectURL(file));
        }
    };

    // Handle file upload and prediction
    const handleUpload = async () => {
        if (!selectedFile) {
            setError("Please select an image first.");
            return;
        }

        setLoading(true);
        setError(null);

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
                setError(data.error);
            } else {
                setResult(data.class); // Store only the predicted type
                setConfirmation(true); // Enable confirmation step
            }
        } catch (error) {
            setError("Error: " + error.message);
        } finally {
            setLoading(false);
        }
    };


    // Handle confirmation and send image to database
    const handleConfirm = async () => {
        if (!userLocation) {
            setError("Please enter a location.");
            return;
        }
    
        try {
            const formData = new FormData();
            formData.append("email", email);
            formData.append("location", userLocation);
            formData.append("type", result);
            formData.append("image", selectedFile); // Key should match multer's 'image'
    
            const response = await axios.post('http://localhost:5000/ngo/new-application', formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                }
            });
    
            alert("Application submitted successfully with image");
            setSelectedFile(null);
            setPreviewURL(null);
            setResult(null);
            setUserLocation('');
            setConfirmation(false);
        } catch (error) {
            setError("Error: " + error.message);
        }
    };
    
    return (
        <>
        <Navlog/>
        <div className="unabg">
        <div className="user-new-application">
            <h1>Stone Monument Deterioration Detection</h1>
            <input
                type="file"
                accept=".jpg, .jpeg, .png"
                onChange={handleFileChange}
            />
            <button onClick={handleUpload} disabled={!selectedFile || loading}>
                {loading ? "Uploading..." : "Upload"}
            </button>

            {error && <p style={{ color: "red" }}>{error}</p>}

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
