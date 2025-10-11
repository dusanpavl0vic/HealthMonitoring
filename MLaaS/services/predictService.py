from interfaces.athleteData import AthletePredictData
import tensorflow as tf
import pickle
import numpy as np
import os

MODEL_DIR = "TrainModel/models"

model = tf.keras.models.load_model(os.path.join(MODEL_DIR, "activity_model.keras"))

with open(os.path.join(MODEL_DIR, "scaler.pkl"), "rb") as f:
    scaler = pickle.load(f)

with open(os.path.join(MODEL_DIR, "label_encoder.pkl"), "rb") as f:
    label_encoder = pickle.load(f)


def predict_activity_service(data: AthletePredictData):
    try:
        data_dict = data.dict()
        systolic_bp, diastolic_bp = data_dict['bloodPressure'].split('/')
        
        features = np.array([[
            data_dict["heartRate"],
            data_dict["bodyTemperature"], 
            float(systolic_bp),
            float(diastolic_bp),
            data_dict["bloodOxygen"],
            data_dict["stepCount"]
        ]])

        features_scaled = scaler.transform(features)

        pred = model.predict(features_scaled)
        predicted_class = np.argmax(pred)
        activity = label_encoder.inverse_transform([predicted_class])[0]

        return {
            "predicted_activity": activity,
            "confidence": float(np.max(pred))
        }

    except Exception as e:
        return {"error": str(e)}
