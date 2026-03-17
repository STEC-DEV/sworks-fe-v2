import CustomCard from "@/components/common/card";
import { PanelItem } from "./types";
import { cn } from "@/lib/utils";

interface DailyTaskSelectedCardProps {
  item: PanelItem;
}

const DailyTaskSelectedCard = ({ item }: DailyTaskSelectedCardProps) => {
  return (
    <CustomCard className="flex-row items-center justify-between px-6">
      <div className="flex items-center gap-3">
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-bold text-foreground">
            {item.label}
          </span>
          <span className="text-xs text-description-light">
            {item.current}/{item.total} 완료
          </span>
        </div>
      </div>
      <span
        className={cn(
          "text-sm font-medium px-2 py-1 rounded-DEFAULT border",
          item.isDone
            ? "bg-green-50 text-green-600 border-green-200"
            : "bg-orange-50 text-orange-500 border-orange-200",
        )}
      >
        {item.isDone ? "완료" : "미완료"}
      </span>
    </CustomCard>
  );
};

export default DailyTaskSelectedCard;
