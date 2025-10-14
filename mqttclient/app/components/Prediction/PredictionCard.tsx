interface PredictionCardProps {
  predictionData: NatsMessage;
}

export default function PredictionCard({
  predictionData,
}: PredictionCardProps) {
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return "text-green-600";
    if (confidence >= 0.6) return "text-yellow-600";
    return "text-red-600";
  };

  const getActivityColor = (activity: string) => {
    const colors: { [key: string]: string } = {
      Walking: "bg-green-100 text-green-800 border-green-300",
      Cycling: "bg-purple-100 text-purple-800 border-purple-300",
      Running: "bg-blue-100 text-blue-800 border-blue-300",
      Resting: "bg-gray-100 text-gray-800 border-gray-300",
    };
    return (
      colors[activity?.toLowerCase()] ||
      "bg-gray-100 text-gray-800 border-gray-300"
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-t-xl p-4 text-white">
        <div className="flex justify-between items-start">
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${getActivityColor(
              predictionData.prediction?.predicted_activity
            )}`}
          >
            {predictionData.prediction?.predicted_activity}
          </span>
        </div>
      </div>

      <div className="p-4">
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-600">
              Confidence
            </span>
            <span
              className={`text-lg font-bold ${getConfidenceColor(
                predictionData.prediction?.confidence
              )}`}
            >
              {(predictionData.prediction?.confidence * 100).toFixed(1)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${
                predictionData.prediction?.confidence >= 0.8
                  ? "bg-green-500"
                  : predictionData.prediction?.confidence >= 0.6
                  ? "bg-yellow-500"
                  : "bg-red-500"
              }`}
              style={{
                width: `${predictionData.prediction?.confidence * 100}%`,
              }}
            ></div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="text-center p-3 bg-red-50 rounded-lg border border-red-100">
            <p className="text-2xl font-bold text-red-600">
              {predictionData.healthRecord?.heartRate}
            </p>
            <p className="text-xs text-red-500 font-medium">Heart Rate</p>
            <p className="text-xs text-gray-500">bpm</p>
          </div>

          <div className="text-center p-3 bg-orange-50 rounded-lg border border-orange-100">
            <p className="text-2xl font-bold text-orange-600">
              {predictionData.healthRecord?.bodyTemperature}°
            </p>
            <p className="text-xs text-orange-500 font-medium">Temperature</p>
            <p className="text-xs text-gray-500">celsius</p>
          </div>

          <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-100">
            <p className="text-2xl font-bold text-blue-600">
              {predictionData.healthRecord?.bloodOxygen}%
            </p>
            <p className="text-xs text-blue-500 font-medium">Blood Oxygen</p>
            <p className="text-xs text-gray-500">SpO2</p>
          </div>

          <div className="text-center p-3 bg-green-50 rounded-lg border border-green-100">
            <p className="text-2xl font-bold text-green-600">
              {predictionData.healthRecord?.stepCount}
            </p>
            <p className="text-xs text-green-500 font-medium">Steps</p>
            <p className="text-xs text-gray-500">count</p>
          </div>
        </div>

        <div className="bg-purple-50 rounded-lg p-3 border border-purple-100">
          <p className="text-sm font-medium text-purple-700 text-center">
            Blood Pressure
          </p>
          <p className="text-lg font-bold text-purple-800 text-center">
            {predictionData.healthRecord?.bloodPressure}
          </p>
        </div>

        {predictionData.prediction?.error && (
          <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-xs text-red-600 text-center">
              {predictionData.prediction?.error}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
