import { ValidationResult } from "@/app/interfaces/healthData";

interface HealthAlertsProps {
  currentData: ValidationResult;
}

export default function HealthAlerts({ currentData }: HealthAlertsProps) {
  const alertsCount = currentData.messages?.length || 0;

  return (
    <div className="border-t pt-3">
      <div className="text-xs text-gray-600 mb-2">
        Health Alerts {alertsCount > 0 && `(${alertsCount})`}
      </div>

      {alertsCount > 0 ? (
        <div className="space-y-2 max-h-32 overflow-y-auto">
          {currentData.messages!.map((message, index) => (
            <div
              key={index}
              className={`text-xs p-2 rounded border ${
                message.type === "critical"
                  ? "bg-red-50 text-red-700 border-red-200"
                  : "bg-yellow-50 text-yellow-700 border-yellow-200"
              }`}
            >
              <div className="flex items-start">
                <span
                  className={`w-2 h-2 rounded-full mt-1 mr-2 ${
                    message.type === "critical" ? "bg-red-500" : "bg-yellow-500"
                  }`}
                />
                <div>
                  <div className="font-medium">
                    {message.type.toUpperCase()}: {message.message}
                  </div>
                  {message.value && (
                    <div className="text-gray-600 mt-1">
                      Value: {message.value}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-2 bg-green-50 rounded border border-green-200">
          <p className="text-green-700 text-xs">All vitals are normal</p>
        </div>
      )}
    </div>
  );
}
