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
    console.log("월간일정 시퀀스 : ", e.active.data.current?.id);
    const monthSeq = e.active.data.current?.id;
    const date = e.over.data.current as Date;
    console.log(date);
    if (!monthSeq || !date) return;
    const schedule = monthSchedules?.find((item) => item.planSeq === monthSeq);

    if (!schedule) return;

    await postMonthToDay(schedule, date);
    await getDaySchedule(currentYearMonth);

    // console.log(
    //   "월간일정 데이터 : ",
    //   monthSchedules.find((item) => item.monthSeq === e.active.data.current?.id)
    // );
    // console.log(
    //   "변경날짜 : ",
    //   e.over?.data.current
    //     ? format(new Date(e.over?.data.current as Date), "yyyy-MM-dd")
    //     : null
    // );
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
    <div className="flex flex-col gap-4 xl:h-full">
      <AppTitle title="일정" icon={CalendarDays} />
      <DndContext
        onDragEnd={handleDragEnd}
        onDragStart={handleDragStart}
        // autoScroll={false} 반응형 시 스크롤이 필요함
      >
        <div className="flex flex-col  xl:flex-row gap-12  xl:h-full">
          <DroppableCalendar />
          <MonthSchedule />
        </div>
        <DragOverlay className="bg-blue-50  p-2 border border-[var(--border)] rounded-[4px]">
          {activeId && activeItem ? (
            <MonthScheduleItem
              data={activeItem}
              isDrag={activeId === activeItem.planSeq}
            />
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
};

export default Page;
