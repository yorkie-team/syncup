import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type LegendItemsProps = {
  count: number;
  items: Array<{ opacity: number; count: number }>;
};

export function LegendItems({ count, items }: LegendItemsProps) {
  return (
    <div className="flex items-center gap-2">
      {count ? (
        <>
          <span className="text-sm">0</span>
          <div className="flex gap-1">
            {items.map((item, idx) => (
              <TooltipProvider key={idx}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div
                      key={idx}
                      className="w-4 h-4 border border-green-500 bg-green-500 cursor-pointer"
                      style={{
                        backgroundColor: `rgb(34 197 94 / ${item.opacity})`,
                      }}
                    />
                  </TooltipTrigger>
                  <TooltipContent>{item.count} participant</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </div>
          <span className="text-sm">{count}</span>
        </>
      ) : (
        <span className="text-sm">No participants yet</span>
      )}
    </div>
  );
}
