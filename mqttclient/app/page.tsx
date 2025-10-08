"use client";

import DashboardLayout from "./components/dashboard/DashboardLayout";
import { useWebSocket } from "./hooks/useWebSocket";

export default function HomePage() {
  const { athletesData } = useWebSocket();

  console.log(
    "HomePage - Live athletes:",
    athletesData.map((a) => a.athleteId)
  );

  return <DashboardLayout athletesData={athletesData} />;
}
