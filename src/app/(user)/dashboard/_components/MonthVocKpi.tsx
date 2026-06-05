import { useMonthVocRate } from "@/hooks/dashboard/useMonthVocRate";
import React from "react";
import { ChartError, ChartLoading } from "./VocTrendChart";
import CustomCard from "@/components/common/card";
import { cn } from "@/lib/utils";

const MonthVocKpi = ({ className }: { className?: string }) => {
  const { data, isError, isLoading, error } = useMonthVocRate();

  function getVocRateStatus(percent?: number) {
    if (percent === undefined || percent === 0) return null; // null이면 -- 표시

    if (percent >= 80)
      return { label: "양호", className: "bg-green-50 text-green-800" };
    if (percent >= 60)
      return { label: "보통", className: "bg-amber-50 text-amber-800" };
    return { label: "미흡", className: "bg-red-50 text-red-800" };
  }

  function VocRateStatus({ percent }: { percent?: number }) {
    const status = getVocRateStatus(percent);
    if (!status) return null;

    return (
      <span
        className={`text-xs font-medium px-1.5 py-0.5 rounded-lg ${status.className}`}
      >
        {status.label}
      </span>
    );
  }

  if (isLoading) return <ChartLoading className={className} />;

  if (isError) return <ChartError className={className} />;
  return (
    <CustomCard
      className={cn(
        "flex-1 min-h-0 p-4 gap-0 justify-between border-none shadow-md",
        className,
      )}
    >
      <div className="text-sm font-semibold text-description mb-1">
        이번달 민원 처리율
      </div>
      <div className="text-3xl font-extrabold text-[#223377]">
        {data?.completedPercent}
        <span className="text-lg text-description-light">&nbsp;%</span>
      </div>
      <div className="text-sm text-description-light">이번달 누적 기준</div>
      <div className="flex items-center gap-1.5 text-xs text-description mt-1.5">
        <VocRateStatus percent={data?.completedPercent} />
      </div>
    </CustomCard>
  );
};

export default MonthVocKpi;
