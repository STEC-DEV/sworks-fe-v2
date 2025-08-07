import { useMemo, useState } from "react";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  getMonth,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";

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
  //현재 날짜
  const [curDate, setCurDate] = useState<Date>(data);
  //현재 클릭한 날
  const [focusDate, setFocusDate] = useState<Date>(curDate);

  //월에 속한 주 생성
  const generateWeekForMonth = useMemo(() => {
    console.log(curDate);
    //해당 월
    const month = getMonth(curDate);

    //현재 월 시작일
    const startDayOfMonth = startOfMonth(curDate);
    //현재 월 마지막일
    const endDayOfMonth = endOfMonth(curDate);
    // console.log(
    //   "시작일 : ",
    //   startDayOfMonth,
    //   dayjs(startDayOfMonth).format("YYYY-MM-DD")
    // );
    // console.log(
    //   "종료일 : ",
    //   endDayOfMonth,
    //   dayjs(endDayOfMonth).format("YYYY-MM-DD")
    // );

    //달력에 표시될 전체 범위 (이전달일부 + 이번달 + 다음달 일부)
    const displayStartDay = startOfWeek(startDayOfMonth, { weekStartsOn: 0 });
    const displayEndDay = endOfWeek(endDayOfMonth, { weekStartsOn: 0 });

    //해당월의 전체 일
    const allDaysOfMonth = eachDayOfInterval({
      start: displayStartDay,
      end: displayEndDay,
    });
    // console.log(
    //   `${month + 1}월에 표시될 전체 일 : `,
    //   allDaysOfMonth.map((d) => {
    //     return dayjs(d).format("YYYY-MM-DD");
    //   })
    // );

    //1주씩 그룹화
    const weeks = [];

    for (let i = 0; i < allDaysOfMonth.length; i += 7) {
      const week = allDaysOfMonth.slice(i, i + 7);
      weeks.push(week);
    }

    return weeks;
  }, [curDate]);

  //이전달
  const handlePrevMonth = () => {
    setCurDate((prev) => subMonths(prev, 1));
  };
  //다음달
  const handleNextMonth = () => {
    setCurDate((prev) => addMonths(prev, 1));
  };

  return {
    weeks: generateWeekForMonth,
    curDate: curDate,
    focusDate: focusDate,
    onPrevMonth: handlePrevMonth,
    onNextMonth: handleNextMonth,
    onFocusDate: setFocusDate,
  };
};
