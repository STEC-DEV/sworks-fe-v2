import React from "react";
import { ChartContainer, type ChartConfig } from "@/components/ui/chart";
import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts";

interface ChartDataProps {
  userName: string;
  value: number;
}

const DonutChart = ({ data }: { data: ChartDataProps[] }) => {
  const chartData = data.map((item) => ({
    ...item,
    fill: "#3b82f6", // 기본 파란색
  }));

  const chartConfig = {
    value: {
      //data key와 동일하게
      label: "Value",
    },
    ...(data.reduce(
      (acc, item) => {
        acc[item.userName] = {
          label: item.userName,
          color: "#3b82f6",
        };
        return acc;
      },
      {} as Record<string, { label: string; color: string }>,
    ) satisfies ChartConfig),
  };
  return (
    <div className="flex-1">
      <ChartContainer
        config={chartConfig}
        className="mx-auto aspect-square max-h-[120px]"
      >
        <RadialBarChart
          data={chartData}
          startAngle={0}
          endAngle={(chartData[0].value / 100) * 360}
          innerRadius={50}
          outerRadius={70}
        >
          <PolarGrid
            gridType="circle"
            radialLines={false}
            stroke="none"
            className="first:fill-gray-200 last:fill-white "
            polarRadius={[54, 46]}
          />
          <RadialBar
            dataKey="value"
            cornerRadius={3}
            isAnimationActive
            animationBegin={0}
          />
          <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
            <Label
              content={({ viewBox }) => {
                if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                  return (
                    <text
                      x={viewBox.cx}
                      y={viewBox.cy}
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      <tspan
                        x={viewBox.cx}
                        y={viewBox.cy}
                        className="fill-blue-500 text-xl font-bold"
                      >
                        {chartData[0].value.toLocaleString()}%
                      </tspan>
                    </text>
                  );
                }
              }}
            />
          </PolarRadiusAxis>
        </RadialBarChart>
      </ChartContainer>
    </div>
  );
};

export default DonutChart;
