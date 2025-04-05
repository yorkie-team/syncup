import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate, formatTo12Hour } from "@/lib/times";
import { useCallback, useEffect, useMemo, useState } from "react";

interface TimeGridProps {
  dates: Array<Date>;
  startTime: string;
  endTime: string;
  availables?: Record<string, Array<TimeSelection>>;
  onTimeUpdate?: (times: Array<TimeSelection>) => void;
  readonly?: boolean;
}

export interface TimeSelection {
  date: string;
  time: string;
}

function genTimes(startTime: string, endTime: string) {
  const start = parseInt(startTime.split(":")[0]);
  const end = parseInt(endTime.split(":")[0]);
  const slots = (end - start) * 4;

  return Array.from({ length: slots }, (_, i) => {
    const hour = Math.floor(i / 4) + start;
    const minute = (i % 4) * 15;
    return `${hour.toString().padStart(2, "0")}:${minute
      .toString()
      .padStart(2, "0")}`;
  });
}

export const TimeGrid = ({
  dates,
  startTime,
  endTime,
  availables,
  onTimeUpdate,
  readonly = false,
}: TimeGridProps) => {
  const [currSelections, setCurrSelections] = useState<TimeSelection[]>([]);
  const [selections, setSelections] = useState<TimeSelection[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<TimeSelection | null>(null);

  const times = useMemo(
    () => genTimes(startTime, endTime),
    [startTime, endTime]
  );

  const handleMouseDown = useCallback((date: Date, time: string) => {
    setIsDragging(true);
    const selection = { date: date.toISOString(), time };
    setDragStart(selection);
    setCurrSelections([selection]);
  }, []);

  const handleMouseEnter = (date: Date, time: string) => {
    if (isDragging && dragStart) {
      const startDate = new Date(
        Math.min(new Date(dragStart.date).getTime(), date.getTime())
      );
      const endDate = new Date(
        Math.max(new Date(dragStart.date).getTime(), date.getTime())
      );
      const startTimeNum = parseInt(dragStart.time.replace(":", ""));
      const currentTimeNum = parseInt(time.replace(":", ""));
      const minTime = Math.min(startTimeNum, currentTimeNum);
      const maxTime = Math.max(startTimeNum, currentTimeNum);

      const newSelections: TimeSelection[] = [];

      let currentDate = startDate;
      while (currentDate <= endDate) {
        for (const t of times) {
          const timeNum = parseInt(t.replace(":", ""));
          if (timeNum >= minTime && timeNum <= maxTime) {
            newSelections.push({
              date: currentDate.toISOString(),
              time: t,
            });
          }
        }
        currentDate = new Date(currentDate.setDate(currentDate.getDate() + 1));
      }

      setCurrSelections(newSelections);
    }
  };

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setDragStart(null);
    const updatedSelections = toggleSelections(selections, currSelections);
    setSelections(updatedSelections);
    setCurrSelections([]);
    onTimeUpdate?.(updatedSelections);
  }, [selections, currSelections, onTimeUpdate]);

  const toggleSelections = (
    prevSelections: TimeSelection[],
    currSelections: TimeSelection[]
  ): TimeSelection[] => {
    const overlappedSelection = new Set<string>();

    for (const selection of prevSelections) {
      const key = `${selection.date}-${selection.time}`;
      for (const currSelection of currSelections) {
        const currKey = `${currSelection.date}-${currSelection.time}`;
        if (key === currKey) {
          overlappedSelection.add(key);
        }
      }
    }

    return prevSelections
      .filter(
        (selection) =>
          !overlappedSelection.has(`${selection.date}-${selection.time}`)
      )
      .concat(
        currSelections.filter(
          (currSelection) =>
            !overlappedSelection.has(
              `${currSelection.date}-${currSelection.time}`
            )
        )
      );
  };

  const getSelectionCount = useMemo(() => {
    return (date: Date, time: string) => {
      if (!availables) return 0;

      return Object.values(availables).reduce((count, selections) => {
        return (
          count +
          (selections.some(
            (sel) => sel.date === date.toISOString() && sel.time === time
          )
            ? 1
            : 0)
        );
      }, 0);
    };
  }, [availables]);

  const getColorClass = useMemo(() => {
    return (count: number) => {
      if (count === 0) return "";
      return `bg-green-${Math.min(900, 500 + (count - 1) * 100)}`;
    };
  }, []);

  const isSelected = (date: Date, time: string) => {
    const isCurrSelected = currSelections.some(
      (sel) => sel.date === date.toISOString() && sel.time === time
    );
    const isPrevSelected = selections.some(
      (sel) => sel.date === date.toISOString() && sel.time === time
    );
    return (
      !(isCurrSelected && isPrevSelected) && (isCurrSelected || isPrevSelected)
    );
  };

  useEffect(() => {
    const handleGlobalMouseUp = () => {
      setIsDragging(false);
      setDragStart(null);
    };

    window.addEventListener("mouseup", handleGlobalMouseUp);
    return () => window.removeEventListener("mouseup", handleGlobalMouseUp);
  }, []);

  return (
    <div className="max-w-fit select-none">
      <Table className="w-auto">
        <TableHeader>
          <TableRow className="w-auto">
            <TableHead className="w-[60px] py-0.5 px-0.5"></TableHead>
            {dates.map((date: Date, idx: number) => (
              <TableHead
                key={idx}
                className="text-center w-[40px] py-0.5 px-0.5"
              >
                <div className="text-[10px]">{formatDate(date).date}</div>
                <div className="text-[14px]">{formatDate(date).dayOfWeek}</div>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {times.map((time, idx) => (
            <TableRow
              key={time}
              className={`w-auto ${idx % 4 === 0 ? "" : ""}`}
            >
              <TableCell className="font-mono py-0 px-0 text-[10px] min-w-0 relative">
                {idx % 4 === 0 && (
                  <span className="absolute top-0 -translate-y-1/2">
                    {formatTo12Hour(time)}
                  </span>
                )}
              </TableCell>
              {dates.map((date: Date) => (
                <TableCell
                  key={date.getTime()}
                  className={`text-center p-0 min-w-0 ${
                    idx % 4 === 0 ? "border-t border-gray-100/50" : ""
                  }`}
                >
                  {readonly && (
                    <div
                      key={`${date.toISOString()}-${time}`}
                      className={`h-2.5 cursor-pointer ${getColorClass(
                        getSelectionCount(date, time)
                      )}`}
                    />
                  )}
                  {!readonly && (
                    <div
                      key={`${date.toISOString()}-${time}`}
                      className={`h-2.5 cursor-pointer ${
                        isSelected(date, time) ? "bg-green-500" : ""
                      }`}
                      onMouseDown={() => handleMouseDown(date, time)}
                      onMouseEnter={() => handleMouseEnter(date, time)}
                      onMouseUp={handleMouseUp}
                    />
                  )}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
