"use client";
import { LucideIcon } from "lucide-react";
import React from "react";
import IconButton from "../icon-button";
import { useRouter } from "next/navigation";

const AppTitle = ({
  title,
  isBorder,
  icon: Icon,
  isPrev = false,
  prevPath,
}: {
  title: string;
  isBorder?: boolean;
  icon?: LucideIcon;
  isPrev?: boolean;
  prevPath?: string;
}) => {
  const router = useRouter();
  return isBorder ? (
    <div className="flex items-center gap-2 border-b-2 border-border pb-4">
      {Icon && <Icon className="text-primary " size={24} />}
      <span className="text-xl font-semibold text-primary">{title}</span>
    </div>
  ) : (
    <div className="flex items-center gap-4">
      {isPrev && (
        <div className="hidden xl:flex flex-row gap-4 shrink-0">
          <IconButton
            icon="ChevronLeft"
            bgClassName="border border-border-strong !rounded-DEFAULT shadow-sm"
            size={28}
            onClick={() => (prevPath ? router.push(prevPath) : router.back())}
          />
        </div>
      )}
      {Icon && (
        <Icon
          className="text-[var(--icon)] text-blue-500 "
          size={24}
          strokeWidth={1.5}
        />
      )}
      <span className="text-2xl font-bold text-primary">{title}</span>
    </div>
  );
};

export default AppTitle;
