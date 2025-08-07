"use client";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

import { format, getHours, getMinutes, isSameHour } from "date-fns";
import { CalendarIcon } from "lucide-react";
import React from "react";
import SimpleCalendar from "./simple-calendar";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface CustomDatetimePickerProps {
  value: Date | null;
  onChange: (date: Date) => void;
  setHour?: boolean;
}

const CustomDatetimePicker = ({
  value,
  onChange,
  setHour = false,
}: CustomDatetimePickerProps) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const hours = Array.from({ length: 24 }, (_, i) => i);

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      onChange(selectedDate);
    }
  };

  const handleTimeChange = (type: "hour" | "minute", newValue: string) => {
    if (value) {
      const newDate = new Date(value);
      if (type === "hour") {
        newDate.setHours(parseInt(newValue));
      } else if (type === "minute") {
        newDate.setMinutes(parseInt(newValue));
      }

      onChange(newDate);
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen} modal={true}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            `justify-start text-sm font-normal px-3 py-1 h-9 rounded-[4px] border border-[var(--border)] transition-[border,box-shadow] duration-300 bg-white
        hover:border-[var(--primary)] hover:cursor-pointer
        focus:outline-none focus:ring-1 focus:ring-[var(--primary)] focus:border-[var(--primary)] focus:ring-inset `,
            !value && "text-lightgray-50"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4 text-[var(--placeholder)]" />
          {value ? (
            setHour === true ? (
              format(value, "yyyy/MM/dd HH:mm")
            ) : (
              format(value, "yyyy/MM/dd")
            )
          ) : setHour === true ? (
            <span className="text-sm font-normal text-[var(--placeholder)]">
              년/월/일 시:분
            </span>
          ) : (
            <span className="text-sm font-normal text-[var(--placeholder)]">
              년/월/일
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-fit p-0 overflow-y-hidden h-full bg-white">
        <div className="flex h-full">
          <SimpleCalendar defaultValue={value} onSelect={handleDateSelect} />
          {setHour === true ? (
            <div className="flex flex-col sm:flex-row sm:h-[300px] divide-y sm:divide-y-0 sm:divide-x">
              <ScrollArea className="w-64 sm:w-auto">
                <div className="flex sm:flex-col p-2">
                  {hours.map((hour, i) => {
                    return (
                      <div
                        key={i}
                        className={`flex justify-center items-center aspect-square shrink-0 text-xs w-9 h-9  hover:cursor-pointer hover:bg-gray-200 dark:hover:bg-[#535353] ${
                          value &&
                          hour.toString() === getHours(value).toString()
                            ? "bg-blue-100 dark:bg-[#535353]"
                            : ""
                        }`}
                        onClick={() =>
                          handleTimeChange("hour", hour.toString())
                        }
                      >
                        {hour}
                      </div>
                    );
                  })}
                </div>

                <ScrollBar orientation="horizontal" className="sm:hidden" />
              </ScrollArea>

              <ScrollArea className="w-64 sm:w-auto">
                <div className="flex sm:flex-col p-2">
                  {Array.from({ length: 12 }, (_, i) => i * 5).map((m, i) => (
                    <div
                      key={i}
                      className={`flex justify-center items-center aspect-square shrink-0 text-xs w-9 h-9 p-2 hover:cursor-pointer hover:bg-gray-200 dark:hover:bg-[#535353] ${
                        value && m.toString() === getMinutes(value).toString()
                          ? "bg-blue-100 dark:bg-[#535353]"
                          : ""
                      }`}
                      onClick={() => handleTimeChange("minute", m.toString())}
                    >
                      {m.toString().padStart(2, "0")}
                    </div>
                  ))}
                </div>

                <ScrollBar orientation="horizontal" className="sm:hidden" />
              </ScrollArea>
            </div>
          ) : null}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default CustomDatetimePicker;
