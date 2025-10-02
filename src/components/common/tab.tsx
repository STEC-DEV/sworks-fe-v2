"use client";

import { cn } from "@/lib/utils";
import React, { useState } from "react";

export interface TabConfig {
  tabTitle: string;
  render: React.ReactNode;
  options?: React.ReactNode;
}

const Tab = ({ configs }: { configs: TabConfig[] }) => {
  const [curIdx, setCurIdx] = useState<number>(0);
  return (
    <div className="base-flex-col gap-6">
      <div className="flex justify-between items-center border-b">
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
              onClick={() => setCurIdx(i)}
            />
          ))}
        </div>
        {configs[curIdx].options}
      </div>

      {configs[curIdx].render}
    </div>
  );
};

const TabBox = ({
  className,
  title,
  onClick,
}: {
  className?: string;
  title: string;
  onClick: () => void;
}) => {
  return (
    <div
      className={cn(
        "px-4 pb-4 text-[var(--description-light)] cursor-pointer",
        className
      )}
      onClick={onClick}
    >
      {title}
    </div>
  );
};

export default Tab;
