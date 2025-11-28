import React from "react";
import { Skeleton } from "../ui/skeleton";
import { cn } from "@/lib/utils";

interface BaseSkeletonProps {
  className?: string;
}

const BaseSkeleton = ({ className }: BaseSkeletonProps) => {
  return (
    <div className={cn("shrink-0 h-full ", className)}>
      <Skeleton className={"w-full h-full border-[4px] bg-[var(--skeleton)]"} />
    </div>
  );
};

export default BaseSkeleton;
