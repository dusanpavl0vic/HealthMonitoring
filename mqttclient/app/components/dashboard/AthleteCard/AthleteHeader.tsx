interface AthleteHeaderProps {
  athleteId: string;
  lastUpdate: Date;
  alertsCount: number;
  historyCount: number;
}

export default function AthleteHeader({
  athleteId,
  lastUpdate,
  alertsCount,
  historyCount,
}: AthleteHeaderProps) {
  return (
    <div className="flex justify-between items-start mb-4">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <span className="w-3 h-3 bg-green-500 rounded-full mr-2 animate-pulse"></span>
          Athlete {athleteId}
        </h3>
        <p className="text-sm text-gray-500">
          Last update:{" "}
          {lastUpdate.toLocaleTimeString("en-GB", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          })}
        </p>
      </div>
      <div className="text-right">
        <div
          className={`text-sm font-medium ${
            alertsCount > 0 ? "text-red-600" : "text-green-600"
          }`}
        >
          {alertsCount} alert{alertsCount !== 1 ? "s" : ""}
        </div>
        <div className="text-xs text-gray-500">{historyCount} records</div>
      </div>
    </div>
  );
}
