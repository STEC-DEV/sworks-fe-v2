import { FormControl, FormItem, FormMessage } from "@/components/ui/form";
import CustomDatetimePicker from "../date-input/date-picker";
import { useState } from "react";
import IconButton from "../icon-button";
import Button from "../button";
import Input from "../input";
import { SelectOption } from "@/types/common/select-item";
import SelectFormItem from "./select-field";
import { BaseSelect } from "../select-input";

interface DateFormItemProps {
  label?: string;
  value: Date | null;
  required?: boolean;
  setHour?: boolean;
  onChange: (date: Date) => void;
}

export const DateFormItem = ({
  label,
  value,
  onChange,
  setHour = false,
  required = false,
}: DateFormItemProps) => {
  return (
    <FormItem className="gap-2 w-full">
      <div className="flex">
        {label ? (
          <span className="text-xs text-[var(--description-light)]">
            {label}
          </span>
        ) : null}
        {required ? <span className="text-xs text-red-500">*</span> : null}
      </div>
      <FormControl>
        <CustomDatetimePicker
          value={value}
          onChange={(date) => onChange(date)}
          setHour={setHour}
        />
      </FormControl>
      <FormMessage className="text-xs text-red-500" />
    </FormItem>
  );
};

/**
 * 일정 알람 시간 설정 form
 */

interface AlarmTimeFormItemProps {
  label?: string;
  value: string | null;
  isAlarm: boolean;
  offsetDay: number;
  onAlarmChange: (alarm: boolean) => void;
  onChange: (time: string) => void;
  onOffsetDayChange: (day: number) => void;
  required?: boolean;
  setHour?: boolean;
}

export const AlarmTimeFormItem = ({
  label,
  value,
  isAlarm,
  offsetDay,
  onChange,
  onAlarmChange,
  onOffsetDayChange,
  required,
}: AlarmTimeFormItemProps) => {
  const handleHour = (hour: string) => {
    if (value === null) return;
    const [_, minute] = value?.split(":");
    onChange(`${hour}:${minute}`);
  };
  const handleMinute = (minute: string) => {
    if (value === null) return;
    const [hour, _] = value?.split(":");
    onChange(`${hour}:${minute}`);
  };

  return (
    <FormItem>
      <div className="flex">
        {label ? (
          <span className="text-xs text-[var(--description-light)]">
            {label}
          </span>
        ) : null}
        {required ? <span className="text-xs text-red-500">*</span> : null}
      </div>
      <FormControl>
        {isAlarm ? (
          <div className="flex  items-center gap-6">
            <div className="flex-1 flex flex-col gap-2 justify-center">
              <div className="flex gap-2 items-center">
                <Input
                  type="number"
                  value={offsetDay}
                  min={0}
                  max={28}
                  step={1}
                  onChange={(e) => onOffsetDayChange(parseInt(e.target.value))}
                />
                <span className="text-sm text-[var(--description-dark)]">
                  일 전
                </span>
              </div>

              <div className="flex items-center gap-2">
                <BaseSelect
                  value={value?.split(":")[0] ?? ""}
                  onValueChange={handleHour}
                  selectItem={hours}
                />
                <span>:</span>
                <BaseSelect
                  value={value?.split(":")[1] ?? ""}
                  onValueChange={handleMinute}
                  selectItem={minutes}
                />
              </div>
            </div>

            <IconButton icon="X" onClick={() => onAlarmChange(!isAlarm)} />
          </div>
        ) : (
          <div>
            <Button
              type="button"
              label="알람 추가"
              variant={"secondary"}
              size={"sm"}
              onClick={() => onAlarmChange(!isAlarm)}
            />
          </div>
        )}
      </FormControl>
    </FormItem>
  );
};

const hours: SelectOption[] = [
  ...Array.from(Array(24), (_, i) => {
    const data: SelectOption = {
      key: i.toString().padStart(2, "0"),
      value: i.toString().padStart(2, "0"),
    };
    return data;
  }),
];

const minutes: SelectOption[] = [
  ...Array.from(Array(12), (_, i) => {
    const value = i * 5;

    const data: SelectOption = {
      key: value.toString().padStart(2, "0"),
      value: value.toString().padStart(2, "0"),
    };
    return data;
  }),
];
