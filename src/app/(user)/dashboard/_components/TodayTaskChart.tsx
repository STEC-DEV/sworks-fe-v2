import CustomCard from "@/components/common/card";
import React from "react";
import { cn } from "@/lib/utils";
import { TodayTaskCount, useTodayTask } from "@/hooks/dashboard/useTodayTask";
import { ChartError, ChartLoading } from "./VocTrendChart";

const TodayTaskChart = ({ className }: { className?: string }) => {
  const { data, isError, isLoading, error } = useTodayTask();

  if (isLoading) return <ChartLoading className={className} />;

  if (isError || !data) return <ChartError className={className} />;

  const completeRate = (
    data.completedCount /
    (data.completedCount + data.inProgressCount + data.notStartedCount)
  ).toFixed(2);
  return (
    <CustomCard
      className={cn(
        "flex-1 min-h-0 p-4 gap-0 justify-between border-none shadow-md",
        className,
      )}
    >
      <div className="flex items-center justify-between">
        <div className="text-base font-bold text-[#1a2340]">금일 업무 현황</div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-description-light">완료율</span>
          <span className="text-lg font-extrabold text-[#1D9E75]">
            {completeRate} %
          </span>
        </div>
      </div>

      {/* 세그먼트 바 */}
      <TaskSegmentBar data={data} />
    </CustomCard>
  );
};

export default TodayTaskChart;

export function TaskSegmentBar({ data }: { data?: TodayTaskCount }) {
  const done = data?.completedCount ?? 0;
  const inProgress = data?.inProgressCount ?? 0;
  const notStarted = data?.notStartedCount ?? 0;
  const total = done + inProgress + notStarted;

  const segments = [
    { color: "#1D9E75", label: `완료 ${done}`, flex: done },
    { color: "#378add", label: `진행 ${inProgress}`, flex: inProgress },
    { color: "#e0e0e0", label: `미착수 ${notStarted}`, flex: notStarted },
  ];

  if (total === 0)
    return (
      <div className="text-xs text-description">업무 데이터가 없습니다.</div>
    );

  return (
    <>
      <div className="flex h-2 rounded overflow-hidden gap-0.5 mt-1 mb-1.5">
        {segments.map((s) => (
          <div key={s.label} style={{ flex: s.flex, background: s.color }} />
        ))}
      </div>
      <div className="flex gap-3 mb-3.5">
        {segments.map((s) => (
          <div
            key={s.label}
            className="flex items-center gap-1 text-xs text-description"
          >
            <div
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: s.color }}
            />
            {s.label}
          </div>
        ))}
      </div>
    </>
  );
}
