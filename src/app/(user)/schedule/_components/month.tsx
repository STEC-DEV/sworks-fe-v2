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
  DotIcon,
  EllipsisVertical,
  GripVertical,
  SquarePenIcon,
  TagIcon,
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
import Button from "@/components/common/button";
import { motion, useAnimate } from "framer-motion";

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
    <CustomCard className="shadow-sm flex flex-col w-full xl:w-80 xl:min-h-0 xl:h-full py-4">
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
      {monthSchedules ? (
        monthSchedules.length > 0 ? (
          <ScrollArea className="flex-1 min-h-0 h-full">
            <div className="flex flex-col gap-1 ">
              {monthSchedules.map((v, i) =>
                canWorkerEdit ? (
                  <DraggableBox key={i} id={v.planSeq}>
                    <MonthScheduleItem key={v.planSeq} data={v} />
                  </DraggableBox>
                ) : (
                  <MonthScheduleItem key={v.planSeq} data={v} />
                ),
              )}
            </div>
          </ScrollArea>
        ) : (
          <MonthlyScheduleEmptyState />
        )
      ) : null}
      {/* <ScrollArea className="flex-1 min-h-0 h-full">
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
              <div className="h-full flex-1 flex flex-col items-center justify-center gap-5 px-5">
                <EmptyScheduleIcon />
                <Button label="일정 추가하기" variant={"gradient"} />
              </div>
            )
          ) : null}
        </div>
      </ScrollArea> */}
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
  const [popoverOpen, setPopoverOpen] = useState<boolean>(false); // 추가
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

  // return (
  //   <div
  //     className={cn(
  //       `group h-full w-full flex  px-2  pr-4 items-center ${
  //         canWorkerEdit && "cursor-pointer"
  //       } hover:bg-gray-50`,
  //       className,
  //     )}
  //   >
  //     <div className=" self-stretch  w-0.75 bg-primary mr-2" />
  //     <div className="flex gap-2 items-center py-2 flex-1 ">
  //       {/* <EllipsisVertical className="text-[var(--icon)]" strokeWidth={1.5} /> */}
  //       <GripDots5
  //         size={28}
  //         className="text-gray-300 group-hover:text-gray-400"
  //       />
  //       <div className="flex flex-col">
  //         <div className="flex items-center ">
  //           <div className="w-fit leading-none px-2 bg-primary-background rounded-[2px]">
  //             <span className="text-xs text-primary font-semibold ">
  //               {data.serviceTypeName}
  //             </span>
  //           </div>

  //           <DotIcon className="text-border-strong" size={16} />
  //           <div>
  //             <span className="text-xs text-primary font-semibold ">
  //               {data.remarkName}
  //             </span>
  //           </div>
  //         </div>

  //         <span className="text-sm font-medium">{data.planTitle}</span>
  //         <span className="text-xs text-[var(--description-light)]">
  //           {data.description}
  //         </span>
  //       </div>
  //     </div>
  //     {/* 팝오버 */}
  //     {!isDrag && canWorkerEdit && (
  //       <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
  //         <PopoverTrigger
  //           asChild
  //           className="hidden group-hover:block"
  //           onClick={(e) => e.stopPropagation()}
  //           onPointerDown={(e) => e.stopPropagation()}
  //         >
  //           <IconButton
  //             icon="EllipsisVertical"
  //             bgClassName="hover:bg-gray-200 rounded-[4px] px-"
  //           />
  //         </PopoverTrigger>
  //         <PopoverContent className=" bg-white w-25 p-0 ">
  //           <div
  //             onPointerDown={(e) => e.stopPropagation()}
  //             // onClick={(e) => e.stopPropagation()}
  //             className="flex flex-col  items-start justify-center "
  //           >
  //             <BaseDialog
  //               title="월간일정 수정"
  //               open={open}
  //               // setOpen={setOpen}
  //               setOpen={(v) => {
  //                 setOpen(v);
  //                 if (v) setPopoverOpen(false); // 다이얼로그 열릴 때 팝오버 닫기
  //               }}
  //               triggerChildren={
  //                 <div className="w-full flex  items-center gap-2 px-4 py-2 hover:bg-gray-50 cursor-pointer">
  //                   <SquarePenIcon size={16} className="text-[var(--icon)]" />
  //                   <span className="text-sm text-[var(--description-dark)]">
  //                     수정
  //                   </span>
  //                 </div>
  //               }
  //             >
  //               <MonthEditForm
  //                 key={data.planSeq}
  //                 data={data}
  //                 onClose={() => setOpen(false)}
  //               />
  //             </BaseDialog>
  //             <CheckDialog
  //               title={dialogText.defaultDelete.title}
  //               description={dialogText.defaultDelete.description}
  //               actionLabel={dialogText.defaultDelete.actionLabel}
  //               onClick={onDelete}
  //             >
  //               <div className="w-full flex  items-center gap-2 px-4 py-2 hover:bg-gray-50 cursor-pointer">
  //                 <Trash2Icon size={16} className="text-red-500" />
  //                 <span className="text-sm text-[var(--description-dark)]">
  //                   삭제
  //                 </span>
  //               </div>
  //             </CheckDialog>
  //           </div>
  //         </PopoverContent>
  //       </Popover>
  //     )}
  //   </div>
  // );
  return (
    <div
      className={cn(
        `group h-full w-full flex px-2 pr-4 items-center ${
          canWorkerEdit && "cursor-pointer"
        } hover:bg-gray-50`,
        className,
      )}
    >
      <div className="self-stretch w-0.75 bg-primary mr-2" />
      <div className="flex gap-2 items-center py-2 flex-1">
        <GripDots5
          size={28}
          className="text-gray-300 group-hover:text-gray-400"
        />
        <div className="flex flex-col">
          <div className="flex items-center">
            <div className="w-fit leading-none px-2 bg-primary-background rounded-[2px]">
              <span className="text-xs text-primary font-semibold">
                {data.serviceTypeName}
              </span>
            </div>
            <DotIcon className="text-border-strong" size={16} />
            <div>
              <span className="text-xs text-primary font-semibold">
                {data.remarkName}
              </span>
            </div>
          </div>
          <span className="text-sm font-medium">{data.planTitle}</span>
          <span className="text-xs text-[var(--description-light)]">
            {data.description}
          </span>
        </div>
      </div>

      {!isDrag && canWorkerEdit && (
        <>
          <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
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
            <PopoverContent className="bg-white w-25 p-0">
              <div
                onPointerDown={(e) => e.stopPropagation()}
                className="flex flex-col items-start justify-center"
              >
                <div
                  className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-50 cursor-pointer"
                  onClick={() => {
                    setPopoverOpen(false);
                    setOpen(true);
                  }}
                >
                  <SquarePenIcon size={16} className="text-[var(--icon)]" />
                  <span className="text-sm text-[var(--description-dark)]">
                    수정
                  </span>
                </div>
                <CheckDialog
                  title={dialogText.defaultDelete.title}
                  description={dialogText.defaultDelete.description}
                  actionLabel={dialogText.defaultDelete.actionLabel}
                  onClick={onDelete}
                >
                  <div className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-50 cursor-pointer">
                    <Trash2Icon size={16} className="text-red-500" />
                    <span className="text-sm text-[var(--description-dark)]">
                      삭제
                    </span>
                  </div>
                </CheckDialog>
              </div>
            </PopoverContent>
          </Popover>

          <BaseDialog
            title="월간일정 수정"
            open={open}
            setOpen={setOpen}
            triggerChildren={<div className="hidden" />}
          >
            <MonthEditForm
              key={data.planSeq}
              data={data}
              onClose={() => setOpen(false)}
            />
          </BaseDialog>
        </>
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
        const target = e.target as HTMLElement;
        if (
          target.closest('[role="dialog"]') ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "INPUT"
        ) {
          e.stopPropagation();
        }
      }}
      onPointerDown={(e) => {
        if (document.querySelector('[role="dialog"]')) return;
        listeners?.onPointerDown?.(e);
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

const CAL_CELLS: Array<"empty" | "filled" | "default"> = [
  "empty",
  "filled",
  "filled",
  "filled",
  "empty",
  "default",
  "default",
  "default",
  "default",
  "default",
  "filled",
  "filled",
  "default",
  "default",
  "default",
];
//empty icon
const EmptyScheduleIcon = () => {
  const [scope, animate] = useAnimate();

  useEffect(() => {
    animate(
      scope.current,
      { y: [0, -8, 0, -8, 0] }, // 약 1.5사이클 후 원위치
      { duration: 3, ease: "easeInOut" },
    );
  }, []);

  return (
    <motion.div ref={scope} className="relative h-20 w-20">
      <div
        className="h-20 w-20 overflow-hidden rounded-2xl bg-white"
        style={{
          border: "2px solid #c8d0e8",
          boxShadow:
            "0 8px 24px rgba(34,51,119,0.12), 0 2px 8px rgba(34,51,119,0.08)",
        }}
      >
        {/* Calendar header bar */}
        <div
          className="flex h-7 items-center justify-center gap-[5px]"
          style={{ background: "linear-gradient(135deg, #223377, #4a63bb)" }}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-white/70" />
          <span className="h-1.5 w-1.5 rounded-full bg-white" />
          <span className="h-1.5 w-1.5 rounded-full bg-white/70" />
        </div>

        {/* Calendar cell grid */}
        <div className="grid grid-cols-5 gap-0.5 p-1.5">
          {CAL_CELLS.map((type, i) => (
            <div
              key={i}
              className="h-1.5 rounded-sm"
              style={{
                background:
                  type === "filled"
                    ? "#8896c8"
                    : type === "empty"
                      ? "transparent"
                      : "#dde2f0",
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

//── stagger 애니메이션 variants ────────────────────────────────────────────
const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" as const },
  },
};

const MonthlyScheduleEmptyState = ({ onAdd }: { onAdd?: () => void }) => {
  const { canWorkerEdit } = usePermission();
  const [open, setOpen] = useState<boolean>(false);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <motion.div
      className="h-full flex-1 flex flex-col items-center justify-center gap-5 px-5"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {/* 아이콘 — float 3초 후 정지 */}
      <motion.div variants={itemVariants}>
        <EmptyScheduleIcon />
      </motion.div>

      {/* 텍스트 */}
      <motion.div className="text-center" variants={itemVariants}>
        <h3
          className="mb-1.5 text-sm font-bold tracking-tight"
          style={{ color: "#223377" }}
        >
          이번 달 일정이 비어있어요
        </h3>
        <p
          className="text-xs leading-relaxed font-normal"
          style={{ color: "#4a63bb" }}
        >
          새로운 월간 일정을 추가하고
          <br />
          한눈에 계획을 확인해 보세요
        </p>
      </motion.div>

      {canWorkerEdit && (
        <BaseDialog
          title="월간일정 생성"
          open={open}
          setOpen={setOpen}
          triggerChildren={
            <motion.div variants={itemVariants}>
              <Button
                label="일정 추가하기"
                variant="default"
                size={"sm"}
                onClick={onAdd}
              />
            </motion.div>
          }
        >
          <MonthAddForm onClose={handleClose} />
        </BaseDialog>
      )}
      {/* 버튼 */}
    </motion.div>
  );
};
