import { DateFormItem } from "@/components/common/form-input/date-field";
import { TextFormItem } from "@/components/common/form-input/text-field";
import CommonFormContainer from "@/components/ui/custom/form/form-container";
import { FormField } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";

import React from "react";
import { useForm } from "react-hook-form";
import z from "zod";

const formSchema = z.object({
  buildingName: z.string().min(1, "건축물명을 입력해주세요."),
  completeDt: z.date("준공일을 입력해주세요."),
  address: z.string().min(1, "주소를 입력해주세요."),
  totalArea: z.string().min(1, "연면적을 입력해주세요."),
  usage: z.string().min(1, "건물용도를 입력해주세요."),
  selfParkingSpaces: z.number().min(0, "0이상만 입력해주세요."),
  autoParkingSpaces: z.number().min(0, "0이상만 입력해주세요."),
  handicapParkingSpaces: z.number().min(0, "0이상만 입력해주세요."),
});

type BuildingInfoAddFormType = z.infer<typeof formSchema>;

interface BuildingInfoAddFormProps {
  onNext: (data: Record<string, any>) => void;
}

const BuildingInfoAddForm = ({ onNext }: BuildingInfoAddFormProps) => {
  const form = useForm<BuildingInfoAddFormType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      buildingName: "",
      completeDt: undefined,
      address: "",
      totalArea: "",
      usage: "",
      selfParkingSpaces: 0,
      autoParkingSpaces: 0,
      handicapParkingSpaces: 0,
    },
  });

  return (
    <CommonFormContainer
      title="건축물정보"
      form={form}
      nextLabel="생성"
      onNext={onNext}
    >
      <div className="flex flex-col gap-6 xl:grid xl:grid-cols-2 xl: gap-x-24 xl:gap-y-12 ">
        <FormField
          control={form.control}
          name="buildingName"
          render={({ field }) => (
            <TextFormItem label="명칭" placeholder="명칭" {...field} required />
          )}
        />
        <FormField
          control={form.control}
          name="completeDt"
          render={({ field }) => {
            return (
              <DateFormItem
                label="준공일"
                value={field.value}
                onChange={field.onChange}
                required
              />
            );
          }}
        />
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <TextFormItem label="주소" placeholder="주소" {...field} required />
          )}
        />
        <FormField
          control={form.control}
          name="totalArea"
          render={({ field }) => (
            <TextFormItem
              label="연면적"
              placeholder="연면적"
              {...field}
              required
            />
          )}
        />
        <FormField
          control={form.control}
          name="usage"
          render={({ field }) => (
            <TextFormItem
              label="건물용도"
              placeholder="건물용도"
              {...field}
              required
            />
          )}
        />
      </div>
      <div className="base-flex-col gap-6 !h-auto">
        <span className="text-md font-bold">주차장</span>
        <div className=" flex flex-col gap-6 xl:flex xl:flex-row xl:gap-12">
          <FormField
            control={form.control}
            name="selfParkingSpaces"
            render={({ field }) => (
              <TextFormItem
                label="자주식"
                placeholder="자주식"
                type="number"
                {...field}
                onChange={(e) => {
                  const value =
                    e.target.value === "" ? 0 : Number(e.target.value);
                  field.onChange(value);
                }}
              />
            )}
          />
          <FormField
            control={form.control}
            name="autoParkingSpaces"
            render={({ field }) => (
              <TextFormItem
                label="기계식"
                placeholder="기계식"
                type="number"
                {...field}
                onChange={(e) => {
                  const value =
                    e.target.value === "" ? 0 : Number(e.target.value);
                  field.onChange(value);
                }}
              />
            )}
          />
          <FormField
            control={form.control}
            name="handicapParkingSpaces"
            render={({ field }) => (
              <TextFormItem
                label="장애인"
                placeholder="장애인"
                type="number"
                {...field}
                onChange={(e) => {
                  const value =
                    e.target.value === "" ? 0 : Number(e.target.value);
                  field.onChange(value);
                }}
              />
            )}
          />
        </div>
      </div>
    </CommonFormContainer>
  );
};

export default BuildingInfoAddForm;
