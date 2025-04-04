from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
import numpy as np
import cv2
from PIL import Image
import os
import io

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Load the trained model
MODEL_PATH = "image_classifier.keras"

# Check if the model exists before loading
if not os.path.exists(MODEL_PATH):
    raise FileNotFoundError(f"Model file not found: {MODEL_PATH}")

model = tf.keras.models.load_model(MODEL_PATH)

# Define class labels
class_labels = ["Algae", "Black_Crust", "Crack", "Erosion", "Graffiti"]

# Create upload directory if it doesn't exist
UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Updated preprocessing function
def preprocess_image(img_path):
    """Preprocess an image using OpenCV techniques."""
    try:
        img = cv2.imread(img_path)
        img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)  # Convert from BGR to RGB
        img = cv2.resize(img, (150, 150))  # Resize to match model input

        # 1️⃣ Gamma Correction
        gamma = 1.2  # Slightly lighten darker areas
        invGamma = 1.0 / gamma
        table = np.array([(i / 255.0) ** invGamma * 255 for i in range(256)]).astype("uint8")
        img_gamma = cv2.LUT(img, table)

        # 2️⃣ Bilateral Filtering
        img_filtered = cv2.bilateralFilter(img_gamma, d=9, sigmaColor=75, sigmaSpace=75)

        # 3️⃣ Increase Saturation
        hsv = cv2.cvtColor(img_filtered, cv2.COLOR_RGB2HSV)
        hsv[:, :, 1] = np.clip(hsv[:, :, 1] * 1.5, 0, 255)
        img_final = cv2.cvtColor(hsv, cv2.COLOR_HSV2RGB)

        # Normalization
        img_array = img_final.astype(np.float32) / 255.0
        img_array = np.expand_dims(img_array, axis=0)  # Add batch dimension

        return img_array, img, img_gamma, img_filtered, img_final

    except Exception as e:
        raise ValueError(f"Error preprocessing image: {e}")

@app.route("/predict", methods=["POST"])
def predict():
    try:
        # Check if a file is uploaded
        if "file" not in request.files:
            return jsonify({"error": "No file uploaded"}), 400

        file = request.files["file"]
        if not file.filename.lower().endswith(('.png', '.jpg', '.jpeg')):
            return jsonify({"error": "Unsupported file format"}), 400

        file_path = os.path.join(UPLOAD_FOLDER, file.filename)
        file.save(file_path)

        # Preprocess image and make prediction
        img_array, img, img_gamma, img_filtered, img_final = preprocess_image(file_path)
        predictions = model.predict(img_array)

        # Verify prediction output
        if predictions.shape[1] != len(class_labels):
            raise ValueError("Prediction output does not match the number of class labels")

        class_index = np.argmax(predictions, axis=1)[0]
        confidence = float(np.max(predictions))

        # Classification details
        classification_details = {
            class_labels[i]: float(predictions[0][i]) for i in range(len(class_labels))
        }

        # ✅ Clean up: Remove the uploaded file
        try:
            os.remove(file_path)
        except Exception as cleanup_error:
            print(f"Error during cleanup: {cleanup_error}")

        return jsonify({
            "class": class_labels[class_index],
            "confidence": confidence,
            "classification_details": classification_details
        })
    except Exception as e:
        print(f"Error during prediction: {e}")
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500

@app.route("/", methods=["GET"])
def home():
    return "Flask server is running and ready for predictions!"

if __name__ == "__main__":
    app.run(port=8000, debug=True)
