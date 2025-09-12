import { cn } from "@/lib/utils";
import {
  AlarmClockIcon,
  AlertCircleIcon,
  CheckCircle2Icon,
  CheckCircleIcon,
  ClockIcon,
  LucideIcon,
  RotateCwIcon,
} from "lucide-react";
import React from "react";

interface VocProcessBadgeProps {
  label: string;
  icon: LucideIcon;
  style?: string;
}

export const VocProcessBadge = ({
  label,
  icon: Icon,
  style,
}: VocProcessBadgeProps) => {
  // switch (value) {
  //   case 100:
  //     return (
  //       <div className="flex gap-2 text-white py-0.5 justify-center items-center bg-gray-400 rounded-[50px]">
  //         <AlarmClockIcon size={16} />
  //         <span className="text-xs">미처리</span>
  //       </div>
  //     );
  //   case 101:
  //     return (
  //       <div className="flex gap-2 text-white py-0.5 justify-center items-center bg-green-500 rounded-[50px]">
  //         <RotateCwIcon size={16} />
  //         <span className="text-xs">처리중</span>
  //       </div>
  //     );
  //   case 102:
  //     return (
  //       <div className="flex gap-2 text-white py-0.5 justify-center items-center bg-blue-500 rounded-[50px]">
  //         <CheckCircleIcon size={16} />
  //         <span className="text-xs">처리완료</span>
  //       </div>
  //     );
  // }
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
