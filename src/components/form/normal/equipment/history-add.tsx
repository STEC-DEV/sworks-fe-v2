import { DateFormItem } from "@/components/common/form-input/date-field";
import {
  TextAreaFormItem,
  TextFormItem,
} from "@/components/common/form-input/text-field";
import AppTitle from "@/components/common/label/title";
import {
  CommonFormContainer,
  FormCard,
} from "@/components/layout/form/form-container";

import { FormField } from "@/components/ui/form";
import { useDecodeParam } from "@/hooks/params";
import { zodResolver } from "@hookform/resolvers/zod";
import { format, sub } from "date-fns";
import { useParams } from "next/navigation";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

const formInputSchema = z.object({
  equipSeq: z.number().min(1, "장비를 선택해주세요."),
  detailDt: z.date("날짜를 선택하세요."),
  contents: z.string("내용을 입력하세요."),
  remark: z.string(),
});

const formOutputSchema = formInputSchema.extend({
  detailDt: z.string(),
});

export type HistoryAddFormType = z.infer<typeof formInputSchema>; // Date
export type HistoryAddType = z.infer<typeof formOutputSchema>;

interface EquipmentHistoryAddFormProps {
  onNext: (values: HistoryAddType) => void;
}

const EquipmentHistoryAddForm = ({ onNext }: EquipmentHistoryAddFormProps) => {
  const { rawValue } = useDecodeParam("id");
  const form = useForm<HistoryAddFormType>({
    resolver: zodResolver(formInputSchema),
    defaultValues: {
      equipSeq: 0,
      detailDt: new Date(),
      contents: "",
      remark: "",
    },
  });

  useEffect(() => {
    if (!rawValue) return;
    form.reset({
      equipSeq: parseInt(rawValue),
      detailDt: new Date(),
      contents: "",
      remark: "",
    });
  }, [form, rawValue]);

  const handleSubmit = async (values: HistoryAddFormType) => {
    const submitData: HistoryAddType = {
      ...values,
      detailDt: format(values.detailDt, "yyyy-MM-dd"),
    };
    onNext(submitData);
  };
  return (
    <CommonFormContainer form={form} onNext={handleSubmit} nextLabel="생성">
      <AppTitle title="관리이력 생성" isPrev />
      <FormCard title="기본정보">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 xl:gap-x-12">
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
        </div>
      </FormCard>

      <FormCard title="내용">
        <FormField
          control={form.control}
          name="contents"
          render={({ field }) => (
            <TextAreaFormItem
              label="내용"
              placeholder="내용을 입력해주세요."
              {...field}
              required
            />
          )}
        />
      </FormCard>
    </CommonFormContainer>
  );
};

export default EquipmentHistoryAddForm;
