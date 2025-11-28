"use client";
import { DateFormItem } from "@/components/common/form-input/date-field";
import SelectFormItem from "@/components/common/form-input/select-field";
import { TextFormItem } from "@/components/common/form-input/text-field";
import CommonFormContainer from "@/components/ui/custom/form/form-container";
import { FormField } from "@/components/ui/form";
import useDateValidation from "@/hooks/date/useDateSet";
import { useWorkplaceDetailContractStore } from "@/store/admin/workplace/contract-store";

import { convertSelectOptionType } from "@/utils/convert";

import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "next/navigation";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

const formSchema = z.object({
  contractTypeSeq: z.number("계약유형을 선택해주세요."),
  contractManager: z.string(),
  contractStaff: z.string(),
  startDt: z.date(),
  endDt: z.date().nullable(),
  contractAmount: z.number(),
  comments: z.string(),
});

export type basicFormType = z.infer<typeof formSchema>;

interface ContractAddFormProps {
  onPrev?: () => void;
  onNext: (values: basicFormType) => void;
}

const ContractAddForm = ({ onNext }: ContractAddFormProps) => {
  const { workplaceContractTypeList, getWorkplaceServiceType } =
    useWorkplaceDetailContractStore();
  const { id } = useParams();
  const form = useForm<basicFormType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      contractTypeSeq: undefined,
      contractManager: "",
      contractStaff: "",
      startDt: new Date(),
      endDt: null,
      contractAmount: 0,
      comments: "",
    },
  });

  useEffect(() => {
    if (!id) return;
    getWorkplaceServiceType(id?.toString());
  }, []);

  useEffect(() => {
    console.log(workplaceContractTypeList);
  }, [workplaceContractTypeList]);

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
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-x-24 gap-y-12">
        {workplaceContractTypeList ? (
          <FormField
            control={form.control}
            name="contractTypeSeq"
            render={({ field }) => {
              const handleValue = (value: string) => {
                field.onChange(Number(value));
              };
              return (
                <SelectFormItem
                  label="유형"
                  selectItem={convertSelectOptionType(
                    workplaceContractTypeList
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
          name="contractManager"
          render={({ field }) => (
            <TextFormItem label="담당자" placeholder="담당자" {...field} />
          )}
        />
        <FormField
          control={form.control}
          name="startDt"
          render={({ field }) => (
            <DateFormItem
              label="계약일"
              value={field.value}
              onChange={(date) =>
                handleDateChange("start", date, field.onChange)
              }
              required
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
          name="contractStaff"
          render={({ field }) => (
            <TextFormItem label="인원" placeholder="인원" {...field} />
          )}
        />
        <FormField
          control={form.control}
          name="contractAmount"
          render={({ field }) => {
            const handleValue = (value: string) => {
              console.log(value);
              field.onChange(Number(value));
            };
            return (
              <TextFormItem
                label="금액"
                placeholder="금액"
                type="number"
                {...field}
                onChange={(e) => handleValue(e.target.value)}
              />
            );
          }}
        />
      </div>
    </CommonFormContainer>
  );
};

export default ContractAddForm;
