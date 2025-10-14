"use client";

import PredictionAthlete from "./Prediction/PredictionAthlete";

interface PredictionLayoutProps {
  athletesPredictedActivity: Map<string, NatsMessage[]>;
}

export default function PredictionLayout({
  athletesPredictedActivity,
}: PredictionLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Athlete Health Monitoring - Prediction
          </h1>
          <div className="text-sm text-gray-500 bg-white px-3 py-1 rounded-lg shadow">
            Active athletes: {athletesPredictedActivity.size}
          </div>
        </div>

        {athletesPredictedActivity.size == 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-500 text-lg">
              Waiting for athlete prediction data...
            </p>
            <p className="text-gray-400 text-sm mt-2">
              Prediction cards will appear automatically when NATS data is
              received
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {Array.from(athletesPredictedActivity.entries()).map(
              ([athleteId, predictions]) => (
                <PredictionAthlete
                  key={athleteId}
                  athleteId={athleteId}
                  predictions={predictions}
                />
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}
