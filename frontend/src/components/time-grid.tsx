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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

interface TimeGridProps {
  dates: Array<Date>;
  startTime: string;
  endTime: string;
  initialSelections?: Array<TimeSelection>;
  availables?: Record<string, Array<TimeSelection>>;
  onTimeUpdate?: (times: Array<TimeSelection>) => void;
  readonly?: boolean;
}

export interface TimeSelection {
  date: string;
  time: string;
}

/**
 * `getTimeSlots` generates time slots between the given start and end times.
 */
export function genTimeSlots(
  startTime: string,
  endTime: string
): Array<string> {
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
  initialSelections = [],
  availables,
  onTimeUpdate,
  readonly = false,
}: TimeGridProps) => {
  const [currSelections, setCurrSelections] =
    useState<TimeSelection[]>(initialSelections);
  const [selections, setSelections] = useState<TimeSelection[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<TimeSelection | null>(null);

  const timeSlots = useMemo(
    () => genTimeSlots(startTime, endTime),
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
        for (const slot of timeSlots) {
          const timeNum = parseInt(slot.replace(":", ""));
          if (timeNum >= minTime && timeNum <= maxTime) {
            newSelections.push({
              date: currentDate.toISOString(),
              time: slot,
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

  const getAvailableCount = useMemo(() => {
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

  const getAvailableParticipants = (date: Date, time: string) => {
    if (!availables) return [];

    const availableParticipants: string[] = [];
    Object.entries(availables).forEach(([userId, selections]) => {
      if (
        selections.some(
          (sel) => sel.date === date.toISOString() && sel.time === time
        )
      ) {
        availableParticipants.push(userId);
      }
    });

    return availableParticipants;
  };

  const maxParticipants = useMemo(() => {
    if (!availables) return 0;

    const participantCounts = new Map<string, number>();
    Object.values(availables).forEach((selections) => {
      selections.forEach((selection) => {
        const key = `${selection.date}_${selection.time}`;
        participantCounts.set(key, (participantCounts.get(key) || 0) + 1);
      });
    });

    return participantCounts.size > 0
      ? Math.max(...participantCounts.values())
      : 0;
  }, [availables]);

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
          {timeSlots.map((time, idx) => (
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
                  {readonly && getAvailableCount(date, time) > 0 && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div
                            key={`${date.toISOString()}-${time}`}
                            className="h-2.5 cursor-pointer bg-green-500"
                            style={{
                              backgroundColor: `rgb(34 197 94 / ${
                                getAvailableCount(date, time) / maxParticipants
                              })`,
                            }}
                          />
                        </TooltipTrigger>
                        <TooltipContent>
                          <div className="space-y-2">
                            <p className="text-sm font-medium">
                              {formatDate(date).date} {time}
                            </p>
                            <p className="text-xs text-gray-500">
                              {getAvailableCount(date, time)} of{" "}
                              {maxParticipants} participants (
                              {Math.round(
                                (getAvailableCount(date, time) /
                                  maxParticipants) *
                                  100
                              )}
                              %)
                            </p>
                            <div className="text-xs">
                              <p className="font-medium mb-1">
                                Available participants:
                              </p>
                              <ul className="list-disc pl-4 space-y-0.5">
                                {getAvailableParticipants(date, time).map(
                                  (name, idx) => (
                                    <li key={idx}>{name}</li>
                                  )
                                )}
                              </ul>
                            </div>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                  {readonly && getAvailableCount(date, time) === 0 && (
                    <div
                      key={`${date.toISOString()}-${time}`}
                      className="h-2.5"
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
