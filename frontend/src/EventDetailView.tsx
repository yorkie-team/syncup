import { useLocation, useParams } from "react-router-dom";
import { useYorkieDoc } from "@yorkie-js/react";
import { TimeGrid, TimeSelection } from "./components/time-grid";
import { useEffect, useState } from "react";
import { Button } from "./components/ui/button";

export function EventDetailView() {
  const { key } = useParams();
  const formData = useLocation().state;
  const initialData =
    (formData && {
      name: formData.name,
      selectedDates: formData.selectedDates,
      startTime: formData.startTime,
      endTime: formData.endTime,
      availables: {},
    }) ||
    undefined;

  const { root, update, loading, error } = useYorkieDoc<
    {
      name: string;
      selectedDates: number[];
      startTime: string;
      endTime: string;
      availables: Record<string, Array<TimeSelection>>;
    },
    {}
  >(import.meta.env.VITE_YORKIE_API_KEY, key!, initialData);

  const [isLoggedIn, setIsLoggedIn] = useState(false);

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
        const user = await res.json();
        if (user) {
          setIsLoggedIn(true);
        }
      } else {
        setIsLoggedIn(false);
      }
    };
    fetchMe();
  }, []);

  const handleTimeUpdate = (times: Array<TimeSelection>) => {
    update((root) => {
      root.availables["me"] = times;
    });
  };

  return (
    <div className="space-y-8 w-full max-w-4xl mx-auto p-4">
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
      {!root?.selectedDates && <p>Error: Event Not Found</p>}
      {!loading && !error && root?.selectedDates?.length && (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold">{root.name}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <h3 className="text-lg font-medium mb-2">My Availability</h3>
              {isLoggedIn ? (
                <div className="flex justify-center">
                  <TimeGrid
                    dates={root.selectedDates.map((date) => new Date(date))}
                    startTime={root.startTime}
                    endTime={root.endTime}
                    onTimeUpdate={handleTimeUpdate}
                  />
                </div>
              ) : (
                <div className="p-6 text-center">
                  <h3 className="text-lg font-medium mb-4">
                    Login to set your availability
                  </h3>
                  <Button
                    onClick={() => {
                      const returnTo =
                        window.location.pathname + window.location.search;
                      window.location.href = `${
                        import.meta.env.VITE_BACKEND_API_URL
                      }/auth/github?state=${encodeURIComponent(returnTo)}`;
                    }}
                  >
                    Login
                  </Button>
                </div>
              )}
            </div>

            <div className="flex flex-col">
              <h3 className="text-lg font-medium mb-2">Group Availability</h3>
              <div className="flex justify-center">
                <TimeGrid
                  dates={root.selectedDates.map((date) => new Date(date))}
                  startTime={root.startTime}
                  endTime={root.endTime}
                  availables={root.availables}
                  readonly={true}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
