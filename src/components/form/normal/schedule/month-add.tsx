import Button from "@/components/common/button";
import SelectFormItem from "@/components/common/form-input/select-field";
import {
  TextAreaFormItem,
  TextFormItem,
} from "@/components/common/form-input/text-field";
import { Form, FormField } from "@/components/ui/form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuthStore } from "@/store/auth/auth-store";
import { useScheduleStore } from "@/store/normal/schedule/shcedule-store";
import { convertSelectOptionType } from "@/utils/convert";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { useSearchParams } from "next/navigation";
import React, { Suspense, useEffect } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

const AddSchema = z.object({
  serviceTypeSeq: z.number("업무유형을 선택해주세요."),
  planTitle: z.string().min(1, "제목을 입력해주세요."),
  description: z.string(),
  planDt: z.string(),
});

type AddFormType = z.infer<typeof AddSchema>;

const MonthAddForm = ({ onClose }: { onClose: () => void }) => {
  const { enteredWorkplace } = useAuthStore();
  const { postAddMonthSchedule } = useScheduleStore();
  const searchParams = useSearchParams();
  const form = useForm<AddFormType>({
    resolver: zodResolver(AddSchema),
    defaultValues: {
      serviceTypeSeq: undefined,
      planTitle: "",
      description: "",
      planDt: format(new Date(), "yyyy-MM-dd"),
    },
  });

  useEffect(() => {
    const year = searchParams.get("year");
    const month = searchParams.get("month");

    if (!year || !month) {
      form.setValue("planDt", format(new Date(), "yyyy-MM-dd"));
    } else {
      form.setValue(
        "planDt",
        format(new Date(parseInt(year), parseInt(month) - 1, 1), "yyyy-MM-dd")
      );
    }
  }, [searchParams]);

  useEffect(() => {
    const data = form.watch("planDt");
    console.log(data);
  }, [form]);

  const handleSubmit = async (values: AddFormType) => {
    await postAddMonthSchedule(values);
    onClose();
  };

  return (
    <Suspense>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="w-full flex flex-col gap-6"
        >
          <ScrollArea className="overflow-hidden px-6">
            <div className="flex flex-col gap-6">
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
                name="planTitle"
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
            </div>
          </ScrollArea>
          <div className="shrink-0 px-6">
            <Button label="생성" />
          </div>
        </form>
      </Form>
    </Suspense>
  );
};

export default MonthAddForm;
