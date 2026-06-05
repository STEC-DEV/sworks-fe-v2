import CustomCard from "@/components/common/card";
import React from "react";
import { cn } from "@/lib/utils";
import { ChartError, ChartLoading } from "./VocTrendChart";
import { DashSch, useSchedules } from "@/hooks/dashboard/useSchedules";
import { format, isPast, parse } from "date-fns";

const ScheduleCard = ({ className }: { className?: string }) => {
  const { data, isError, isLoading, error } = useSchedules();

  if (isLoading) return <ChartLoading className={className} />;

  if (isError) return <ChartError className={className} />;
  return (
    <CustomCard className={cn("p-4 gap-0 border-none shadow-md", className)}>
      <div className="text-sm font-medium text-[#1a2340] mb-2.5">
        오늘 · 내일 일정
      </div>
      {data && data.length > 0 ? (
        data
          .slice(0, 6)
          .map((s, i) => <DashScheduleItem key={"sch" + i} item={s} />)
      ) : (
        <div className="text-xs text-description">최근 일정이 없습니다.</div>
      )}
    </CustomCard>
  );
};

export default ScheduleCard;

function isPastSchedule(dates: string, endTime: string) {
  // "2025-01-23" + "09:30:00" → Date 객체로 합쳐서 비교
  return isPast(
    parse(`${dates} ${endTime}`, "yyyy-MM-dd HH:mm:ss", new Date()),
  );
}

export const DashScheduleItem = ({ item }: { item: DashSch }) => {
  function formatTime(startTime: string) {
    throw new Error("Function not implemented.");
  }

  return (
    <div
      key={item.schSeq}
      className={`flex gap-2 py-1.5 border-b border-gray-50 last:border-0 ${
        isPastSchedule(item.dates, item.endTime) ? "opacity-60" : ""
      }`}
    >
      {/* 날짜로변경 */}
      <div className="text-xs text-description min-w-[32px] pt-0.5">
        {format(item.dates, "MM-dd")}
      </div>
      <div
        className="w-1.5 h-1.5 rounded-full mt-1 shrink-0"
        style={{ background: `#${item.viewColor}` }}
      />
      <div>
        <div className="text-sm text-description">{item.schTitle}</div>
        <div className="text-xs text-description">
          {/* {formatTime(item.startTime)} ~ {formatTime(item.endTime)} */}

          {item.isAllday
            ? "종일"
            : `${formatTime(item.startTime)} ~ ${formatTime(item.endTime)}`}
        </div>

        {/* <div className="text-xs text-description">
          {s.location} · {s.day === "today" ? "오늘" : "내일"}
        </div> */}
      </div>
    </div>
  );
};
