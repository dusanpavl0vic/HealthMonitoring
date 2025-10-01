// app/components/dashboard/AthleteCard/MiniLocationMap.tsx
import { HealthRecord } from "@/app/interfaces/healthData";

interface MiniLocationMapProps {
  currentData: HealthRecord | null;
}

export default function MiniLocationMap({ currentData }: MiniLocationMapProps) {
  if (!currentData) {
    return (
      <div className="text-center py-4 bg-gray-50 rounded border">
        <p className="text-gray-500 text-xs">No location data</p>
      </div>
    );
  }

  // Mini OpenStreetMap
  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${
    currentData.longitude - 0.005
  },${currentData.latitude - 0.005},${currentData.longitude + 0.005},${
    currentData.latitude + 0.005
  }&marker=${currentData.latitude},${
    currentData.longitude
  }&layer=mapnik&zoom=15`;

  return (
    <div className="border-t pt-3">
      <div className="text-xs text-gray-600 mb-2 flex justify-between items-center">
        <span>Current Location</span>
        <span className="text-xs text-gray-400">
          {currentData.latitude.toFixed(4)}, {currentData.longitude.toFixed(4)}
        </span>
      </div>

      <div className="h-32 rounded-lg overflow-hidden border border-gray-200">
        <iframe
          width="100%"
          height="100%"
          frameBorder="0"
          scrolling="no"
          marginHeight={0}
          marginWidth={0}
          src={mapUrl}
          title={`Athlete ${currentData.athleteId} Location`}
          className="pointer-events-none"
        />
      </div>
    </div>
  );
}
