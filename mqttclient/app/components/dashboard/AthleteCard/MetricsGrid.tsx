import { HealthRecord, ValidationResult } from "@/interfaces/healthData";

interface MetricsGridProps {
  currentData: ValidationResult;
  history: HealthRecord[];
}

const getActivityStatusText = (status: number) => {
  const statusMap: { [key: number]: string } = {
    0: "🚶 Walking",
    1: "🚴 Cycling",
    2: "🏃 Running",
    3: "💤 Resting",
    [-1]: "❓ Unknown",
  };
  return statusMap[status] || "❓ Unknown";
};

const getTotalSteps = (history: HealthRecord[]) => {
  return history.reduce((total, record) => total + record.stepCount, 0);
};

export default function MetricsGrid({
  currentData,
  history,
}: MetricsGridProps) {
  const totalSteps = getTotalSteps(history);

  return (
    <>
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="text-center p-2 bg-blue-50 rounded border">
          <div className="text-xs text-gray-600">Heart Rate</div>
          <div
            className={`text-lg font-bold ${
              currentData.record.heartRate > 100
                ? "text-red-600"
                : "text-green-600"
            }`}
          >
            {currentData.record.heartRate} bpm
          </div>
        </div>

        <div className="text-center p-2 bg-purple-50 rounded border">
          <div className="text-xs text-gray-600">Activity</div>
          <div className="text-sm font-bold text-purple-600">
            {getActivityStatusText(currentData.record.activityStatus)}
          </div>
        </div>

        <div className="text-center p-2 bg-green-50 rounded border">
          <div className="text-xs text-gray-600">Current Steps</div>
          <div className="text-lg font-bold text-green-600">
            {currentData.record.stepCount}
          </div>
        </div>

        <div className="text-center p-2 bg-orange-50 rounded border">
          <div className="text-xs text-gray-600">Total Steps</div>
          <div className="text-lg font-bold text-orange-600">{totalSteps}</div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-4 text-center">
        <div className="text-xs p-1 bg-gray-50 rounded">
          <div className="text-gray-600">Temp</div>
          <div
            className={`font-semibold ${
              currentData.record.bodyTemperature > 38
                ? "text-red-600"
                : "text-gray-700"
            }`}
          >
            {currentData.record.bodyTemperature}°C
          </div>
        </div>
        <div className="text-xs p-1 bg-gray-50 rounded">
          <div className="text-gray-600">O₂</div>
          <div
            className={`font-semibold ${
              currentData.record.bloodOxygen < 95
                ? "text-red-600"
                : "text-gray-700"
            }`}
          >
            {currentData.record.bloodOxygen}%
          </div>
        </div>
        <div className="text-xs p-1 bg-gray-50 rounded">
          <div className="text-gray-600">BP</div>
          <div className="font-semibold text-gray-700">
            {currentData.record.bloodPressure}
          </div>
        </div>
      </div>
    </>
  );
}
