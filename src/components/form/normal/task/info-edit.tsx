"use client";
import Button from "@/components/common/button";
import CheckFormItem, {
  MultiCheckBoxFormItem,
} from "@/components/common/form-input/check-field";
import { DateFormItem } from "@/components/common/form-input/date-field";
import { TextFormItem } from "@/components/common/form-input/text-field";
import { Form, FormField } from "@/components/ui/form";
import useDateValidation from "@/hooks/date/useDateSet";
import { useDecodeParam } from "@/hooks/params";
import { useTaskDetailStore } from "@/store/normal/task/detail-task";
import { SelectOption } from "@/types/common/select-item";

import { zodResolver } from "@hookform/resolvers/zod";
import { isSameDay } from "date-fns";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

const formSchema = z.object({
  title: z.string("업무명을 입력해주세요."),
  termType: z.number(),
  startDt: z.string(),
  endDt: z.string().nullable(),
  repeat: z.string(),
});

type TaskInfoEditType = z.infer<typeof formSchema>;

const TaskInfoEditForm = ({
  onSubmit,
}: {
  onSubmit: (values: TaskInfoEditType) => void;
}) => {
  const { taskDetail } = useTaskDetailStore();

  const form = useForm<TaskInfoEditType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      termType: 0,
      startDt: new Date().toString(),
      endDt: new Date().toString(),
      repeat: "0",
    },
  });
  /**
   * termType 2(이하 타입) - 기간인경우, 타입을 0-매일로 변경하면
   * DB에 start,endDT가 초기화되지않아 다시 기간으로 변경하는 경우 초기값으로 이전값이 나옴
   */

  useEffect(() => {
    if (!taskDetail) return;
    form.reset({
      title: taskDetail.title,
      termType: taskDetail.termType,
      startDt: taskDetail.startDt.toString(),
      endDt: taskDetail.endDt?.toString() ?? taskDetail.startDt.toString(),
      repeat: taskDetail.repeats.toString(),
    });
    // if (taskDetail.termType === 0) setEveryDay(true);
  }, [taskDetail]);

  const { handleDateChange } = useDateValidation({
    form,
    startFieldName: "startDt",
    endFieldName: "endDt",
    dateOnly: true,
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="px-6 flex flex-col gap-6 w-full"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <TextFormItem
              label="업무명"
              placeholder="업무명"
              {...field}
              required
            />
          )}
        />
        <FormField
          control={form.control}
          name="repeat"
          render={({ field }) => (
            <TextFormItem
              label="반복횟수"
              placeholder="반복횟수"
              type="number"
              min={1}
              {...field}
              required
            />
          )}
        />
        <FormField
          control={form.control}
          name="termType"
          render={({ field }) => {
            const checklist: SelectOption[] = [
              {
                key: "매일",
                value: 0,
              },
              {
                key: "특정일",
                value: 1,
              },
              {
                key: "기간",
                value: 2,
              },
            ];
            const handleChange = (value: number) => {
              field.onChange(value);
              if (value !== 2) {
                form.setValue("endDt", null);
                return;
              }
              if (value === 2) {
                form.setValue("endDt", form.getValues("startDt"));
              }
            };
            return (
              <MultiCheckBoxFormItem
                label="업무주기"
                data={checklist}
                {...field}
                value={field.value.toString()}
                onChange={(e) => handleChange(parseInt(e.target.value))}
                required
              />
            );
          }}
        />
        <FormField
          name="startDt"
          control={form.control}
          render={({ field }) => {
            const handleChange = (date: Date) => {
              handleDateChange("start", date, field.onChange);
              const endDt = form.getValues("endDt");

              if (!endDt) return;

              if (isSameDay(date, endDt)) {
                form.setValue("termType", 1);
                return;
              }

              form.setValue("termType", 2);
            };
            return (
              <DateFormItem
                label="시작일"
                value={new Date(field.value)}
                onChange={handleChange}
                required
              />
            );
          }}
        />
        {form.watch("termType") === 2 ? (
          <FormField
            name="endDt"
            control={form.control}
            render={({ field }) => {
              const handleChange = (date: Date) => {
                handleDateChange("end", date, field.onChange);
                const startDt = form.getValues("startDt");

                if (isSameDay(date, startDt)) {
                  form.setValue("termType", 1);
                  return;
                }
                form.setValue("termType", 2);
              };
              return (
                <DateFormItem
                  label="종료일"
                  value={field.value ? new Date(field.value) : new Date()}
                  onChange={handleChange}
                  required
                />
              );
            }}
          />
        ) : null}
        <Button label="저장" />
      </form>
    </Form>
  );
};

export default TaskInfoEditForm;
