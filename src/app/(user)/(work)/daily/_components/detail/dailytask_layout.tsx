import BaseSkeleton from "@/components/common/base-skeleton";
import { NormalizedLog, PanelItem, StatItem } from "./types";
import AppTitle from "@/components/common/label/title";
import DailyTaskStatBar from "./dailytask_statbar";
import DailyTaskMasterPanel from "./dailytask_masterpanel";
import { ReactNode } from "react";
import DailyTaskDetailPanel from "./dailytask_deatilpanel";

interface DailyTaskLayoutProps {
  // 헤더
  title: string;
  isLoading?: boolean;

  // stat
  statItems: StatItem[];

  //   // 좌측 패널
  panelLabel: string; // "근무자" | "업무"
  panelTotalLabel?: string; // "11명" | "7개"
  panelItems: PanelItem[];
  panelEmptyMessage?: string;
  selectedId: number | null;
  onSelect: (item: PanelItem) => void;

  // 우측 패널
  selectedItem: PanelItem | null;
  logs: NormalizedLog[];
  onEdit?: (log: NormalizedLog, editData: Record<string, any>) => void;
  extraAction?: ReactNode;
  detailEmptyMessage?: string;
  detailEmptySubMessage?: string;
}

const DailyTaskLayout = ({
  title,
  isLoading = false,
  statItems,
  panelLabel,
  panelTotalLabel,
  panelItems,
  panelEmptyMessage,
  selectedId,
  onSelect,
  selectedItem,
  logs,
  onEdit,
  extraAction,
  detailEmptyMessage,
  detailEmptySubMessage,
}: DailyTaskLayoutProps) => {
  return (
    <div className="flex flex-col gap-6 flex-1 min-h-0">
      {/* 헤더 + stat */}
      {isLoading ? (
        <div className="flex flex-col gap-6">
          <BaseSkeleton className="h-7" />
          <div className="grid grid-cols-3 gap-3">
            {Array.from({ length: 3 }, (_, i) => (
              <BaseSkeleton className="h-16" key={i} />
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          <AppTitle title={title} isPrev />
          <DailyTaskStatBar items={statItems} />
        </div>
      )}

      {/* 마스터-디테일 패널 */}
      <div className="flex flex-1 min-h-0 rounded-DEFAULT overflow-hidden">
        <DailyTaskMasterPanel
          label={panelLabel}
          items={panelItems}
          totalLabel={panelTotalLabel}
          selectedId={selectedId}
          onSelect={onSelect}
          isLoading={isLoading}
          emptyMessage={panelEmptyMessage}
        />
        <DailyTaskDetailPanel
          selectedItem={selectedItem}
          logs={logs}
          onEdit={onEdit}
          extraAction={extraAction}
          emptyMessage={detailEmptyMessage}
          emptySubMessage={detailEmptySubMessage}
        />
      </div>
    </div>
  );
};

export default DailyTaskLayout;
