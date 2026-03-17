import React from "react";
import { Skeleton } from "../ui/skeleton";
import { cn } from "@/lib/utils";

interface BaseSkeletonProps {
  className?: string;
}

const BaseSkeleton = ({ className }: BaseSkeletonProps) => {
  return (
    <div className={cn("flex flex-col h-full ", className)}>
      <Skeleton
        className={"w-full h-full flex-1 border-[4px] bg-[var(--skeleton)]"}
      />
    </div>
  );
};

export default BaseSkeleton;
