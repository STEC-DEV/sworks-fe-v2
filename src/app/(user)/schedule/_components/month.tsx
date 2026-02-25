import CustomCard from "@/components/common/card";
import CheckDialog from "@/components/common/check-dialog";
import IconButton from "@/components/common/icon-button";
import MonthAddForm from "@/components/form/normal/schedule/month-add";
import MonthEditForm from "@/components/form/normal/schedule/month-edit";
import BaseDialog from "@/components/ui/custom/base-dialog";
import EmptyBox from "@/components/ui/custom/empty";
import { ScrollArea } from "@/components/ui/scroll-area";
import { usePermission } from "@/hooks/usePermission";
import { cn } from "@/lib/utils";
import { useScheduleStore } from "@/store/normal/schedule/shcedule-store";
import { MonthScheduleListItem } from "@/types/normal/schedule/month";
import { useDraggable } from "@dnd-kit/core";
import { format } from "date-fns";
import {
  EllipsisVertical,
  GripVertical,
  SquarePenIcon,
  Trash2Icon,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import { dialogText } from "../../../../../public/text";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const MonthSchedule = () => {
  const { monthSchedules, getMonthSchedule } = useScheduleStore();
  const [open, setOpen] = useState<boolean>(false);
  const { canWorkerEdit } = usePermission();
  const searchParams = useSearchParams();

  const getData = useCallback(async () => {
    const year = searchParams.get("year");
    const month = searchParams.get("month");
    if (!year || !month) {
      const date = format(new Date(), "yyyy-MM");
      await getMonthSchedule(new URLSearchParams({ targetDt: date }));
    } else {
      await getMonthSchedule(
        new URLSearchParams({ targetDt: `${year}-${month}` }),
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
    <CustomCard className="flex flex-col w-full xl:w-80 xl:min-h-0 xl:h-full py-4">
      <div className=" px-4  flex justify-between items-center">
        <span className="text-lg font-semibold">월간일정</span>
        {canWorkerEdit && (
          <BaseDialog
            title="월간일정 생성"
            open={open}
            setOpen={setOpen}
            triggerChildren={<IconButton icon="Plus" />}
          >
            <MonthAddForm onClose={handleClose} />
          </BaseDialog>
        )}
      </div>
      <ScrollArea className="flex-1 min-h-0 h-full">
        <div className="flex flex-col gap-1 ">
          {monthSchedules ? (
            monthSchedules.length > 0 ? (
              monthSchedules.map((v, i) =>
                canWorkerEdit ? (
                  <DraggableBox key={i} id={v.planSeq}>
                    <MonthScheduleItem key={i} data={v} />
                  </DraggableBox>
                ) : (
                  <MonthScheduleItem key={i} data={v} />
                ),
              )
            ) : (
              <div className="px-2">
                {/* <span className="text-xs text-[var(--description-light)]">
                  일정 없음
                </span> */}
                <EmptyBox message="일정없음" />
              </div>
            )
          ) : null}
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
  const { canWorkerEdit } = usePermission();
  const searchParams = useSearchParams();
  const { deleteMonthSchedule } = useScheduleStore();

  const handleClick = (e: React.MouseEvent<HTMLOrSVGElement>) => {
    e.stopPropagation(); // 이벤트 버블링중단
    // e.preventDefault(); // 기본동작 방지
  };

  const onDelete = async () => {
    const year = searchParams.get("year");
    const month = searchParams.get("month");

    if (!year || !month) {
      await deleteMonthSchedule(
        data.planSeq,
        new URLSearchParams({ targetDt: format(new Date(), "yyyy-MM") }),
      );
    } else {
      await deleteMonthSchedule(
        data.planSeq,
        new URLSearchParams({ targetDt: `${year}-${month}` }),
      );
    }
  };
  return (
    <div
      className={cn(
        `group h-full w-full flex  px-2  pr-4 items-center ${
          canWorkerEdit && "cursor-pointer"
        } hover:bg-gray-50`,
        className,
      )}
    >
      <div className=" self-stretch  w-0.75 bg-blue-500 mr-2" />
      <div className="flex gap-2 items-center py-2 flex-1 ">
        {/* <EllipsisVertical className="text-[var(--icon)]" strokeWidth={1.5} /> */}
        <GripDots5
          size={28}
          className="text-gray-300 group-hover:text-gray-400"
        />
        <div className="flex flex-col">
          <div className="w-fit leading-none px-2 bg-blue-100 rounded-[2px]">
            <span className="text-xs text-blue-500 font-semibold ">
              {data.serviceTypeName}
            </span>
          </div>

          <span className="text-sm font-medium">{data.planTitle}</span>
          <span className="text-xs text-[var(--description-light)]">
            {data.description}
          </span>
        </div>
      </div>
      {/* 팝오버 */}
      {!isDrag && canWorkerEdit && (
        <Popover>
          <PopoverTrigger
            asChild
            className="hidden group-hover:block"
            onClick={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
          >
            <IconButton
              icon="EllipsisVertical"
              bgClassName="hover:bg-gray-200 rounded-[4px] px-"
            />
          </PopoverTrigger>
          <PopoverContent className=" bg-white w-25 p-0 ">
            <div
              onPointerDown={(e) => e.stopPropagation()}
              // onClick={(e) => e.stopPropagation()}
              className="flex flex-col  items-start justify-center "
            >
              <BaseDialog
                title="월간일정 수정"
                open={open}
                setOpen={setOpen}
                triggerChildren={
                  <div className="w-full flex  items-center gap-2 px-4 py-2 hover:bg-gray-50 cursor-pointer">
                    <SquarePenIcon size={16} className="text-[var(--icon)]" />
                    <span className="text-sm text-[var(--description-dark)]">
                      수정
                    </span>
                  </div>
                }
              >
                <MonthEditForm data={data} onClose={() => setOpen(false)} />
              </BaseDialog>
              <CheckDialog
                title={dialogText.defaultDelete.title}
                description={dialogText.defaultDelete.description}
                actionLabel={dialogText.defaultDelete.actionLabel}
                onClick={onDelete}
              >
                <div className="w-full flex  items-center gap-2 px-4 py-2 hover:bg-gray-50 cursor-pointer">
                  <Trash2Icon size={16} className="text-red-500" />
                  <span className="text-sm text-[var(--description-dark)]">
                    삭제
                  </span>
                </div>
              </CheckDialog>
            </div>
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
};

interface DraggableBoxProps {
  children: React.ReactNode;
  id: number;
}
const DraggableBox = ({ children, id }: DraggableBoxProps) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
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
        focus-visible:outline-none
        ${isDragging ? "opacity-50 scale-105 z-50" : "opacity-100"}
        transition-opacity
      `}
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      onKeyDown={(e) => {
        // Popover 내부에서 키 이벤트 발생 시 드래그 방지
        if ((e.target as HTMLElement).closest('[role="dialog"]')) {
          e.stopPropagation();
        }
      }}
    >
      {children}
    </div>
  );
};

export default MonthSchedule;

//그립 svg요소
const GripDots5 = ({
  size = 16,
  className,
}: {
  size?: number;
  className?: string;
}) => (
  <svg width={6} height={size} viewBox="0 0 6 28" className={className}>
    {[2, 8, 14, 20, 26].map((cy) => (
      <circle key={cy} cx={3} cy={cy} r={1.5} fill="currentColor" />
    ))}
  </svg>
);
