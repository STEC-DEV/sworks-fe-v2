import { DateFormItem } from "@/components/common/form-input/date-field";
import FileFormItem from "@/components/common/form-input/file-field";
import { TextFormItem } from "@/components/common/form-input/text-field";

import CommonFormContainer from "@/components/ui/custom/form/form-container";
import { FormField } from "@/components/ui/form";
import useDateValidation from "@/hooks/date/useDateSet";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import z from "zod";

const formSchema = z.object({
  facilityType: z.number(),
  contents: z.string("내용을 입력해주세요."),
  startDt: z.date(),
  endDt: z.date().nullable(),
  company: z.string(),
  tel: z
    .string()
    .min(9, { message: "자릿수를 확인해주세요." })
    .max(11, { message: "자릿수를 확인해주세요." }),
  price: z.string(),
  files: z.array(z.instanceof(File)),
});

export type basicFormType = z.infer<typeof formSchema>;

interface RnMAddFormProps {
  onNext: (values: basicFormType) => void;
}

const RnMAddForm = ({ onNext }: RnMAddFormProps) => {
  const form = useForm<basicFormType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      facilityType: 0,
      contents: "",
      startDt: new Date(),
      endDt: null,
      company: "",
      tel: "",
      price: "",
      files: [],
    },
  });

  const { handleDateChange } = useDateValidation({
    form,
    startFieldName: "startDt",
    endFieldName: "endDt",
  });

  return (
    <CommonFormContainer
      title="기본정보"
      form={form}
      nextLabel="생성"
      onNext={onNext}
    >
      <div className="grid grid-cols-2 gap-x-24 gap-y-12">
        <FormField
          control={form.control}
          name="facilityType"
          render={({ field }) => (
            <TextFormItem label="유형" placeholder="유형" {...field} />
          )}
        />
        <FormField
          control={form.control}
          name="contents"
          render={({ field }) => (
            <TextFormItem label="내용" placeholder="내용" {...field} />
          )}
        />
        <FormField
          control={form.control}
          name="startDt"
          render={({ field }) => (
            <DateFormItem
              label="시작일"
              value={field.value}
              onChange={(date) =>
                handleDateChange("start", date, field.onChange)
              }
            />
          )}
        />
        <FormField
          control={form.control}
          name="endDt"
          render={({ field }) => (
            <DateFormItem
              label="해약일"
              value={field.value}
              onChange={(date) => handleDateChange("end", date, field.onChange)}
            />
          )}
        />
        <FormField
          control={form.control}
          name="company"
          render={({ field }) => (
            <TextFormItem label="업체" placeholder="업체" {...field} />
          )}
        />
        <FormField
          control={form.control}
          name="tel"
          render={({ field }) => (
            <TextFormItem label="연락처" placeholder="연락처" {...field} />
          )}
        />
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <TextFormItem label="비용" placeholder="비용" {...field} />
          )}
        />
      </div>
      <FormField
        control={form.control}
        name="files"
        render={({ field }) => <FileFormItem label="첨부파일" {...field} />}
      />
    </CommonFormContainer>
  );
};

export default RnMAddForm;
