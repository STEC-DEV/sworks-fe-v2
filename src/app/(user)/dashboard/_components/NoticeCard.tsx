import CustomCard from "@/components/common/card";
import React from "react";
import { cn } from "@/lib/utils";
import { ChartError, ChartLoading } from "./VocTrendChart";
import { DashNotice, useNotice } from "@/hooks/dashboard/useNotices";
import { format } from "date-fns";

const NoticeCard = ({ className }: { className?: string }) => {
  const { data, isError, isLoading, error } = useNotice();

  if (isLoading) return <ChartLoading className={className} />;

  if (isError) return <ChartError className={className} />;
  return (
    <CustomCard className={cn("p-4 gap-0 border-none shadow-md", className)}>
      <div className="text-sm font-medium text-[#1a2340] mb-2.5">
        최근 공지사항
      </div>
      <div className="overflow-auto">
        {data && data?.length > 0 ? (
          data
            .slice(0, 6)
            .map((n, i) => <DashNoticeItem key={"notice" + i} item={n} />)
        ) : (
          <div className="text-xs text-description">
            최근 공지사항이 없습니다.
          </div>
        )}
      </div>
    </CustomCard>
  );
};

export default NoticeCard;

export const DashNoticeItem = ({ item }: { item: DashNotice }) => {
  return (
    <div
      key={item.id}
      className="flex items-start gap-2 py-1.5 border-b border-gray-50 last:border-0"
    >
      <div
        className="w-1.5 h-1.5 rounded-full mt-1 shrink-0"
        style={{ background: item.isPin ? "#e60e0e" : "#378add" }}
      />
      <div className="flex-1 min-w-0">
        <div className={`text-sm truncate text-description`}>{item.title}</div>
        <div className="text-xs text-description opacity-70 mt-0.5">
          {format(item.createDt, "MM-dd")}
        </div>
      </div>
    </div>
  );
};
