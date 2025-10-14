import PredictionCard from "./PredictionCard";

interface PredictionAthleteProps {
  athleteId: string;
  predictions: NatsMessage[];
}

export default function PredictionAthlete({
  athleteId,
  predictions,
}: PredictionAthleteProps) {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold mb-2 text-black">{athleteId}</h2>
      <div className="flex gap-4 overflow-x-auto pb-2">
        {predictions.map((prediction, index) => (
          <div key={`${athleteId}-${index}`} className="flex-shrink-0 w-80">
            <PredictionCard predictionData={prediction} />
          </div>
        ))}
      </div>
    </div>
  );
}
