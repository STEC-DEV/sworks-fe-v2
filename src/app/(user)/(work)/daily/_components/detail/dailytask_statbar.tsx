import CustomCard from "@/components/common/card";
import { StatItem } from "./types";
import { cn } from "@/lib/utils";

export { cn } from "@/lib/utils";

const colorMap = {
  primary: "text-primary",
  green: "text-green-600",
  orange: "text-orange-500",
};

interface DailyTaskStatBarProps {
  items: StatItem[];
}

const DailyTaskStatBar = ({ items }: DailyTaskStatBarProps) => {
  return (
    <div className="grid grid-cols-3 gap-5">
      {items.map((item, i) => (
        <CustomCard key={i} className="p-4 gap-1 justify-center">
          <span className="text-xs text-description">{item.label}</span>
          <div
            className={cn(
              "text-2xl font-bold",
              colorMap[item.color ?? "primary"],
            )}
          >
            {item.value}
            <span className="text-xs text-description font-normal ml-1">
              {item.unit}
            </span>
          </div>
          {item.showBar && (
            <div className="h-1 rounded-full bg-border mt-1">
              <div
                className="h-full rounded-full bg-primary transition-all duration-500"
                style={{ width: `${item.value}%` }}
              />
            </div>
          )}
        </CustomCard>
      ))}
    </div>
  );
};

export default DailyTaskStatBar;
