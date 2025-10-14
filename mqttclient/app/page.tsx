"use client";

import { useState } from "react";
import DashboardLayout from "./components/DashboardLayout";
import PredictionLayout from "./components/PredictionLayout";
import { useWebSocket } from "./hooks/useWebSocket";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<"dashboard" | "predictions">(
    "dashboard"
  );
  const { athletesData, athletesPredictedActivity } = useWebSocket();

  return (
    <div className="p-4">
      <div className="flex space-x-4 mb-4">
        <button
          className={`px-4 py-2 rounded ${
            activeTab === "dashboard" ? "bg-blue-600 text-white" : "bg-gray-300"
          }`}
          onClick={() => setActiveTab("dashboard")}
        >
          Dashboard
        </button>
        <button
          className={`px-4 py-2 rounded ${
            activeTab === "predictions"
              ? "bg-blue-600 text-white"
              : "bg-gray-300"
          }`}
          onClick={() => setActiveTab("predictions")}
        >
          Predictions
        </button>
      </div>

      <div>
        {activeTab === "dashboard" && (
          <DashboardLayout athletesData={athletesData} />
        )}
        {activeTab === "predictions" && (
          <PredictionLayout
            athletesPredictedActivity={athletesPredictedActivity}
          />
        )}
      </div>
    </div>
  );
}
