"use client";
import { DroppableCalendar } from "@/components/common/calendar/dnd-calendar";
import AppTitle from "@/components/common/label/title";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
} from "@dnd-kit/core";
import React, { useEffect, useMemo, useState } from "react";
import MonthSchedule, { MonthScheduleItem } from "./_components/month";

import { format } from "date-fns";
import { useScheduleStore } from "@/store/normal/schedule/shcedule-store";
import { useSearchParams } from "next/navigation";
import { CalendarDays } from "lucide-react";

const Page = () => {
  const { monthSchedules, getDaySchedule, postMonthToDay } = useScheduleStore();
  const [activeId, setActiveId] = useState<number | null>(null);
  const activeItem = monthSchedules?.find((item) => item.planSeq === activeId);
  const searchParams = useSearchParams();

  const currentYearMonth = useMemo(() => {
    const year = searchParams.get("year");
    const month = searchParams.get("month");
    return year && month
      ? `${year}-${month}`
      : `${format(new Date(), "yyyy")}-${format(new Date(), "MM")}`;
  }, [searchParams]);

  useEffect(() => {
    getDaySchedule(currentYearMonth);
  }, [searchParams, getDaySchedule]);

  /**
   * 드래그 종료
   */
  const handleDragEnd = async (e: DragEndEvent) => {
    console.log(e);
    if (e.over === null || !e.active) return;
    // //월간일정 -> 일간일정 등록요청 로직
    // console.log("전송 데이터");

    const monthSeq = e.active.data.current?.id;
    const date = e.over.data.current as Date;
    console.log(date);
    if (!monthSeq || !date) return;
    const schedule = monthSchedules?.find((item) => item.planSeq === monthSeq);

    if (!schedule) return;

    await postMonthToDay(schedule, date);
    await getDaySchedule(currentYearMonth);
  };
  /**
   * 드래그 시작
   */
  const handleDragStart = (e: DragStartEvent) => {
    if (!e.active) return;

    if (!e.active.data.current?.id) return;
    setActiveId(e.active.data.current?.id);
  };
  return (
    <div className="xl:fixed xl:inset-0 xl:left-[280px] xl:overflow-hidden">
      {/* xl에서 fixed로 전체 화면 차지 */}
      <div className="flex flex-col gap-6 xl:px-12 xl:py-12 h-full min-h-screen xl:min-h-0">
        {/* 부모 레이아웃과 동일한 패딩 적용 */}
        <div className="flex flex-col gap-4 flex-1 min-h-0">
          <AppTitle title="일정" icon={CalendarDays} />
          <DndContext onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
            <div className="flex flex-col xl:flex-row gap-12 flex-1 min-h-0">
              <DroppableCalendar />
              <MonthSchedule />
            </div>
            <DragOverlay
              className="cursor-grabbing"
              dropAnimation={{
                duration: 200,
                easing: "cubic-bezier(0.18, 0.67, 0.6, 1.22)",
              }}
            >
              {activeId && activeItem ? (
                <div className="bg-white shadow-2xl rounded-lg border border-gray-100 ring-2 ring-blue-500/20 overflow-hidden opacity-80">
                  <MonthScheduleItem
                    data={activeItem}
                    isDrag={activeId === activeItem.planSeq}
                  />
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
        </div>
      </div>
    </div>
  );
};

export default Page;

// <div className="flex flex-col gap-4 flex-1">
//   <AppTitle title="일정" icon={CalendarDays} />
//   <DndContext
//     onDragEnd={handleDragEnd}
//     onDragStart={handleDragStart}
//     // autoScroll={false} 반응형 시 스크롤이 필요함
//   >
//     <div className="flex flex-col xl:flex-row gap-12 flex-1 min-h-0">
//       <DroppableCalendar />
//       <MonthSchedule />
//     </div>
//     <DragOverlay
//       className=" cursor-grabbing"
//       dropAnimation={{
//         duration: 200,
//         easing: "cubic-bezier(0.18, 0.67, 0.6, 1.22)",
//       }}
//     >
//       {activeId && activeItem ? (
//         <div className="bg-white shadow-2xl rounded-lg border border-gray-100 ring-2 ring-blue-500/20 overflow-hidden opacity-80">
//           <MonthScheduleItem
//             data={activeItem}
//             isDrag={activeId === activeItem.planSeq}
//           />
//         </div>
//       ) : null}
//     </DragOverlay>
//   </DndContext>
// </div>
