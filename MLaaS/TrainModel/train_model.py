import pandas as pd
import tensorflow as tf
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder, StandardScaler
import pickle
import os

CSV_PATH = "wearable_sports_health_dataset.csv"
MODEL_DIR = "models"

def train_activity_model():
    df = pd.read_csv(CSV_PATH)
    
    df[['Systolic_BP', 'Diastolic_BP']] = df['Blood_Pressure'].str.split('/', expand=True)
    df['Systolic_BP'] = df['Systolic_BP'].astype(float)
    df['Diastolic_BP'] = df['Diastolic_BP'].astype(float)

    X = df[['Heart_Rate', 'Body_Temperature', 'Systolic_BP', 'Diastolic_BP', 'Blood_Oxygen', 'Step_Count']]
    y = df['Activity_Status']

    label_encoder = LabelEncoder()
    y_encoded = label_encoder.fit_transform(y)

    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)

    X_train, X_test, y_train, y_test = train_test_split(X_scaled, y_encoded, test_size=0.2, random_state=42)

    model = tf.keras.Sequential([
        tf.keras.layers.Input(shape=(X_train.shape[1],)),
        tf.keras.layers.Dense(32, activation='relu'),
        tf.keras.layers.Dense(16, activation='relu'),
        tf.keras.layers.Dense(len(label_encoder.classes_), activation='softmax')
    ])

    model.compile(optimizer='adam',
                  loss='sparse_categorical_crossentropy',
                  metrics=['accuracy'])

    model.fit(X_train, y_train, epochs=50, batch_size=4, validation_split=0.2, verbose=0)

    os.makedirs(MODEL_DIR, exist_ok=True)

    model.save(os.path.join(MODEL_DIR, "activity_model.keras"))

    with open(os.path.join(MODEL_DIR, "scaler.pkl"), "wb") as f:
        pickle.dump(scaler, f)

    with open(os.path.join(MODEL_DIR, "label_encoder.pkl"), "wb") as f:
        pickle.dump(label_encoder, f)

    print("✅ Model uspešno sačuvan u folder:", MODEL_DIR)


train_activity_model()