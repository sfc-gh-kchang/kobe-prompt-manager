import React, { useState, useEffect } from "react";
import { Block } from "../types";
import { Clock } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";

interface TimestampBlockProps {
  block: Block;
  isEditing: boolean;
  onUpdate: (updatedBlock: Block) => void;
}

const TimestampBlock: React.FC<TimestampBlockProps> = ({
  block,
  isEditing,
  onUpdate,
}) => {
  const { theme } = useTheme();
  const [minutesBack, setMinutesBack] = useState(
    block.timestampData?.minutesBack || 5
  );
  const [baseTimestamp, setBaseTimestamp] = useState(
    block.timestampData?.baseTimestamp || "2024-12-10T11:05"
  );

  function formatTimestamp(dateString: string): string {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day} ${hours}:${minutes}:00`;
  }

  useEffect(() => {
    updateBlock();
  }, [minutesBack, baseTimestamp]);

  const updateBlock = () => {
    const baseDate = new Date(baseTimestamp);
    const earlierDate = new Date(baseDate.getTime() - minutesBack * 60000);

    // Format timestamps in the desired format
    const formattedBase = formatTimestamp(baseDate.toISOString());
    const formattedEarlier = formatTimestamp(earlierDate.toISOString());

    const content = `From ${formattedEarlier} to ${formattedBase}`;

    onUpdate({
      ...block,
      content,
      timestampData: {
        baseTimestamp,
        minutesBack,
      },
    });
  };

  if (!isEditing) {
    return (
      <div
        className={`w-full p-2 rounded-md ${
          theme === "dark" ? "bg-black text-white" : "bg-gray-100 text-black"
        } border border-gray-700 whitespace-pre-wrap`}
      >
        {block.content}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex space-x-4 items-end">
        <div className="flex-1">
          <label className="block text-sm mb-1">Base Timestamp</label>
          <input
            type="datetime-local"
            value={baseTimestamp}
            onChange={(e) => setBaseTimestamp(e.target.value)}
            className={`w-full p-2 rounded-md ${
              theme === "dark"
                ? "bg-black text-white"
                : "bg-gray-100 text-black"
            } border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
        </div>
        <div className="flex-1">
          <label className="block text-sm mb-1">Minutes Back</label>
          <div className="flex space-x-2">
            <input
              type="range"
              min="1"
              max="60"
              value={minutesBack}
              onChange={(e) => setMinutesBack(Number(e.target.value))}
              className="flex-1"
            />
            <input
              type="number"
              min="1"
              max="60"
              value={minutesBack}
              onChange={(e) => setMinutesBack(Number(e.target.value))}
              className={`w-20 p-2 rounded-md ${
                theme === "dark"
                  ? "bg-black text-white"
                  : "bg-gray-100 text-black"
              } border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
          </div>
        </div>
      </div>
      <div
        className={`w-full p-2 rounded-md ${
          theme === "dark" ? "bg-zinc-900 text-white" : "bg-gray-200 text-black"
        } border border-gray-700`}
      >
        Preview: {block.content}
      </div>
    </div>
  );
};

export default TimestampBlock;
