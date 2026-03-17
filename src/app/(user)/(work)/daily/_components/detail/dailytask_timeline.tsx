import CustomCard from "@/components/common/card";
import EmptyBox from "@/components/ui/custom/empty";
import { NormalizedLog } from "./types";
import DialogCarousel from "@/components/ui/custom/image/size-carousel";
import IconButton from "@/components/common/icon-button";
import { format } from "date-fns/format";
import BaseDialog from "@/components/ui/custom/base-dialog";
import { useState } from "react";
import LogEdit from "@/components/form/normal/task/log-edit";
import { Log } from "@/types/normal/task/detail-daily";

interface DailyTaskHistoryTimelineProps {
  logs: NormalizedLog[];
  onEdit?: (log: NormalizedLog, editData: Record<string, any>) => void;
}

const DailyTaskHistoryTimeline = ({
  logs,
  onEdit,
}: DailyTaskHistoryTimelineProps) => {
  if (logs.length === 0) {
    return <EmptyBox message="업무이력 없음" />;
  }

  return (
    <CustomCard className="gap-0 py-0 divide-y divide-border">
      {/* 카드 헤더 */}
      <div className="px-4 py-3 bg-background">
        <span className="text-xs font-bold text-description">업무이력</span>
      </div>

      {/* 타임라인 */}
      <div className="px-4 py-4">
        <div className="relative ml-3 flex flex-col gap-0">
          {logs.map((log, i) => (
            <DailyTaskHistoryTimelineItem
              key={i}
              log={log}
              index={i}
              total={logs.length}
              onEdit={onEdit}
            />
          ))}
        </div>
      </div>
    </CustomCard>
  );
};

export default DailyTaskHistoryTimeline;

interface DailyTaskHistoryTimelineItemProps {
  log: NormalizedLog;
  index: number;
  total: number;
  onEdit?: (log: NormalizedLog, editData: Record<string, any>) => void;
}

const DailyTaskHistoryTimelineItem = ({
  log,
  index,
  total,
  onEdit,
}: DailyTaskHistoryTimelineItemProps) => {
  const [open, setOpen] = useState(false);

  const handleSubmit = (editData: Record<string, any>) => {
    console.log(editData);
    onEdit?.(log, editData);
    setOpen(false);
  };

  const originalLog: Log = {
    logSeq: log.logSeq,
    issue: log.issue ?? undefined,
    workDt: log.date,
    attach: log.attachPaths.map((path, i) => ({
      attachSeq: i,
      images: path,
    })),
  };

  return (
    <div className="relative pl-6 pb-6 last:pb-0">
      {/* 세로선 */}
      {index < total - 1 && (
        <div className="absolute left-[5px] top-4 bottom-0 w-0.5 bg-border" />
      )}
      {/* 점 */}
      <div className="absolute left-0 top-1.5 w-3 h-3 rounded-full bg-primary border-2 border-white shadow-sm" />

      {/* 로그 내용 */}
      <div className="mb-2 last:mb-0">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-description">
            {format(log.date, "yyyy-MM-dd HH:mm:ss")}
          </span>
          {onEdit && (
            <BaseDialog
              title="업무이력 수정"
              triggerChildren={<IconButton icon="SquarePen" />}
              open={open}
              setOpen={setOpen}
            >
              <LogEdit log={originalLog} onSubmit={handleSubmit} />
            </BaseDialog>
          )}
        </div>
        <span className="text-sm">{log.issue ?? "업무를 수행하였습니다."}</span>
        {log.attachPaths.length > 0 && (
          <DialogCarousel pathList={log.attachPaths} />
        )}
      </div>

      {/* 구분선 */}
      {index < total - 1 && <div className="border-b border-border mt-2" />}
    </div>
  );
};
