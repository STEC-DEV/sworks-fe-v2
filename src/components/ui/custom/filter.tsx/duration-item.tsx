import React, { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../../dropdown-menu";
import Button from "@/components/common/button";
import { format } from "date-fns";
import CustomDatetimePicker from "@/components/common/date-input/date-picker";
import IconButton from "@/components/common/icon-button";
import { Calendar, CalendarDays } from "lucide-react";

interface DurationItemProps {
  value: Record<string, Date | null>;
  placeholder?: string;
  startName: string;
  endName: string;
  onClick: (date: Date, keyName: string) => void;
  onReset: () => void;
}

const DurationItem = ({
  placeholder,
  value,
  startName,
  endName,
  onClick,
  onReset,
}: DurationItemProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="hover:cursor-pointer">
        <Button
          className={`
            text-black text-nowrap text-xs bg-white border  hover:bg-gray-50
            ${
              value[startName] || value[endName]
                ? "text-black border-blue-500"
                : "text-[var(--description-dark)]"
            }
             focus-visible:outline-none focus-visible:ring-0
            `}
          icon={CalendarDays}
          variant={"filter"}
          label={
            value[startName] || value[endName]
              ? `${
                  value[startName] ? format(value[startName], "yyyy-MM-dd") : ""
                } ~ ${
                  value[endName] ? format(value[endName], "yyyy-MM-dd") : ""
                }`
              : "기간"
          }
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="flex flex-col gap-4 px-4 py-2 rounded-[4px] bg-white">
        <div className="flex justify-end gap-1 items-center">
          <span className="text-xs text-[var(--description-light)]">
            초기화
          </span>
          <IconButton icon="RotateCcw" onClick={onReset} />
        </div>

        <div className="flex items-center gap-4">
          <span className="text-xs text-[var(--description-light)]">시작</span>
          <CustomDatetimePicker
            value={value[startName]}
            onChange={(date) => onClick(date, startName)}
          />
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs text-[var(--description-light)]">종료</span>
          <CustomDatetimePicker
            value={value[endName]}
            onChange={(date) => onClick(date, endName)}
          />
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DurationItem;
