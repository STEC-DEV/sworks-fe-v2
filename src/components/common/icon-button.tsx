import { cn } from "@/lib/utils";
import { icons } from "lucide-react";
import React, { HTMLAttributes } from "react";
import Tooltip from "./tooltip";

interface IconButtonProps extends HTMLAttributes<HTMLOrSVGElement> {
  bgClassName?: string;
  className?: string;
  icon: keyof typeof icons;
  size?: number;
  tooltip?: string;
}

const IconButton = ({
  bgClassName,
  className,
  icon,
  size = 20,
  tooltip,
  ...props
}: IconButtonProps) => {
  const SelectLucideIcon = icons[icon];
  return (
    <Tooltip text={tooltip}>
      <div
        className={cn(
          "group p-2 rounded-[50px] hover:bg-[var(--background)] hover:cursor-pointer relative",
          bgClassName
        )}
        {...props}
      >
        <SelectLucideIcon
          className={cn("text-[var(--icon)]", className)}
          size={size}
        />
      </div>
    </Tooltip>
  );
};

export default IconButton;
