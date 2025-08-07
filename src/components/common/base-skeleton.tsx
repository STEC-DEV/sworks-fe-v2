import React from "react";
import { Skeleton } from "../ui/skeleton";
import { cn } from "@/lib/utils";

interface BaseSkeletonProps {
  className?: string;
}

const BaseSkeleton = ({ className }: BaseSkeletonProps) => {
  return (
    <Skeleton
      className={cn(
        "w-full h-full border-[4px] bg-[var(--skeleton)]",
        className
      )}
    />
  );
};

export default BaseSkeleton;
