import SelectFormItem from "@/components/common/form-input/select-field";
import CommonFormContainer from "@/components/ui/custom/form/form-container";
import { FormField } from "@/components/ui/form";
import { useAuthStore } from "@/store/auth/auth-store";
import { useTaskStore } from "@/store/normal/task/task-store";
import { convertSelectOptionType } from "@/utils/convert";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

const formSchema = z.object({
  serviceTypeSeq: z.number("업무유형을 선택해주세요."),
});

type TaskTypeFormType = z.infer<typeof formSchema>;

const DailyTaskAddForm = ({
  onNext,
}: {
  onNext: (values: Record<string, any>) => void;
}) => {
  const { enteredWorkplace } = useAuthStore();
  const { createTask } = useTaskStore();
  const form = useForm<TaskTypeFormType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      serviceTypeSeq: createTask.serviceTypeSeq,
    },
  });

  useEffect(() => {
    console.log(createTask);
  }, [createTask]);

  return (
    <CommonFormContainer
      form={form}
      title="업무정보"
      nextLabel="다음"
      onNext={onNext}
    >
      <div>
        <FormField
          control={form.control}
          name="serviceTypeSeq"
          render={({ field }) => {
            const handleValue = (value: string) => {
              if (!value) return;
              field.onChange(parseInt(value));
            };
            return (
              <SelectFormItem
                label="유형"
                value={field.value?.toString()}
                onValueChange={handleValue}
                selectItem={convertSelectOptionType(
                  enteredWorkplace?.contracts ?? []
                )}
              />
            );
          }}
        />
      </div>
    </CommonFormContainer>
  );
};

export default DailyTaskAddForm;
