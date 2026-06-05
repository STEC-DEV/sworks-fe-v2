import CustomCard from "@/components/common/card";
import { useQeTrend } from "@/hooks/dashboard/useQeTrend";
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
import { ChartEmpty, ChartError, ChartLoading } from "./VocTrendChart";
import { cn } from "@/lib/utils";

const QeTrendChart = ({ className }: { className?: string }) => {
  // const { qeTransition, dashNotice, dashSch, isError, isLoading } =
  //   useThirdCard();

  const { data, isError, isLoading, error } = useQeTrend();

  if (isLoading) return <ChartLoading className={className} />;

  if (isError) return <ChartError className={className} />;

  // if (!data || data.length === 0) return <ChartEmpty className={className} />;

  return (
    <CustomCard
      className={cn(
        " flex flex-col p-4 gap-0 border-none shadow-md ",
        className,
      )}
    >
      <div className="text-sm font-bold text-[#1a2340] mb-2.5">
        품질평가 점수 추이
        <span className="text-xs font-semibold text-description ml-1.5">
          최근 3개월
        </span>
      </div>
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 4, right: 8, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="gradGreen" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1D9E75" stopOpacity={0.18} />
                <stop offset="100%" stopColor="#1D9E75" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              // strokeDasharray="3 3" stroke="#f0f0f0"
              strokeDasharray="3 3"
              stroke="#cbd5e1" // #f0f0f0 → 더 진하게
              strokeOpacity={0.8} // 불투명도 추가
              vertical={false} // 세로선 제거하고 가로선만 (선택사항)
            />
            <XAxis
              dataKey="dates"
              tick={{ fontSize: 11, fill: "var(--description)" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              domain={[0, 100]}
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
              formatter={(v: number) => [`${v}점`, "품질평가"]}
            />
            <Area
              type="monotone"
              dataKey="score"
              stroke="#1D9E75"
              strokeWidth={2}
              fill="url(#gradGreen)"
              dot={{
                r: 3,
                fill: "#fff",
                stroke: "#1D9E75",
                strokeWidth: 2,
              }}
              activeDot={{ r: 4 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </CustomCard>
  );
};

export default QeTrendChart;
