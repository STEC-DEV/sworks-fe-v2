import CustomCard from "@/components/common/card";
import { useVocTrend } from "@/hooks/dashboard/useVocTrend";
import { cn } from "@/lib/utils";
import React from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const VocTrendChart = ({ className }: { className?: string }) => {
  const { data, isError, isLoading, error } = useVocTrend();

  if (isLoading) return <ChartLoading className={className} />;

  if (isError) return <ChartError className={className} />;

  return (
    <CustomCard
      className={cn(
        "flex flex-col p-4 gap-0 border-none shadow-md ",
        className,
      )}
    >
      <div className="text-lg font-semibold text-[#1a2340] mb-2.5">
        민원 발생 추이
        <span className="text-xs font-medium text-description ml-1.5">
          최근 6개월 · 단위 건
        </span>
      </div>
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 4, right: 8, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="gradBlue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3B6FBF" stopOpacity={0.38} />
                <stop offset="60%" stopColor="#3B6FBF" stopOpacity={0.15} />
                <stop offset="100%" stopColor="#3B6FBF" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="dates" // ← VocTransition.dates
              tick={{ fontSize: 11, fill: "var(--description)" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              domain={[
                0,
                (dataMax: number) => {
                  if (dataMax <= 3) return 4; // 데이터가 작을 때 최소 10까지
                  return Math.ceil(dataMax * 1.4); // 평소엔 max의 1.4배
                },
              ]}
              tick={{ fontSize: 11, fill: "var(--description)" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                fontSize: 12,
                borderRadius: 8,
                border: "0.5px solid #eee",
              }}
              formatter={(v: number) => [`${v}건`, "민원"]}
            />
            <Area
              type="monotone"
              dataKey="counts" // ← VocTransition.counts
              stroke="#3B6FBF"
              strokeWidth={2}
              fill="url(#gradBlue)"
              dot={{ r: 3, fill: "#fff", stroke: "#3B6FBF", strokeWidth: 2 }}
              activeDot={{ r: 4 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </CustomCard>
  );
};

export default VocTrendChart;

export function ChartLoading({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-xl bg-white shadow-md animate-pulse",
        className,
      )}
    >
      <div className="flex flex-col items-center gap-2 text-description">
        <div className="w-8 h-8 rounded-full border-2 border-[#223377]/20 border-t-[#223377] animate-spin" />
        <span className="text-xs">불러오는 중</span>
      </div>
    </div>
  );
}

export function ChartError({
  className,
  message = "데이터를 불러오지 못했습니다.",
  onRetry,
}: {
  className?: string;
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-xl bg-white shadow-md",
        className,
      )}
    >
      <div className="flex flex-col items-center gap-2 text-description">
        <span className="text-2xl">⚠️</span>
        <span className="text-xs">{message}</span>
        {onRetry && (
          <button
            onClick={onRetry}
            className="text-xs text-[#223377] underline underline-offset-2 mt-1"
          >
            다시 시도
          </button>
        )}
      </div>
    </div>
  );
}
