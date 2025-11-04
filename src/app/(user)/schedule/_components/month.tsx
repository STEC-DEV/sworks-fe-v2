import CustomCard from "@/components/common/card";
import IconButton from "@/components/common/icon-button";
import MonthAddForm from "@/components/form/normal/schedule/month-add";
import MonthEditForm from "@/components/form/normal/schedule/month-edit";
import BaseDialog from "@/components/ui/custom/base-dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useScheduleStore } from "@/store/normal/schedule/shcedule-store";
import { MonthScheduleListItem } from "@/types/normal/schedule/month";
import { useDraggable } from "@dnd-kit/core";
import { format } from "date-fns";
import { useSearchParams } from "next/navigation";
import React, { useCallback, useEffect, useMemo, useState } from "react";

const MonthSchedule = () => {
  const { monthSchedules, getMonthSchedule } = useScheduleStore();
  const [open, setOpen] = useState<boolean>(false);
  const searchParams = useSearchParams();

  const getData = useCallback(async () => {
    const year = searchParams.get("year");
    const month = searchParams.get("month");
    if (!year || !month) {
      const date = format(new Date(), "yyyy-MM");
      await getMonthSchedule(new URLSearchParams({ targetDt: date }));
    } else {
      await getMonthSchedule(
        new URLSearchParams({ targetDt: `${year}-${month}` })
      );
    }
  }, [searchParams, getMonthSchedule]);

  useEffect(() => {
    getData();
  }, [getData]);

  const handleClose = () => {
    setOpen(false);
    getData();
  };
  return (
    <CustomCard className="w-full xl:w-100 h-full py-4">
      <div className=" px-4  flex justify-between items-center">
        <span className="text-lg font-semibold">월간일정</span>
        <BaseDialog
          title="월간일정 생성"
          open={open}
          setOpen={setOpen}
          triggerChildren={<IconButton icon="Plus" />}
        >
          <MonthAddForm onClose={handleClose} />
        </BaseDialog>
      </div>
      <ScrollArea className="flex-1 min-h-0" style={{ overflow: "visible" }}>
        <div className="flex flex-col gap-2 mx-2">
          {monthSchedules
            ? monthSchedules.map((v, i) => (
                <DraggableBox key={i} id={v.planSeq}>
                  <MonthScheduleItem key={i} data={v} />
                </DraggableBox>
              ))
            : null}
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
  const [open, setOpen] = useState<boolean>(false);
  const handleClick = (e: React.MouseEvent<HTMLOrSVGElement>) => {
    e.stopPropagation(); // 이벤트 버블링중단
    // e.preventDefault(); // 기본동작 방지
    console.log("클릭");
  };
  return (
    <div className={cn("w-full flex justify-between", className)}>
      <div className="flex flex-col">
        <span className="text-xs text-blue-500">{data.serviceTypeName}</span>
        <span className="text-sm">{data.planTitle}</span>
        <span className="text-xs text-[var(--description-light)]">
          {data.description}
        </span>
      </div>
      {isDrag ? null : (
        <div
          onPointerDown={(e) => e.stopPropagation()}
          // onClick={(e) => e.stopPropagation()}
        >
          <BaseDialog
            title="월간일정 수정"
            open={open}
            setOpen={setOpen}
            triggerChildren={
              <IconButton icon="SquarePen" onClick={(e) => handleClick(e)} />
            }
          >
            <MonthEditForm data={data} onClose={() => setOpen(false)} />
          </BaseDialog>
        </div>
      )}
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
