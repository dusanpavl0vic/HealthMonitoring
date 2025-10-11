from fastapi import FastAPI
from interfaces.athleteData import AthletePredictData
from services.predictService import predict_activity_service

app = FastAPI()

@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.post("/predict_activity")
def predict_activity(data: AthletePredictData):
    result = predict_activity_service(data)
    return result


