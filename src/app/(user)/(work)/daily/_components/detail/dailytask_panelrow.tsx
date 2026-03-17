import { cn } from "@/lib/utils";
import { PanelItem } from "./types";

interface DailyTaskPanelRowProps {
  item: PanelItem;
  isSelected: boolean;
  onClick: (item: PanelItem) => void;
}

const DailyTaskPanelRow = ({
  item,
  isSelected,
  onClick,
}: DailyTaskPanelRowProps) => {
  return (
    <div
      className={cn(
        "flex items-center gap-3 px-4 py-3 border-b border-border cursor-pointer transition-colors",
        isSelected
          ? "bg-primary-background border-l-2 border-l-primary"
          : "hover:bg-background",
      )}
      onClick={() => onClick(item)}
    >
      <div className="flex-1 min-w-0">
        <div
          className={cn(
            "text-xs font-semibold truncate",
            isSelected ? "text-primary" : "text-foreground",
          )}
        >
          {item.label}
        </div>
      </div>
      <div className="flex flex-col items-end gap-1">
        <span
          className={cn(
            "text-[10px] font-bold px-2 py-0.5 rounded-md border",
            item.isDone
              ? "bg-green-50 text-green-600 border-green-200"
              : "bg-orange-50 text-orange-500 border-orange-200",
          )}
        >
          {item.isDone ? "완료" : "미완료"}
        </span>
        <span className="text-[10px] text-description-light">
          {item.current}/{item.total}
        </span>
      </div>
    </div>
  );
};

export default DailyTaskPanelRow;
