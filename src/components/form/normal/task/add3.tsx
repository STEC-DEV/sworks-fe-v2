import { MultiCheckBoxFormItem } from "@/components/common/form-input/check-field";
import { DateFormItem } from "@/components/common/form-input/date-field";
import { TextFormItem } from "@/components/common/form-input/text-field";
import CommonFormContainer from "@/components/ui/custom/form/form-container";
import { FormField, FormItem } from "@/components/ui/form";
import useDateValidation from "@/hooks/date/useDateSet";
import { useTaskStore } from "@/store/normal/task/task-store";
import { SelectOption } from "@/types/common/select-item";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import React from "react";
import { useForm } from "react-hook-form";
import z from "zod";

const formSchema = z.object({
  termType: z
    .number("업무주기를 선택해주세요.")
    .min(0, "업무주기를 선택해주세요."),
  startDt: z.date("날짜를 선택해주세요."),
  endDt: z.date().nullable(),
  title: z.string("업무명을 입력해주세요.").min(1, "업무명을 입력해주세요."),
  repeat: z
    .number("최소 1회 이상 입력해주세요.")
    .min(1, "최소 1회 이상 입력해주세요."),
});

type TaskInfoAddFormType = z.infer<typeof formSchema>;

const TaskInfoAddForm = ({
  onNext,
  onPrev,
}: {
  onNext: (values: Record<string, any>) => void;
  onPrev: () => void;
}) => {
  const { createTask } = useTaskStore();
  const form = useForm<TaskInfoAddFormType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: createTask.title,
      startDt: new Date(createTask.startDt),
      endDt: createTask.endDt ? new Date(createTask.endDt) : null,
      termType: createTask.termType,
      repeat: createTask.repeat,
    },
  });

  //start, end 날짜 sync 맞춰주는 hooks
  const { handleDateChange } = useDateValidation({
    form,
    startFieldName: "startDt",
    endFieldName: "endDt",
  });

  const handleSubmit = (values: TaskInfoAddFormType) => {
    const payload = {
      ...values,
      startDt: format(values.startDt, "yyyy-MM-dd"),
      ...(values.termType === 2 && {
        endDt: format(values.endDt!, "yyyy-MM-dd"),
      }),
    };

    onNext(payload);
  };

  return (
    <CommonFormContainer
      form={form}
      title="업무내용"
      nextLabel="생성"
      onPrev={onPrev}
      onNext={handleSubmit}
    >
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-x-24 gap-y-12">
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
          control={form.control}
          name="startDt"
          render={({ field }) => {
            const handleChange = (date: Date) => {
              if (form.watch("termType") === 2) {
                handleDateChange("start", date, field.onChange);
                return;
              }

              field.onChange(date);
            };
            return (
              <DateFormItem
                label="시작일"
                value={field.value}
                onChange={(date) => {
                  handleChange(date);
                }}
                required
              />
            );
          }}
        />
        {form.watch("termType") === 2 ? (
          <FormField
            control={form.control}
            name="endDt"
            render={({ field }) => {
              const handleChange = (date: Date) => {
                if (form.watch("termType") === 2) {
                  handleDateChange("end", date, field.onChange);
                }
              };
              return (
                <DateFormItem
                  label="종료일"
                  value={field.value}
                  onChange={(date) => {
                    handleChange(date);
                  }}
                  required
                />
              );
            }}
          />
        ) : null}
        <FormField
          control={form.control}
          name="repeat"
          render={({ field }) => (
            <TextFormItem
              label="반복횟수"
              placeholder="반복횟수"
              type="number"
              {...field}
              value={field.value === 0 ? "" : field.value}
              onChange={(e) => {
                const value =
                  e.target.value === "" ? 0 : parseInt(e.target.value) || 0;
                field.onChange(value);
              }}
              required
            />
          )}
        />
      </div>
    </CommonFormContainer>
  );
};

export default TaskInfoAddForm;
