"use client";

import { AthleteData } from "@/interfaces/athleteData";
import AthleteCard from "./AthleteCard/AthleteCard";

interface DashboardLayoutProps {
  athletesData: AthleteData[];
}

export default function DashboardLayout({
  athletesData,
}: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Athlete Health Monitoring - Live
          </h1>
          <div className="text-sm text-gray-500 bg-white px-3 py-1 rounded-lg shadow">
            Active athletes: {athletesData.length}
          </div>
        </div>

        {athletesData.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-500 text-lg">Waiting for athlete data...</p>
            <p className="text-gray-400 text-sm mt-2">
              Athlete cards will appear automatically when MQTT data is received
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto pb-4">
            <div className="flex gap-6 min-w-max">
              {athletesData.map((athlete) => (
                <div key={athlete.athleteId} className="w-80 flex-shrink-0">
                  <AthleteCard athleteData={athlete} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
