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
import { MonthScheduleListItem } from "@/types/normal/schedule/month";
import { convertSelectOptionType } from "@/utils/convert";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { useSearchParams } from "next/navigation";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

const EditSchema = z.object({
  planSeq: z.number(),
  serviceTypeSeq: z.number("업무유형을 선택해주세요."),
  planTitle: z.string().min(1, "제목을 입력해주세요."),
  description: z.string(),
  planDt: z.string(),
});

type EditFormType = z.infer<typeof EditSchema>;

const MonthEditForm = ({
  data,
  onClose,
}: {
  data: MonthScheduleListItem;
  onClose: () => void;
}) => {
  const { enteredWorkplace } = useAuthStore();
  const { patchUpdateMonthSchedule } = useScheduleStore();
  const searchParams = useSearchParams();
  const form = useForm<EditFormType>({
    resolver: zodResolver(EditSchema),
    defaultValues: {
      planSeq: undefined,
      serviceTypeSeq: undefined,
      planTitle: "",
      description: "",
      planDt: format(new Date(), "yyyy-MM-dd"),
    },
  });

  useEffect(() => {
    if (!data) return;
    form.reset({
      planSeq: data.planSeq,
      serviceTypeSeq: data.serviceTypeSeq,
      planTitle: data.planTitle,
      description: data.description ?? "",
    });
  }, [data, form]);

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

  const handleSubmit = async (values: EditFormType) => {
    await patchUpdateMonthSchedule(values);
    onClose();
  };

  return (
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
                    if (!value) return;
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
          <Button label="저장" />
        </div>
      </form>
    </Form>
  );
};

export default MonthEditForm;
