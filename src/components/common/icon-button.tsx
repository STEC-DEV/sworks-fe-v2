import { cn } from "@/lib/utils";
import { icons } from "lucide-react";
import React, { HTMLAttributes } from "react";

interface IconButtonProps extends HTMLAttributes<HTMLOrSVGElement> {
  bgClassName?: string;
  className?: string;
  icon: keyof typeof icons;
  size?: number;
}

const IconButton = ({
  bgClassName,
  className,
  icon,
  size = 16,
  ...props
}: IconButtonProps) => {
  const SelectLucideIcon = icons[icon];
  return (
    <div
      className={cn(
        "p-2 rounded-[50px] hover:bg-[var(--background)] hover:cursor-pointer",
        bgClassName
      )}
      {...props}
    >
      <SelectLucideIcon
        className={cn("text-[var(--icon)]", className)}
        size={size}
      />
    </div>
  );
};

export default IconButton;
