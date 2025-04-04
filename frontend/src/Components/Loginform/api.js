const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("image", file); // Match with upload.single("image")

    try {
        console.log("Uploading file...");
        const response = await fetch("http://127.0.0.1:5000/predict", {
            method: "POST",
            body: formData,
        });

        if (!response.ok) {
            throw new Error("Upload failed");
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error uploading image:", error);
        return { error: error.message };
    }
};

export default uploadImage;