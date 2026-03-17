import BaseSkeleton from "@/components/common/base-skeleton";
import { PanelItem } from "./types";
import EmptyBox from "@/components/ui/custom/empty";
import DailyTaskPanelRow from "./dailytask_panelrow";

interface DailyTaskMasterPanelProps {
  label: string; // "근무자" | "업무"
  items: PanelItem[];
  totalLabel?: string; // "11명" | "7개" 등
  selectedId: number | null;
  onSelect: (item: PanelItem) => void;
  isLoading?: boolean;
  emptyMessage?: string;
}

const DailyTaskMasterPanel = ({
  label,
  items,
  totalLabel,
  selectedId,
  onSelect,
  isLoading = false,
  emptyMessage = "목록 없음",
}: DailyTaskMasterPanelProps) => {
  return (
    <div className="w-[320px] flex-shrink-0 border border-border flex flex-col overflow-hidden rounded-DEFAULT shadow-sm">
      {/* 패널 헤더 */}
      <div className="px-4 py-2.5 bg-background border-b border-border flex items-center justify-between">
        <span className="text-xs font-bold text-description">{label}</span>
        {totalLabel && (
          <span className="text-xs text-description-light">{totalLabel}</span>
        )}
      </div>

      {/* 목록 */}
      <div className="flex-1 overflow-y-auto bg-surface">
        {isLoading ? (
          <div className="flex flex-col gap-2 p-3">
            {Array.from({ length: 4 }, (_, i) => (
              <BaseSkeleton className="h-14" key={i} />
            ))}
          </div>
        ) : items.length > 0 ? (
          items.map((item) => (
            <DailyTaskPanelRow
              key={item.id}
              item={item}
              isSelected={selectedId === item.id}
              onClick={onSelect}
            />
          ))
        ) : (
          <EmptyBox message={emptyMessage} />
        )}
      </div>
    </div>
  );
};
export default DailyTaskMasterPanel;
