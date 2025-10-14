import { AthleteData } from "@/interfaces/athleteData";
import MiniLocationMap from "../LoacationMap/MiniLocationMap";
import AthleteFooter from "./AthleteFooter";
import AthleteHeader from "./AthleteHeader";
import HealthAlerts from "./HealthAlerts";
import MetricsGrid from "./MetricsGrid";
import StepsChart from "./StepsChart";

interface AthleteCardProps {
  athleteData: AthleteData;
}

export default function AthleteCard({ athleteData }: AthleteCardProps) {
  const { athleteId, currentData, history, lastUpdate } = athleteData;

  if (!currentData) {
    return (
      <div className="bg-white rounded-lg shadow p-6 border-l-4 border-gray-400">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Athlete {athleteId}
          </h3>
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
            No data
          </span>
        </div>
        <p className="text-gray-500 text-sm">Waiting for health data...</p>
      </div>
    );
  }

  const alertsCount = currentData.messages?.length || 0;
  const dataAge = Math.floor(
    (new Date().getTime() - new Date(currentData.record.timestamp).getTime()) /
      1000
  );

  return (
    <div
      className={`bg-white rounded-lg shadow p-6 border-l-4 ${
        alertsCount > 0 ? "border-red-500" : "border-green-500"
      } transition-all duration-300 hover:shadow-lg`}
    >
      <AthleteHeader
        athleteId={athleteId}
        lastUpdate={lastUpdate}
        alertsCount={alertsCount}
        historyCount={history.length}
      />

      <MetricsGrid currentData={currentData} history={history} />

      <StepsChart history={history} />

      <MiniLocationMap currentData={currentData.record} />

      <HealthAlerts currentData={currentData} />

      <AthleteFooter
        timestamp={currentData.record.timestamp}
        dataAge={dataAge}
      />
    </div>
  );
}
