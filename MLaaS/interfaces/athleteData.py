from pydantic import BaseModel

class AthletePredictData(BaseModel):
    heartRate: float
    bodyTemperature: float
    bloodPressure: str
    bloodOxygen: float
    stepCount: float