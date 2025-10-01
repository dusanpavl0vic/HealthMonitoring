interface AthleteFooterProps {
  timestamp: string;
  dataAge: number;
}

const formatDateTime = (timestamp: string) => {
  const date = new Date(timestamp);
  return date.toLocaleString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

export default function AthleteFooter({
  timestamp,
  dataAge,
}: AthleteFooterProps) {
  return (
    <div className="text-xs text-gray-400 mt-3 flex justify-between">
      <span>Data time: {formatDateTime(timestamp)}</span>
      <span>{dataAge}s ago</span>
    </div>
  );
}
