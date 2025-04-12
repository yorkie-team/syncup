import { Link, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { CalendarIcon, ClockIcon } from "lucide-react";
import { Event } from "@/types/types";
import { Button } from "@/components/ui/button";

export function Navbar({ eventData }: { eventData?: Event }) {
  const location = useLocation();
  const isDetailView = location.pathname !== "/";

  const handleShare = async () => {
    const currentUrl = window.location.href;

    try {
      await navigator.clipboard.writeText(currentUrl);
      toast.success("Link copied to clipboard!", {
        className:
          "bg-green-50 dark:bg-green-900 border-green-200 dark:border-green-800",
        position: "top-center",
        duration: 3000,
        icon: "🔗",
      });
    } catch (e) {}
  };
  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4 max-w-4xl mx-auto relative">
        <div className="absolute left-4">
          <Link to="/" className="flex items-center">
            <span className="text-xl font-bold">SyncUp</span>
          </Link>
        </div>

        {isDetailView && eventData && (
          <div className="flex-1 flex flex-col items-center justify-center mx-auto">
            <span className="font-medium truncate max-w-md text-center">
              {eventData.name}
            </span>
            <div className="flex items-center text-xs text-muted-foreground mt-1">
              <span className="flex items-center">
                <CalendarIcon className="mr-1 h-3 w-3" />
                {`${eventData.selectedDates?.length || 0} ${
                  eventData.selectedDates?.length === 1 ? "day" : "days"
                }`}
              </span>
              <span className="mx-2">•</span>
              <span className="flex items-center">
                <ClockIcon className="mr-1 h-3 w-3" />
                {`${eventData.startTime || "--"} - ${
                  eventData.endTime || "--"
                }`}
              </span>
            </div>
          </div>
        )}

        <div className="absolute right-4">
          {isDetailView && (
            <Button
              onClick={handleShare}
              className="flex items-center text-gray-600 bg-gray-100 hover:bg-gray-200 cursor-pointer"
            >
              Share
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
