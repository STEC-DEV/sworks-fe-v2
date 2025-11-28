import { LucideIcon } from "lucide-react";
import React from "react";

const AppTitle = ({
  title,
  isBorder,
  icon: Icon,
}: {
  title: string;
  isBorder?: boolean;
  icon?: LucideIcon;
}) => {
  return isBorder ? (
    <div className="flex items-center gap-2 border-b-2 border-border pb-4">
      {Icon && <Icon className="text-primary " size={24} />}
      <span className="text-xl font-semibold">{title}</span>
    </div>
  ) : (
    <div className="flex items-center gap-2">
      {Icon && (
        <Icon
          className="text-[var(--icon)] text-blue-500 "
          size={24}
          strokeWidth={1.5}
        />
      )}
      <span className="text-xl font-semibold">{title}</span>
    </div>
  );
};

export default AppTitle;
