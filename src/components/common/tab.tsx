"use client";

import { cn } from "@/lib/utils";
import React, { useState } from "react";

type TabConfig = {
  tabTitle: string;
  render: React.ReactNode;
  options?: React.ReactNode;
  size?: "lg" | "md" | "sm";
};

const TabBox = ({
  className,
  title,
  size = "lg",
  onClick,
}: {
  className?: string;
  title: string;
  onClick: () => void;
  size?: "lg" | "md" | "sm";
}) => {
  const sizeStyles = {
    lg: "px-4 py-2 text-sm",
    md: "px-3 py-1.5 text-xs",
    sm: "px-2 py-1 text-xs",
  };

  return (
    <div
      className={cn(
        "rounded-lg text-description cursor-pointer font-medium transition-all duration-150 select-none",
        sizeStyles[size],
        className,
      )}
      onClick={onClick}
    >
      {title}
    </div>
  );
};

export const Tab = ({ configs }: { configs: TabConfig[] }) => {
  const [curIdx, setCurIdx] = useState<number>(0);

  return (
    <div className="flex flex-col gap-5">
      {/* 탭 헤더 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 bg-surface border border-border rounded-xl p-1 shadow-sm w-fit">
          {configs.map((c, i) => (
            <TabBox
              key={i}
              title={c.tabTitle}
              size={c.size}
              onClick={() => setCurIdx(i)}
              className={
                curIdx === i
                  ? "bg-primary text-primary-foreground font-semibold shadow-sm"
                  : "hover:bg-background hover:text-description-strong"
              }
            />
          ))}
        </div>

        {/* 현재 탭의 옵션 (있을 때만) */}
        {configs[curIdx].options && (
          <div className="flex items-center gap-2">
            {configs[curIdx].options}
          </div>
        )}
      </div>

      {/* 탭 컨텐츠 */}
      {configs[curIdx].render}
    </div>
  );
};
export default Tab;
