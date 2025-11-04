"use client";
import Button from "@/components/common/button";
import { DateFormItem } from "@/components/common/form-input/date-field";
import {
  TextAreaFormItem,
  TextFormItem,
} from "@/components/common/form-input/text-field";
import { Form, FormField } from "@/components/ui/form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useDecodeParam } from "@/hooks/params";
import { useEquipmentHistoryDetailStore } from "@/store/normal/equipment/history/detail-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import React, { Dispatch, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast, Toaster } from "sonner";
import z from "zod";

const formInputSchema = z.object({
  detailSeq: z.number().min(1, "관리이력을 선택해주세요."),
  detailDt: z.date("날짜를 선택하세요."),
  contents: z.string("내용을 입력하세요."),
  remark: z.string(),
});

const formOutputSchema = formInputSchema.extend({
  detailDt: z.string(),
});

export type HistoryEditInputType = z.infer<typeof formInputSchema>; // Date
export type HistoryEditOutputType = z.infer<typeof formOutputSchema>;

interface HistoryEditProps {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const HistoryEdit = ({ setOpen }: HistoryEditProps) => {
  const { historyDetail, patchUpdateHistoryDetail, getHistoryDetail } =
    useEquipmentHistoryDetailStore();
  const form = useForm<HistoryEditInputType>({
    resolver: zodResolver(formInputSchema),
    defaultValues: {
      detailSeq: 0,
      detailDt: new Date(),
      contents: "",
      remark: "",
    },
  });

  useEffect(() => {
    if (!historyDetail?.detailSeq) return;
    form.reset({
      detailSeq: historyDetail.detailSeq,
      detailDt: new Date(historyDetail.detailDt),
      contents: historyDetail.contents,
      remark: historyDetail.remark,
    });
  }, [form, historyDetail]);

  const handleSubmit = async (values: HistoryEditInputType) => {
    const submitData: HistoryEditOutputType = {
      ...values,
      detailDt: format(values.detailDt, "yyyy-MM-dd"),
    };
    await patchUpdateHistoryDetail(submitData);
    await getHistoryDetail(values.detailSeq.toString());
    setOpen(false);
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col gap-6 w-full"
      >
        <ScrollArea className="overflow-hidden">
          <div className="flex flex-col gap-6 px-6 pb-1">
            <FormField
              name="detailDt"
              control={form.control}
              render={({ field }) => (
                <DateFormItem
                  label="관리일"
                  value={field.value}
                  onChange={(date) => field.onChange(date)}
                  required
                />
              )}
            />
            <FormField
              control={form.control}
              name="remark"
              render={({ field }) => (
                <TextFormItem label="비고" placeholder="비고" {...field} />
              )}
            />
            <FormField
              control={form.control}
              name="contents"
              render={({ field }) => (
                <TextAreaFormItem
                  label="내용"
                  placeholder="내용"
                  {...field}
                  required
                />
              )}
            />
          </div>
        </ScrollArea>
        <div className="px-6 shrink-0">
          <Button label="저장" />
        </div>
      </form>
    </Form>
  );
};

export default HistoryEdit;
