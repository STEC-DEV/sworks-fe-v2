import { DateFormItem } from "@/components/common/form-input/date-field";
import FileFormItem from "@/components/common/form-input/file-field";
import SelectFormItem from "@/components/common/form-input/select-field";
import { TextFormItem } from "@/components/common/form-input/text-field";

import CommonFormContainer from "@/components/ui/custom/form/form-container";
import { FormField } from "@/components/ui/form";
import useDateValidation from "@/hooks/date/useDateSet";
import { useDecodeParam } from "@/hooks/params";
import { useBasicStore } from "@/store/basic-store";
import { BasicCode } from "@/types/common/basic-code";
import { convertSelectOptionType } from "@/utils/convert";

import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

export const facilityAddFormSchema = z.object({
  facilityCodeSeq: z.number("관리 유형을 선택해주세요.").min(1),
  description: z.string("내용을 입력해주세요.").min(1, "내용을 입력해주세요."),
  fromDt: z.date(),
  toDt: z.date().nullable(),
  constractor: z.string(),
  tel: z
    .string()
    .refine(
      (val) => !val || (val.length >= 9 && val.length <= 11),
      "전화번호를 올바르게 입력해주세요."
    ),
  cost: z.string(),
  files: z.array(z.instanceof(File)),
});

export type FacilityAddFormType = z.infer<typeof facilityAddFormSchema>;

interface RnMAddFormProps {
  onNext: (values: FacilityAddFormType) => void;
}

const RnMAddForm = ({ onNext }: RnMAddFormProps) => {
  const { decodeValue } = useDecodeParam("type");
  const { basicCode } = useBasicStore();
  const [code, setCode] = useState<BasicCode[]>();

  useEffect(() => {
    switch (decodeValue) {
      case "R&M":
        setCode(basicCode.rnmCodes);
        break;
      case "M&O":
        setCode(basicCode.mnoCodes);
        break;
      case "MRO":
        setCode(basicCode.mroCodes);
        break;
    }
  }, [decodeValue]);

  const form = useForm<FacilityAddFormType>({
    resolver: zodResolver(facilityAddFormSchema),
    defaultValues: {
      facilityCodeSeq: undefined,
      description: "",
      fromDt: new Date(),
      toDt: null,
      constractor: "",
      tel: "",
      cost: "",
      files: [],
    },
  });

  const { handleDateChange } = useDateValidation({
    form,
    startFieldName: "fromDt",
    endFieldName: "toDt",
  });

  return (
    <CommonFormContainer
      title="기본정보"
      form={form}
      nextLabel="생성"
      onNext={onNext}
    >
      <div className="grid xl:grid-cols-2 gap-x-24 gap-y-12">
        {basicCode.typeCodes ? (
          <FormField
            control={form.control}
            name="facilityCodeSeq"
            render={({ field }) => {
              const handleValue = (value: string) => {
                field.onChange(Number(value));
              };
              return (
                <SelectFormItem
                  label="유형"
                  selectItem={convertSelectOptionType(code ?? [])}
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
          name="description"
          render={({ field }) => (
            <TextFormItem label="내용" placeholder="내용" {...field} required />
          )}
        />
        <FormField
          control={form.control}
          name="fromDt"
          render={({ field }) => (
            <DateFormItem
              label={decodeValue === "MRO" ? "반입일" : "시작일"}
              value={field.value}
              onChange={(date) =>
                handleDateChange("start", date, field.onChange)
              }
              required
            />
          )}
        />
        {decodeValue !== "MRO" ? (
          <FormField
            control={form.control}
            name="toDt"
            render={({ field }) => (
              <DateFormItem
                label="해약일"
                value={field.value}
                onChange={(date) =>
                  handleDateChange("end", date, field.onChange)
                }
              />
            )}
          />
        ) : null}

        <FormField
          control={form.control}
          name="constractor"
          render={({ field }) => (
            <TextFormItem label="업체" placeholder="업체" {...field} required />
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
          name="cost"
          render={({ field }) => (
            <TextFormItem label="비용" placeholder="비용" {...field} />
          )}
        />
      </div>
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
          />
        )}
      />
    </CommonFormContainer>
  );
};

export default RnMAddForm;
