"use client";
import { DroppableCalendar } from "@/components/common/calendar/dnd-calendar";
import AppTitle from "@/components/common/label/title";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
} from "@dnd-kit/core";
import React, { useState } from "react";
import MonthSchedule, { MonthScheduleItem } from "./_components/month";
import {
  MonthScheduleListItem,
  monthSchedules,
} from "@/types/normal/schedule/month";
import { format } from "date-fns";

const Page = () => {
  const [activeId, setActiveId] = useState<number | null>(null);
  const activeItem = monthSchedules.find((item) => item.monthSeq === activeId);

  /**
   * 드래그 종료
   */
  const handleDragEnd = (e: DragEndEvent) => {
    console.log("드롭!");
    console.log(e);
    console.log(e.over === null);
    if (e.over === null || !e.active) return;
    //월간일정 -> 일간일정 등록요청 로직
    console.log("전송 데이터");
    console.log("월간일정 시퀀스 : ", e.active.data.current?.id);
    console.log(
      "월간일정 데이터 : ",
      monthSchedules.find((item) => item.monthSeq === e.active.data.current?.id)
    );
    console.log(
      "변경날짜 : ",
      e.over?.data.current
        ? format(new Date(e.over?.data.current as Date), "yyyy-MM-dd")
        : null
    );
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
    <>
      <AppTitle title="일정" />
      <DndContext
        onDragEnd={handleDragEnd}
        onDragStart={handleDragStart}
        // autoScroll={false} 반응형 시 스크롤이 필요함
      >
        <div className="flex flex-col xl:flex-row gap-12 h-screen min-h-0">
          <DroppableCalendar />
          <MonthSchedule />
        </div>
        <DragOverlay className="bg-blue-50  p-2 border border-[var(--border)] rounded-[4px]">
          {activeId && activeItem ? (
            <MonthScheduleItem data={activeItem} isDrag={true} />
          ) : null}
        </DragOverlay>
      </DndContext>
    </>
  );
};

export default Page;
