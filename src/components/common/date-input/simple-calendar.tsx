import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCalendar } from "./useCalendar";
// import dayjs from "dayjs";
import { useEffect } from "react";
import { format, isSameMonth } from "date-fns";

interface SimpleCalendarProps {
  defaultValue?: Date | null;
  onSelect: (date: Date) => void;
}

const SimpleCalendar = ({ defaultValue, onSelect }: SimpleCalendarProps) => {
  const { weeks, curDate, focusDate, onNext, onPrev, onFocusDate } =
    useCalendar(defaultValue ?? new Date());

  useEffect(() => {
    if (!defaultValue) return;
    onFocusDate(defaultValue);
  }, []);

  const handleDateClick = (date: Date) => {
    onFocusDate(date);
    onSelect(date); // 실제 클릭 시에만 호출
  };

  return (
    <div className="flex flex-col gap-2 pb-2">
      <div className="flex-shrink-0">
        {/* 헤더는 고정 크기 */}
        <SimpleCalendarHeader
          date={curDate}
          onNextMonth={onNext}
          onPrevMonth={onPrev}
        />
      </div>
      <div className="flex-1  px-2">
        {/* 나머지 공간, 최소높이 0 */}
        <SimpleCalendarDay
          weeks={weeks}
          viewDate={curDate}
          focusDate={focusDate}
          onFocusDate={handleDateClick}
        />
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
}

const SimpleCalendarHeader = ({
  date,
  onNextMonth,
  onPrevMonth,
}: SimpleCalendarHeaderProps) => {
  return (
    <div className="flex justify-between p-2 ">
      <div
        className="flex items-center p-1 justify-center hover:cursor-pointer hover:bg-gray-200"
        onClick={onPrevMonth}
      >
        <ChevronLeft className="w-5 h-5 text-gray-500" />
      </div>
      <span className="flex items-center text-sm">
        {/* {dayjs(date).format("YYYY")}.{dayjs(date).format("MM")} */}
        {`${format(date, "yyyy")}.${format(date, "MM")}`}
      </span>
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
