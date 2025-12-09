"use client";

import { cn } from "@/lib/utils";
import React, { useState } from "react";

export interface TabConfig {
  tabTitle: string;
  render: React.ReactNode;
  options?: React.ReactNode;
  size?: "lg" | "md" | "sm";
}

const Tab = ({ configs }: { configs: TabConfig[] }) => {
  const [curIdx, setCurIdx] = useState<number>(0);
  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center border-b-2">
        <div className="flex gap-4  ">
          {configs.map((c, i) => (
            <TabBox
              key={i}
              className={`${
                curIdx === i
                  ? "text-primary font-bold  border-b-2 border-primary "
                  : null
              }`}
              title={c.tabTitle}
              size={c.size}
              onClick={() => setCurIdx(i)}
            />
          ))}
        </div>
        {configs[curIdx].options}
      </div>

      {/* <div key={curIdx}>
        {configs[curIdx].render}
      </div> */}
      {configs[curIdx].render}
    </div>
  );
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
    lg: "px-4 pb-4 text-md",
    md: "px-3 pb-3 text-sm",
    sm: "px-2 pb-2 text-xs",
  };
  return (
    <div
      className={cn(
        "px-4 pb-4 text-[var(--description-light)] cursor-pointer",
        sizeStyles[size],
        className
      )}
      onClick={onClick}
    >
      {title}
    </div>
  );
};

export default Tab;
