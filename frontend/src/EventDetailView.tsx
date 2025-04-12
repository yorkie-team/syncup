import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { useYorkieDoc } from "@yorkie-js/react";
import { SiGithub } from "@icons-pack/react-simple-icons";
import { Loader2 } from "lucide-react";
import { TimeGrid, TimeSelection } from "./components/time-grid";
import { Button } from "./components/ui/button";
import { LegendItems } from "./components/legend-items";

type User = {
  authProvider: string;
  username: string;
  email: string;
};

export type Event = {
  name: string;
  selectedDates: number[];
  startTime: string;
  endTime: string;
  availables: Record<string, Array<TimeSelection>>;
};

export function EventDetailView({
  onEventLoad,
}: {
  onEventLoad?: (event: Event) => void;
}) {
  const { key } = useParams();
  const formData = useLocation().state;
  const initialRoot =
    (formData && {
      name: formData.name,
      selectedDates: formData.selectedDates,
      startTime: formData.startTime,
      endTime: formData.endTime,
      availables: {},
    }) ||
    undefined;

  const { root, update, loading, error } = useYorkieDoc<Event, User>(
    import.meta.env.VITE_YORKIE_API_KEY,
    key!,
    { initialRoot }
  );

  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchMe = async () => {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_API_URL}/auth/me`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      if (res.ok) {
        const user = (await res.json()) as User;
        if (user) {
          setUser(user);
        }
      } else {
        setUser(null);
      }
    };
    fetchMe();
  }, []);

  useEffect(() => {
    if (root && !loading && !error) {
      onEventLoad?.(root);
    }
  }, [root, loading, error, onEventLoad]);

  const handleTimeUpdate = useCallback(
    (times: Array<TimeSelection>) => {
      if (!user) {
        return;
      }

      update((root) => {
        root.availables[user.username] = times;
      });
    },
    [user, update]
  );

  const maxParticipants = useMemo(() => {
    if (!root?.availables) return 0;

    const participantCounts = new Map<string, number>();
    Object.values(root.availables).forEach((selections) => {
      selections.forEach((selection) => {
        const key = `${selection.date}_${selection.time}`;
        participantCounts.set(key, (participantCounts.get(key) || 0) + 1);
      });
    });

    return participantCounts.size > 0
      ? Math.max(...participantCounts.values())
      : 0;
  }, [root?.availables]);

  const legendItems = useMemo(() => {
    if (maxParticipants === 0) return { items: [], count: 0 };

    return {
      items: Array.from({ length: maxParticipants + 1 }, (_, i) => ({
        opacity: i / maxParticipants,
        count: i,
      })),
      count: maxParticipants,
    };
  }, [maxParticipants]);

  return (
    <div className="space-y-8 w-full max-w-4xl mx-auto p-4">
      {loading && (
        <div className="flex flex-col items-center justify-center min-h-[300px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="mt-4 text-sm text-muted-foreground">Loading Event...</p>
        </div>
      )}
      {error && (
        <div className="p-4 border border-destructive/50 rounded-md bg-destructive/10 text-destructive">
          <p className="text-center">Error: {error.message}</p>
        </div>
      )}
      {!loading && !error && !root?.selectedDates && (
        <div className="p-4 border border-amber-200 rounded-md bg-amber-50 text-amber-800">
          <p className="text-center">Error: Event Not Found</p>
        </div>
      )}
      {!loading && !error && root?.selectedDates?.length && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col">
              {user ? (
                <>
                  <h3 className="text-lg font-medium mb-2 text-center">
                    {user.username}'s Availability
                  </h3>
                  <p className="text-sm text-gray-500 text-center mt-2 mb-1">
                    Click and Drag to toggle your available time slots
                  </p>
                  <div className="flex justify-center mt-3">
                    <TimeGrid
                      dates={root.selectedDates.map((date) => new Date(date))}
                      startTime={root.startTime}
                      endTime={root.endTime}
                      initialSelections={root.availables[user.username]}
                      onTimeUpdate={handleTimeUpdate}
                    />
                  </div>
                  <div className="flex gap-4 items-center justify-center">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-transparent border border-gray-300"></div>
                      <span className="text-sm">Unavailable</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-green-500 border border-green-500"></div>
                      <span className="text-sm">Available</span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="p-6 text-center">
                  <h3 className="text-lg font-medium mb-4 ">
                    Login to set your availability
                  </h3>
                  <div className="flex flex-col gap-3 items-center">
                    <Button
                      onClick={() => {
                        const returnTo =
                          window.location.pathname + window.location.search;
                        window.location.href = `${
                          import.meta.env.VITE_BACKEND_API_URL
                        }/auth/github?returnTo=${encodeURIComponent(returnTo)}`;
                      }}
                      className="w-full max-w-xs flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 text-white"
                    >
                      <SiGithub className="h-5 w-5" />
                      <span>Login with GitHub</span>
                    </Button>
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-col">
              <h3 className="text-lg font-medium mb-2 text-center">
                Group's Availability
              </h3>
              <p className="text-sm text-gray-500 text-center mt-2 mb-1">
                Mouseover to see who is available
              </p>
              <div className="flex justify-center mt-3">
                <TimeGrid
                  dates={root.selectedDates.map((date) => new Date(date))}
                  startTime={root.startTime}
                  endTime={root.endTime}
                  availables={root.availables}
                  readonly={true}
                />
              </div>
              <div className="flex gap-4 items-center justify-center">
                <LegendItems
                  count={legendItems.count}
                  items={legendItems.items}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
