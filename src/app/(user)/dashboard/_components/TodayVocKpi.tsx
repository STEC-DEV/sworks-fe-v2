import CustomCard from "@/components/common/card";
import React from "react";
import { ChartError, ChartLoading } from "./VocTrendChart";
import { useTodayVoc } from "@/hooks/dashboard/useTodayVoc";
import { cn } from "@/lib/utils";

const TodayVocKpi = ({ className }: { className?: string }) => {
  const { data, isError, isLoading, error } = useTodayVoc();

  if (isLoading) return <ChartLoading className={className} />;

  if (isError) return <ChartError className={className} />;

  return (
    <CustomCard
      className={cn(
        "flex-1 min-h-0 p-4 gap-0 justify-between border-none shadow-md",
        className,
      )}
    >
      <div className="text-sm font-bold text-description mb-1">
        금일 민원 발생
      </div>
      <div className="text-3xl font-extrabold text-[#223377]">
        {data?.total}
        <span className="text-lg text-description-light">&nbsp;건</span>
      </div>
      <div className="text-sm font-medium text-description mt-1.5">
        처리완료 {data?.completed} · 처리중
        <span className="text-amber-600 font-medium">
          &nbsp;{data?.processing}
        </span>
      </div>
    </CustomCard>
  );
};

export default TodayVocKpi;
