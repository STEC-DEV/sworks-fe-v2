import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import React from "react";

interface ProcessBadgeProps {
  label: string;
  icon: LucideIcon;
  style?: string;
}

export const ProcessBadge = ({
  label,
  icon: Icon,
  style,
}: ProcessBadgeProps) => {
  return (
    <div
      className={cn(
        `flex gap-2 text-white py-0.5 justify-center items-center  rounded-[50px]`,
        style
      )}
    >
      <Icon size={16} />
      <span className="text-xs">{label}</span>
    </div>
  );
};
