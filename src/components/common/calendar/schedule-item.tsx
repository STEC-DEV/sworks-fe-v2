import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { DaySchedule } from "@/types/normal/schedule/day-schedule";
import React, { useState } from "react";
import IconButton from "../icon-button";

interface ScheduleItemProps {
  data: DaySchedule;
}

const ScheduleItem = ({ data }: ScheduleItemProps) => {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <Popover
      open={open}
      onOpenChange={(open) => {
        console.log(open);
        setOpen(open);
      }}
    >
      <PopoverTrigger asChild onClick={(e) => e.stopPropagation()}>
        {/* <ScheduleTrigger label={data.schTitle} color={data.viewColor} /> */}
        <div
          className="flex items-center justify-start text-white text-xs w-full px-2 rounded-[4px] hover:cursor-pointer"
          style={{ backgroundColor: `#${data.viewColor}` }}
        >
          <span className="w-full truncate">{data.schTitle}</span>
        </div>
      </PopoverTrigger>
      <PopoverContent className="bg-white">
        <div className="flex justify-end">
          <IconButton icon="SquarePen" />
          <IconButton icon="Trash2" />
        </div>
        <div>
          <span>{data.schTitle}</span>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ScheduleItem;
