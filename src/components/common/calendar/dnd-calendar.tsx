"use client";
import { DragEndEvent, useDroppable } from "@dnd-kit/core";
import { format, isSameDay, isSameMonth } from "date-fns";
import React, { useCallback, useEffect, useMemo, useState } from "react";
// import { useCalendar } from "../date-input/useCalendar";
import IconButton from "../icon-button";
import { useRouter, useSearchParams } from "next/navigation";
import BaseDialog from "@/components/ui/custom/base-dialog";
import DayScheduleAddForm from "@/components/form/normal/schedule/day-add";
import ScheduleItem, { ExtendedSchedule } from "./schedule-item";
import { DaySchedule } from "@/types/normal/schedule/day-schedule";
import { useDecodeParam } from "@/hooks/params";
import {
  useCalendar,
  useCalendarNavigation,
} from "../date-input/useCalendarV2";
import { useScheduleStore } from "@/store/normal/schedule/shcedule-store";

interface DroppableCalendarProps {}

export const DroppableCalendar = ({}: DroppableCalendarProps) => {
  const { getDaySchedule } = useScheduleStore();
  const searchParams = useSearchParams();

  const calendarParams = useMemo(() => {
    const year = searchParams.get("year");
    const month = searchParams.get("month");
    const newDate =
      year && month
        ? new Date(parseInt(year), parseInt(month) - 1)
        : new Date();

    return newDate;
  }, [searchParams]);

  const { weeks, curDate, focusDate, onFocusDate } =
    useCalendar(calendarParams);
  const { onNext, onPrev } = useCalendarNavigation(curDate);

  const handleDate = useCallback((date: Date) => {
    onFocusDate(date);
  }, []);

  const getData = useCallback(() => {
    const year = searchParams.get("year");
    const month = searchParams.get("month");
    if (!year || !month) {
      const date = new Date();
      getDaySchedule(`${format(date, "yyyy")}-${format(date, "MM")}`);
    } else {
      getDaySchedule(`${year}-${month}`);
    }
  }, [searchParams, getDaySchedule]);
  useEffect(() => {
    getData();
  }, [getData]);

  const handleDragEnd = (e: DragEndEvent) => {
    console.log(e);
    if (e.over && e.over.id) {
      console.log(e.over.id);
    }
  };

  return (
    <div className="w-full h-auto xl:h-full flex flex-col gap-2  min-w-0">
      <CalendarHeader
        date={curDate}
        focusDate={focusDate}
        onNextMonth={onNext}
        onPrevMonth={onPrev}
        onGetData={getData}
      />
      <div className="w-full h-full border-y border-[var(--border)] rounded-[4px]">
        <CalendarContent
          weeks={weeks}
          focusDate={focusDate}
          curDate={curDate}
          onClickDay={handleDate}
        />
      </div>
    </div>
  );
};

interface CalendarHeaderProps {
  //현재 보이는 월
  date: Date;
  focusDate: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onGetData: () => void;
}

const CalendarHeader = ({
  date,
  focusDate,
  onNextMonth,
  onPrevMonth,
  onGetData,
}: CalendarHeaderProps) => {
  const [open, setOpen] = useState<boolean>(false);

  const handleData = () => {
    setOpen(false);
    onGetData();
  };
  return (
    <div className="flex items-center justify-between">
      <CalendarRemote
        date={date}
        onNextMonth={onNextMonth}
        onPrevMonth={onPrevMonth}
      />
      <div>
        <BaseDialog
          title="일정 생성"
          triggerChildren={<IconButton icon="Plus" />}
          open={open}
          setOpen={setOpen}
        >
          <DayScheduleAddForm focusDate={focusDate} onClose={handleData} />
        </BaseDialog>
      </div>
    </div>
  );
};
interface CalendarRemoteProps {
  //현재 보이는 월
  date: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
}
const CalendarRemote = ({
  date,

  onNextMonth,
  onPrevMonth,
}: CalendarRemoteProps) => {
  return (
    <div className="flex gap-4 items-center">
      <IconButton
        icon="ChevronLeft"
        size={24}
        onClick={onPrevMonth}
        className=" stroke-[1.5]"
      />
      <span className="text-lg tabular-nums">{format(date, "yyyy / MM")}</span>
      <IconButton
        icon="ChevronRight"
        size={24}
        onClick={onNextMonth}
        className=" stroke-[1.5]"
      />
    </div>
  );
};

interface CalendarContentProps {
  weeks: Date[][];
  curDate: Date;
  focusDate: Date;
  onClickDay: (date: Date) => void;
}

const CalendarContent = ({
  weeks,
  curDate,
  focusDate,
  onClickDay,
}: CalendarContentProps) => {
  const { schedules } = useScheduleStore();
  const labels = ["일", "월", "화", "수", "목", "금", "토"];

  //날짜별로 그룹화
  const schedulesByDate = useMemo(() => {
    if (!schedules) return {};
    return schedules.reduce((acc, schedule) => {
      const dateKey = format(new Date(schedule.dates), "yyyy-MM-dd");
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(schedule);
      return acc;
    }, {} as Record<string, typeof schedules>);
  }, [schedules]);

  return (
    <div className="flex flex-col  w-full h-[60vh] xl:h-full">
      <div className="flex border-b border-x border-[var(--border)]">
        {labels.map((l, i) => (
          <div
            className="flex-1 flex items-center justify-center border-r border-[var(--border)] last:border-r-0 first:text-red-500 last:text-red-500 "
            key={i}
          >
            <span className="text-sm ">{l}</span>
          </div>
        ))}
      </div>
      {weeks.map((w, i) => (
        <div key={i} className="flex-1 flex border-b last:border-none min-w-0">
          {w.map((d, j) => (
            <DayBox
              date={d}
              schedules={schedulesByDate[format(d, "yyyy-MM-dd")]}
              key={j}
              curDate={curDate}
              focusDate={focusDate}
              onClick={onClickDay}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

interface DayBoxProps extends Omit<React.HTMLProps<HTMLDivElement>, "onClick"> {
  date: Date;
  schedules: DaySchedule[];
  focusDate: Date;
  curDate: Date;
  onClick: (date: Date) => void;
}

/**
 * 달력 일박스
 * @returns
 */
export const DayBox = ({
  date,
  focusDate,
  schedules,
  curDate,
  onClick,
  ...props
}: DayBoxProps) => {
  // const { schedules } = useScheduleStore();
  //   useEffect(() => {
  //     console.log("컴포넌트 날짜 : ", format(date, "yyyy-MM-dd"), date);
  //     console.log("현재 날짜 : ", format(curDate, "yyyy-MM-dd"), curDate);
  //     console.log("클릭 날짜 : ", format(focusDate, "yyyy-MM-dd"), focusDate);
  //     console.log(date == focusDate);
  //   }, [date, focusDate, curDate]);
  const { setNodeRef, isOver } = useDroppable({
    id: `droppable ${format(date, "yyyy-MM-dd")}`,
    data: date,
  });

  return (
    <div
      className={`flex-1   h-full p-1 overflow-hidden min-w-0
         border-r border--[var(--border)] first:border-l
         
  
         first:text-red-500 last:text-red-500 
         ${isOver ? "shadow-[inset_0_0_0_1px_rgb(239,68,68)] bg-red-50" : ""}
    ${
      isSameDay(date, focusDate)
        ? "shadow-[inset_0_0_0_1px_rgb(59,130,246)] bg-blue-50"
        : ""
    }
    
     `}
      ref={setNodeRef}
      onClick={() => onClick(date)}
      {...props}
    >
      <span
        className={`tabular-nums flex items-center justify-center w-fit text-sm  rounded-full aspect-square mb-2 leading-0 p-1 
            ${isSameDay(date, new Date()) ? "text-white bg-primary" : ""}
            ${!isSameMonth(date, curDate) ? "text-gray-400" : ""}
         `}
      >
        {format(date, "dd")}
      </span>

      {/* 일정 영역 */}
      <div onClick={(e) => e.stopPropagation()} className="flex flex-col gap-1">
        {/* {daySchedules.map((s, i) =>
          isSameDay(date, s.dates) ? <ScheduleItem key={i} data={s} /> : null
        )} */}
        {schedules
          ? schedules.map((s, i) =>
              isSameDay(date, s.dates) && i < 3 ? (
                <ScheduleItem key={i} data={s} />
              ) : null
            )
          : null}
        {schedules && schedules.length > 3 ? (
          <ExtendedSchedule schedules={schedules} day={format(date, "dd")} />
        ) : null}
      </div>
    </div>
  );
};
