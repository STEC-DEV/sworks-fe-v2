"use client";
import Button from "@/components/common/button";
import { DateFormItem } from "@/components/common/form-input/date-field";
import FileFormItem from "@/components/common/form-input/file-field";
import SelectFormItem from "@/components/common/form-input/select-field";
import { TextFormItem } from "@/components/common/form-input/text-field";
import { Form, FormField } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import useDateValidation from "@/hooks/date/useDateSet";
import { useAuthStore } from "@/store/auth/auth-store";
import { useBasicStore } from "@/store/basic-store";
import {
  convertKeyValueArrayToRecord,
  convertSelectOptionType,
} from "@/utils/convert";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React, { useActionState, useCallback } from "react";
import { useForm } from "react-hook-form";
import z, { iso } from "zod";

const AddSchema = z.object({
  serviceTypeSeq: z.number("업무 유형을 선택해주세요.").min(1),
  schTitle: z.string().min(1, "제목을 입력하세요."),
  description: z.string(),
  isAllDay: z.boolean(),
  startDt: z.date().nullable(),
  endDt: z.date().nullable(),
  alarmYn: z.boolean(),
  alarmDt: z.string().nullable(),
  alarmMin: z.number().nullable(),
  alarmOffSetDays: z.number(),
  viewColor: z.string(),
  files: z.array(z.instanceof(File)),
});

type AddFormType = z.infer<typeof AddSchema>;

interface DayAddFormProps {
  focusDate?: Date;
  isOption?: boolean;
}

const DayScheduleAddForm = ({
  focusDate,
  isOption = false,
}: DayAddFormProps) => {
  const router = useRouter();
  const { enteredWorkplace } = useAuthStore();
  const form = useForm<AddFormType>({
    resolver: zodResolver(AddSchema),
    defaultValues: {
      serviceTypeSeq: undefined,
      schTitle: "",
      description: "",
      isAllDay: false,
      startDt: focusDate ?? new Date(),
      endDt: null,
      alarmYn: false,
      alarmDt: "",
      alarmMin: 0,
      alarmOffSetDays: 0,
      viewColor: "",
      files: [],
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

  const handleSubmit = (values: AddFormType) => {
    console.log(values);
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
                  defaultValue={field.value?.toString()}
                  required
                />
              );
            }}
          />
        ) : null}
        <FormField
          control={form.control}
          name="schTitle"
          render={({ field }) => (
            <TextFormItem label="제목" placeholder="제목" {...field} required />
          )}
        />
        {isOption ? (
          <>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <TextFormItem label="설명" placeholder="설명" {...field} />
              )}
            />
            <FormField
              control={form.control}
              name="isAllDay"
              render={({ field }) => {
                //종일선택 시 날짜 값 초기화
                const handleAllDay = (values: boolean) => {
                  if (values) {
                    form.setValue("startDt", new Date());
                    form.setValue("endDt", null);
                  }

                  field.onChange(values);
                };

                return (
                  <div className="flex flex-col gap-2">
                    <span className="text-xs text-[var(--description-light)]">
                      종일
                    </span>
                    <Switch
                      className="ring ring-[var(--border)]  hover:cursor-pointer data-[state=checked]:bg-blue-500 data-[state=unchecked]:bg-[var(--background)] [&_[data-slot=switch-thumb]]:bg-white focus-visible:ring-0 focus-visible:outline-none"
                      checked={field.value}
                      onCheckedChange={handleAllDay}
                    />
                  </div>
                );
              }}
            />
            {!form.watch("isAllDay") ? (
              <>
                <FormField
                  control={form.control}
                  name="startDt"
                  render={({ field }) => (
                    <DateFormItem
                      label="시작"
                      value={field.value}
                      onChange={(date) =>
                        handleDateChange("start", date, field.onChange)
                      }
                      setHour
                    />
                  )}
                />
                <FormField
                  control={form.control}
                  name="endDt"
                  render={({ field }) => (
                    <DateFormItem
                      label="종료"
                      value={field.value}
                      onChange={(date) =>
                        handleDateChange("end", date, field.onChange)
                      }
                      setHour
                    />
                  )}
                />
              </>
            ) : null}
            <FormField
              control={form.control}
              name="alarmMin"
              render={({ field }) => {
                const handleValue = (value: string) => {
                  field.onChange(Number(value));
                };

                return (
                  <SelectFormItem
                    label="알람"
                    selectItem={convertSelectOptionType(alarmTime)}
                    onValueChange={handleValue}
                    defaultValue={field.value?.toString()}
                  />
                );
              }}
            />
            <FormField
              control={form.control}
              name="files"
              render={({ field }) => (
                <FileFormItem
                  label="첨부파일"
                  accept="accept"
                  multiple={true}
                  {...field}
                  value={field.value}
                  onChange={field.onChange}
                  isVertical={true}
                />
              )}
            />
          </>
        ) : null}

        {isOption ? null : (
          <Button
            label="More options"
            variant={"secondary"}
            size={"sm"}
            type="button"
            onClick={() => router.push("/schedule/add")}
          />
        )}

        <Button label="생성" />
      </form>
    </Form>
  );
};

export default DayScheduleAddForm;
