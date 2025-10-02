"use client";
import Button from "@/components/common/button";
import { DateFormItem } from "@/components/common/form-input/date-field";
import { TextFormItem } from "@/components/common/form-input/text-field";
import { Form, FormField } from "@/components/ui/form";
import { useBuildingStore } from "@/store/normal/building/building";
import { Construction } from "@/types/normal/building/building";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

const formSchema = z.object({
  buildingSeq: z.number(),
  buildingName: z.string(),
  completeDt: z.date(),
  address: z.string(),
  totalArea: z.string(),
  usage: z.string(),
  selfParkingSpaces: z.number(),
  autoParkingSpaces: z.number(),
  handicapParkingSpaces: z.number(),
});

type ConstructionEditFormType = z.infer<typeof formSchema>;

interface ConstructionEditFormProps {
  data: Construction;
  onSubmit: (values: ConstructionEditFormType) => void;
}

const ConstructionEditForm = ({
  data,
  onSubmit,
}: ConstructionEditFormProps) => {
  const form = useForm<ConstructionEditFormType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      buildingSeq: undefined,
      buildingName: "",
      completeDt: new Date(),
      address: "",
      totalArea: "",
      usage: "",
      selfParkingSpaces: 0,
      autoParkingSpaces: 0,
      handicapParkingSpaces: 0,
    },
  });

  useEffect(() => {
    if (!form) return;
    form.reset({
      buildingSeq: data.buildingSeq,
      buildingName: data.buildingName,
      completeDt: data.completeDt,
      address: data.address,
      totalArea: data.totalArea,
      usage: data.usage,
      selfParkingSpaces: data.selfParkingSpaces,
      autoParkingSpaces: data.autoParkingSpaces,
      handicapParkingSpaces: data.handicapParkingSpaces,
    });
  }, [form, data]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="base-flex-col gap-6"
      >
        <FormField
          control={form.control}
          name="buildingName"
          render={({ field }) => (
            <TextFormItem label="명칭" placeholder="명칭" {...field} />
          )}
        />
        <FormField
          control={form.control}
          name="completeDt"
          render={({ field }) => (
            <DateFormItem
              label="준공일"
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <TextFormItem label="주소" placeholder="주소" {...field} />
          )}
        />
        <FormField
          control={form.control}
          name="totalArea"
          render={({ field }) => (
            <TextFormItem label="연면적" placeholder="연면적" {...field} />
          )}
        />
        <FormField
          control={form.control}
          name="usage"
          render={({ field }) => (
            <TextFormItem label="건물용도" placeholder="건물용도" {...field} />
          )}
        />
        <FormField
          control={form.control}
          name="selfParkingSpaces"
          render={({ field }) => (
            <TextFormItem
              label="자주식 주차장"
              placeholder="자주식 주차장"
              type="number"
              {...field}
            />
          )}
        />
        <FormField
          control={form.control}
          name="autoParkingSpaces"
          render={({ field }) => (
            <TextFormItem
              label="기계식 주차장"
              placeholder="기계식 주차장"
              type="number"
              {...field}
            />
          )}
        />
        <FormField
          control={form.control}
          name="handicapParkingSpaces"
          render={({ field }) => (
            <TextFormItem
              label="장애인 주차장"
              placeholder="장애인 주차장"
              type="number"
              {...field}
            />
          )}
        />

        <Button label="저장" />
      </form>
    </Form>
  );
};

export default ConstructionEditForm;
