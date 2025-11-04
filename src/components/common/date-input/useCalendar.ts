import { useEffect, useMemo, useState } from "react";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  getMonth,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import { useRouter, useSearchParams } from "next/navigation";
import { useEvent } from "@dnd-kit/utilities";

const DAY_LIST = ["일", "월", "화", "수", "목", "금", "토"];
const DAY_OF_WEEK = 7;
const MAX_DAY_OF_MONTH = 42;

/**
 * Return
 *
 *
 * @param data
 */
export const useCalendar = (data: Date) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  //현재 날짜
  const [curDate, setCurDate] = useState<Date>(data);
  //현재 클릭한 날
  const [focusDate, setFocusDate] = useState<Date>(data);

  // useEffect(() => {
  //   console.log("data 변경됨:", format(data, "yyyy-MM-dd"));
  //   setCurDate(data);
  // }, [data]);

  //월에 속한 주 생성
  const generateWeekForMonth = useMemo(() => {
    // console.log("월에 속한 월생성");
    // console.log(curDate);
    //해당 월
    const month = getMonth(curDate);

    //현재 월 시작일
    const startDayOfMonth = startOfMonth(curDate);
    //현재 월 마지막일
    const endDayOfMonth = endOfMonth(curDate);

    //달력에 표시될 전체 범위 (이전달일부 + 이번달 + 다음달 일부)
    const displayStartDay = startOfWeek(startDayOfMonth, { weekStartsOn: 0 });
    const displayEndDay = endOfWeek(endDayOfMonth, { weekStartsOn: 0 });

    //해당월의 전체 일
    const allDaysOfMonth = eachDayOfInterval({
      start: displayStartDay,
      end: displayEndDay,
    });

    //1주씩 그룹화
    const weeks = [];

    for (let i = 0; i < allDaysOfMonth.length; i += 7) {
      const week = allDaysOfMonth.slice(i, i + 7);
      weeks.push(week);
    }

    return weeks;
  }, [curDate]);

  const handlePrev = () => {
    setCurDate((prev) => subMonths(prev, 1));
  };

  const handleNext = () => {
    setCurDate((prev) => addMonths(prev, 1));
  };

  //이전달
  const handlePrevMonth = () => {
    // setCurDate((prev) => subMonths(prev, 1));
    const prevMonth = subMonths(curDate, 1);
    const params = new URLSearchParams(searchParams.toString());
    params.set("year", format(prevMonth, "yyyy"));
    params.set("month", format(prevMonth, "MM"));
    router.push(`?${params.toString()}`);
  };
  //다음달
  const handleNextMonth = () => {
    // setCurDate((prev) => addMonths(prev, 1));
    const nextMonth = addMonths(curDate, 1);
    const params = new URLSearchParams(searchParams.toString());
    params.set("year", format(nextMonth, "yyyy"));
    params.set("month", format(nextMonth, "MM"));
    router.push(`?${params.toString()}`);
  };

  return {
    weeks: generateWeekForMonth,
    curDate: curDate,
    focusDate: focusDate,
    onPrev: handlePrev,
    onNext: handleNext,
    onPrevMonth: handlePrevMonth,
    onNextMonth: handleNextMonth,
    onFocusDate: setFocusDate,
  };
};
