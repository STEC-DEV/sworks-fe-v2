import CustomCard from "@/components/common/card";
import IconButton from "@/components/common/icon-button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import {
  MonthScheduleListItem,
  monthSchedules,
} from "@/types/normal/schedule/month";
import { useDraggable } from "@dnd-kit/core";
import React from "react";

const MonthSchedule = () => {
  return (
    <CustomCard className="w-full xl:w-100 h-full py-4">
      <div className=" px-4  flex justify-between items-center">
        <span className="text-lg font-semibold">월간일정</span>
        <IconButton icon="Plus" />
      </div>
      <ScrollArea className="flex-1 min-h-0" style={{ overflow: "visible" }}>
        <div className="flex flex-col gap-2 mx-2">
          {monthSchedules.map((v, i) => (
            <DraggableBox key={i} id={v.monthSeq}>
              <MonthScheduleItem key={i} data={v} />
            </DraggableBox>
          ))}
        </div>
      </ScrollArea>
    </CustomCard>
  );
};

export const MonthScheduleItem = ({
  data,
  className,
  isDrag = false,
}: {
  data: MonthScheduleListItem;
  className?: string;
  isDrag?: boolean;
}) => {
  return (
    <div className={cn("w-full flex justify-between", className)}>
      <div className="flex flex-col">
        <span className="text-xs text-blue-500">{data.serviceTypeName}</span>
        <span className="text-sm">{data.title}</span>
      </div>
      {isDrag ? null : <IconButton icon="SquarePen" />}
    </div>
  );
};

interface DraggableBoxProps {
  children: React.ReactNode;
  id: number;
}
const DraggableBox = ({ children, id }: DraggableBoxProps) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `draggable ${id}`,
    data: { id },
  });
  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <div
      className={`
        px-2 py-2
       focus-visible:outline-none
        ${
          transform
            ? "bg-blue-50 opacity-60 p-2 border border-[var(--border)] rounded-[4px]"
            : null
        }`}
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
    >
      {children}
    </div>
  );
};

export default MonthSchedule;
