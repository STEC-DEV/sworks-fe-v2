import { ChevronLeft, ChevronRight } from "lucide-react";
// import { useCalendar } from "./useCalendar";
// import dayjs from "dayjs";
import { useCallback, useEffect, useState } from "react";
import {
  addMonths,
  addYears,
  format,
  getYear,
  isSameMonth,
  setYear,
  subMonths,
  subYears,
} from "date-fns";
import { useCalendar } from "./useCalendarV2";

interface SimpleCalendarProps {
  defaultValue?: Date;
  onSelect: (date: Date) => void;
}

const SimpleCalendar = ({ defaultValue, onSelect }: SimpleCalendarProps) => {
  const [viewMode, setViewMode] = useState<"day" | "year">("day");
  const { weeks, curDate, focusDate, setCurDate, onFocusDate } =
    useCalendar(defaultValue);

  useEffect(() => {
    if (!defaultValue) return;
    onFocusDate(defaultValue);
  }, []);

  const handleDateClick = (date: Date) => {
    onFocusDate(date);
    onSelect(date); // 실제 클릭 시에만 호출
  };

  const handlePrevMonth = useCallback(() => {
    setCurDate((prev) => subMonths(prev, 1));
  }, [setCurDate]);

  const handleNextMonth = useCallback(() => {
    setCurDate((prev) => addMonths(prev, 1));
  }, [setCurDate]);

  const handlePrevYear = useCallback(() => {
    setCurDate((prev) => subYears(prev, 9));
  }, [setCurDate]);

  const handleNextYear = useCallback(() => {
    setCurDate((prev) => addYears(prev, 9));
  }, [setCurDate]);

  const handleYearClick = (year: number) => {
    setCurDate((prev) => setYear(prev, year));
    setViewMode("day");
  };

  const handleViewMode = () => {
    viewMode === "day" ? setViewMode("year") : setViewMode("day");
  };

  return (
    <div className="flex flex-col gap-2 pb-2">
      <div className="flex-shrink-0">
        {/* 헤더는 고정 크기 */}
        <SimpleCalendarHeader
          date={curDate}
          onNextMonth={viewMode === "day" ? handleNextMonth : handleNextYear}
          onPrevMonth={viewMode === "day" ? handlePrevMonth : handlePrevYear}
          onViewMode={handleViewMode}
        />
      </div>
      <div className="flex-1  px-2">
        {/* 나머지 공간, 최소높이 0 */}
        {viewMode === "day" ? (
          <SimpleCalendarDay
            weeks={weeks}
            viewDate={curDate}
            focusDate={focusDate}
            onFocusDate={handleDateClick}
          />
        ) : (
          <SimpleCalendarYear date={curDate} onYearClick={handleYearClick} />
        )}
      </div>
    </div>
  );
};

/**
 * 달력 헤더
 */
interface SimpleCalendarHeaderProps {
  date: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onViewMode: () => void;
}

const SimpleCalendarHeader = ({
  date,
  onNextMonth,
  onPrevMonth,
  onViewMode,
}: SimpleCalendarHeaderProps) => {
  return (
    <div className="flex justify-between p-2 ">
      <div
        className="flex items-center p-1 justify-center hover:cursor-pointer hover:bg-gray-200"
        onClick={onPrevMonth}
      >
        <ChevronLeft className="w-5 h-5 text-gray-500" />
      </div>
      <div
        className="flex-1 flex justify-center items-center text-sm hover:bg-[var(--background)] cursor-pointer rounded-[4px]"
        onClick={onViewMode}
      >
        {/* {dayjs(date).format("YYYY")}.{dayjs(date).format("MM")} */}
        {`${format(date, "yyyy")}.${format(date, "MM")}`}
      </div>
      <div
        className="flex items-center justify-center p-1 hover:cursor-pointer  hover:bg-gray-200"
        onClick={onNextMonth}
      >
        <ChevronRight className="w-5 h-5 text-gray-500" />
      </div>
    </div>
  );
};

/**
 * 달력 내용
 */
interface RenderDaysProps {
  weeks: Date[][];
  viewDate: Date;
  focusDate: Date;
  onFocusDate: (date: Date) => void;
}

const SimpleCalendarDay = ({
  weeks,
  viewDate,
  focusDate,
  onFocusDate,
}: RenderDaysProps) => {
  const labels = ["일", "월", "화", "수", "목", "금", "토"];
  return (
    <div className="flex flex-col h-full ">
      <div className="flex ">
        {labels.map((l, i) => {
          return (
            <div
              key={i}
              className="flex-1 text-center flex items-center justify-center py-1  first:text-red-500 last:text-red-500  "
            >
              <span className="text-xs ">{l}</span>
            </div>
          );
        })}
      </div>
      <div className="flex flex-col gap-1">
        {weeks.map((w, i) => (
          <div key={i} className="flex flex-1">
            {w.map((d, i) => {
              return (
                <DayBox
                  key={i}
                  day={d}
                  viewDate={viewDate}
                  focusDate={focusDate}
                  onClick={() => onFocusDate(d)}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * 달력 일 박스
 * @param param0
 * @returns
 */
const DayBox = ({
  day,
  viewDate,
  focusDate,
  ...props
}: {
  day: Date;
  viewDate: Date;
  focusDate: Date;
} & React.HTMLProps<HTMLDivElement>) => {
  return (
    <div
      className={`flex-1  overflow-hidden w-8 h-8 text-xs flex items-center justify-center hover:cursor-pointer hover:bg-gray-200 dark:hover:bg-[#535353]
        ${
          format(focusDate, "yyyy/MM/dd") === format(day, "yyyy/MM/dd")
            ? "bg-blue-100 dark:bg-[#535353]"
            : null
        } ${!isSameMonth(day, viewDate) ? "text-gray-400" : ""}
        `}
      {...props}
    >
      {format(day, "dd")}
    </div>
  );
};

export default SimpleCalendar;

/**
 * 연도 선택 컴포넌트
 */
interface SimpleCalendarYearProps {
  date: Date; // 현재 선택된 날짜
  onYearClick: (year: number) => void; // 연도 클릭 시 콜백
}
const SimpleCalendarYear = ({ date, onYearClick }: SimpleCalendarYearProps) => {
  const currentYear = getYear(date);
  const yearRangeStart = currentYear - 4;

  const years = Array.from({ length: 9 }, (_, i) => yearRangeStart + i);

  const yearRows = [years.slice(0, 3), years.slice(3, 6), years.slice(6, 9)];

  return (
    <div className="flex flex-col gap-1 px-2" style={{ width: "224px" }}>
      {" "}
      {/* ✅ 전체 너비 고정 */}
      {yearRows.map((row, rowIndex) => (
        <div key={rowIndex} className="flex gap-1">
          {row.map((year) => (
            <div
              key={year}
              className={`flex-1 h-16 flex items-center justify-center 
                hover:cursor-pointer hover:bg-gray-200 dark:hover:bg-[#535353]
                text-sm rounded
                ${year === currentYear ? "bg-blue-100 dark:bg-[#535353] font-medium" : ""}
              `}
              onClick={() => onYearClick(year)}
            >
              {year}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};
