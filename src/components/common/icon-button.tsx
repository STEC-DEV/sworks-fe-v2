import { icons } from "lucide-react";
import React, { HTMLAttributes } from "react";

interface IconButtonProps extends HTMLAttributes<HTMLOrSVGElement> {
  className?: string;
  icon: keyof typeof icons;
  size?: number;
}

const IconButton = ({
  className,
  icon,
  size = 16,
  ...props
}: IconButtonProps) => {
  const SelectLucideIcon = icons[icon];
  return (
    <div
      className="p-2 rounded-[50px] hover:bg-[var(--background)] hover:cursor-pointer"
      {...props}
    >
      <SelectLucideIcon className="text-[var(--icon)]" size={size} />
    </div>
  );
};

export default IconButton;
