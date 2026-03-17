import EmptyBox from "@/components/ui/custom/empty";
import { NormalizedLog, PanelItem } from "./types";
import DailyTaskSelectedCard from "./dailytask_selectedcard";
import DailyTaskHistoryTimeline from "./dailytask_timeline";

interface DailyTaskDetailPanelProps {
  selectedItem: PanelItem | null;
  logs: NormalizedLog[];
  onEdit?: (log: NormalizedLog, editData: Record<string, any>) => void;
  extraAction?: React.ReactNode; // CheckButton 등 추가 액션
  emptyMessage?: string;
  emptySubMessage?: string;
}

const DailyTaskDetailPanel = ({
  selectedItem,
  logs,
  onEdit,
  extraAction,
  emptyMessage = "항목을 선택해주세요",
  emptySubMessage,
}: DailyTaskDetailPanelProps) => {
  return (
    <div className="flex-1 flex flex-col bg-background overflow-y-auto px-6 gap-4">
      {!selectedItem ? (
        <div className="flex-1 flex items-center justify-center">
          <EmptyBox message={emptyMessage} subMessage={emptySubMessage} />
        </div>
      ) : (
        <>
          {/* 선택된 항목 카드 */}
          <DailyTaskSelectedCard item={selectedItem} />

          {/* 추가 액션 (ex. 업무완료 버튼) */}
          {extraAction}

          {/* 업무이력 타임라인 */}
          <DailyTaskHistoryTimeline logs={logs} onEdit={onEdit} />
        </>
      )}
    </div>
  );
};

export default DailyTaskDetailPanel;
