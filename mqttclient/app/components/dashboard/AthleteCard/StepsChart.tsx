import { HealthRecord } from "@/app/interfaces/healthData";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface StepsChartProps {
  history: HealthRecord[];
}

const formatTime = (timestamp: string) => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-3 border border-gray-300 rounded-lg shadow-lg">
        <p className="font-bold text-gray-800">{`Time: ${label}`}</p>
        <p className="text-green-600">{`Steps: ${data.steps}`}</p>
        <p className="text-blue-600">{`Total: ${data.cumulativeSteps}`}</p>
        {data.fullData && (
          <p className="text-gray-500 text-xs mt-1">
            HR: {data.fullData.heartRate}bpm | Temp:{" "}
            {data.fullData.bodyTemperature}°C
          </p>
        )}
      </div>
    );
  }
  return null;
};

export default function StepsChart({ history }: StepsChartProps) {
  const chartData = history.map((record, index) => {
    const cumulativeSteps = history
      .slice(0, index + 1)
      .reduce((sum, r) => sum + r.stepCount, 0);

    return {
      timestamp: record.timestamp,
      time: formatTime(record.timestamp),
      steps: record.stepCount,
      cumulativeSteps,
      fullData: record,
    };
  });

  return (
    <div className="mb-4">
      <div className="text-xs text-gray-600 mb-2 flex justify-between">
        <span>Steps Progress</span>
        <span>{chartData.length} data points</span>
      </div>
      {chartData.length > 0 ? (
        <div className="h-20">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="time"
                tick={{ fontSize: 10 }}
                interval="preserveStartEnd"
              />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="cumulativeSteps"
                stroke="#82ca9d"
                strokeWidth={2}
                dot={{ r: 2 }}
                activeDot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="h-20 flex items-center justify-center bg-gray-50 rounded">
          <p className="text-gray-400 text-sm">No chart data yet</p>
        </div>
      )}
    </div>
  );
}
