"use client";
import Button from "@/components/common/button";
import {
  AlarmTimeFormItem,
  DateFormItem,
} from "@/components/common/form-input/date-field";
import SelectFormItem, {
  SelectColorFormItem,
} from "@/components/common/form-input/select-field";
import {
  TextAreaFormItem,
  TextFormItem,
} from "@/components/common/form-input/text-field";
import { Form, FormField } from "@/components/ui/form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import useDateValidation from "@/hooks/date/useDateSet";
import { useAuthStore } from "@/store/auth/auth-store";
import { useScheduleStore } from "@/store/normal/schedule/shcedule-store";
import { convertSelectOptionType } from "@/utils/convert";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import z from "zod";

const AddSchema = z.object({
  serviceTypeSeq: z.number("업무 유형을 선택해주세요.").min(1),
  title: z.string().min(1, "제목을 입력하세요."),
  description: z.string(),
  isAllDay: z.boolean(),
  startDt: z.date(),
  endDt: z.date(),
  alarmYn: z.boolean(),
  alarmDt: z.string().nullable(),
  alarmMin: z.number().nullable(),
  alarmOffSetDays: z.number(),
  viewColor: z.string().min(1, "색상을 선택해주세요."),
  // files: z.array(z.instanceof(File)),
});

type AddFormType = z.infer<typeof AddSchema>;

interface DayAddFormProps {
  focusDate?: Date;
  isOption?: boolean;
  onClose: () => void;
}

const DayScheduleAddForm = ({
  focusDate,
  isOption = false,
  onClose,
}: DayAddFormProps) => {
  const { postAddSchedule } = useScheduleStore();
  const router = useRouter();
  const { enteredWorkplace } = useAuthStore();
  const form = useForm<AddFormType>({
    resolver: zodResolver(AddSchema),
    defaultValues: {
      serviceTypeSeq: undefined,
      title: "",
      description: "",
      isAllDay: false,
      startDt: focusDate ?? new Date(),
      endDt: focusDate ?? new Date(),
      alarmYn: false,
      alarmDt: null,
      alarmMin: 0,
      alarmOffSetDays: 0,
      viewColor: "",
      // files: [],
    },
  });

  //알람 상수
  const alarmTime = [
    {
      value: 10,
      label: "10분 전",
    },
    {
      value: 30,
      label: "30분 전",
    },
    {
      value: 60,
      label: "1시간 전",
    },
    {
      value: 1,
      label: "하루 전",
    },
  ];

  const handleSubmit = async (values: AddFormType) => {
    const payload = {
      ...values,
      startDt: format(values.startDt, "yyyy-MM-dd'T'HH:mm:ss"), // "2025-11-05 09:00:00"
      endDt: format(values.endDt, "yyyy-MM-dd'T'HH:mm:ss"),
    };
    console.log(values);
    await postAddSchedule(payload);
    onClose();
  };

  const { handleDateChange } = useDateValidation({
    form,
    startFieldName: "startDt",
    endFieldName: "endDt",
  });

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-4 w-full"
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="px-6 h-full">
            <div className="flex flex-col gap-4 h-full pb-1">
              {enteredWorkplace?.contracts ? (
                <FormField
                  control={form.control}
                  name="serviceTypeSeq"
                  render={({ field }) => {
                    const handleValue = (value: string) => {
                      field.onChange(Number(value));
                    };

                    return (
                      <SelectFormItem
                        label="업무 유형"
                        selectItem={convertSelectOptionType(
                          enteredWorkplace.contracts ?? []
                        )}
                        onValueChange={handleValue}
                        value={field.value?.toString()}
                        required
                      />
                    );
                  }}
                />
              ) : null}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <TextFormItem
                    label="제목"
                    placeholder="제목"
                    {...field}
                    required
                  />
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <TextAreaFormItem
                    label="설명"
                    className="h-20"
                    placeholder="설명"
                    {...field}
                  />
                )}
              />

              <div className="flex gap-6">
                <FormField
                  control={form.control}
                  name="isAllDay"
                  render={({ field }) => {
                    //종일선택 시 날짜 값 초기화
                    const handleAllDay = (values: boolean) => {
                      if (values) {
                        form.setValue("startDt", new Date());
                        form.setValue("endDt", new Date());
                      }

                      field.onChange(values);
                    };

                    return (
                      <div className="flex flex-col gap-2">
                        <span className="text-xs text-[var(--description-light)]">
                          종일
                        </span>
                        <div className="flex-1 flex items-center">
                          <Switch
                            className="ring ring-[var(--border)]  hover:cursor-pointer data-[state=checked]:bg-blue-500 data-[state=unchecked]:bg-[var(--background)] [&_[data-slot=switch-thumb]]:bg-white focus-visible:ring-0 focus-visible:outline-none"
                            checked={field.value}
                            onCheckedChange={handleAllDay}
                          />
                        </div>
                      </div>
                    );
                  }}
                />
                <FormField
                  control={form.control}
                  name="startDt"
                  render={({ field }) => {
                    const allDay = !form.watch("isAllDay");
                    return (
                      <DateFormItem
                        label="시작"
                        value={field.value}
                        onChange={(date) => {
                          console.log(date);
                          handleDateChange("start", date, field.onChange);
                        }}
                        setHour={allDay}
                        required
                      />
                    );
                  }}
                />
                <FormField
                  control={form.control}
                  name="endDt"
                  render={({ field }) => {
                    const allDay = !form.watch("isAllDay");
                    return (
                      <DateFormItem
                        label="종료"
                        value={field.value}
                        onChange={(date) =>
                          handleDateChange("end", date, field.onChange)
                        }
                        setHour={allDay}
                      />
                    );
                  }}
                />
              </div>

              <FormField
                control={form.control}
                name="alarmDt"
                render={({ field }) => {
                  const handleValue = (value: string) => {
                    field.onChange(Number(value));
                  };

                  return (
                    <AlarmTimeFormItem
                      label="알람"
                      value={field.value}
                      onChange={field.onChange}
                      isAlarm={form.watch("alarmYn")}
                      onAlarmChange={(alarm) => {
                        form.setValue("alarmYn", alarm);
                        if (!alarm) field.onChange(null);
                        else {
                          field.onChange("08:00:00");
                        }
                      }}
                      offsetDay={form.watch("alarmOffSetDays")}
                      onOffsetDayChange={(day) =>
                        form.setValue("alarmOffSetDays", day)
                      }
                    />
                  );
                }}
              />
              <FormField
                control={form.control}
                name="viewColor"
                render={({ field }) => (
                  <SelectColorFormItem
                    label="색상"
                    value={field.value}
                    onChange={field.onChange}
                    required
                  />
                )}
              />
            </div>
          </ScrollArea>
        </div>

        <div className="shrink-0 px-6">
          <Button label="생성" />
        </div>
      </form>
    </Form>
  );
};

export default DayScheduleAddForm;
