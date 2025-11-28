"use client";
import React, { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import z from "zod";
import { FacilityFormType, facilitySchema } from "./add2";
import { zodResolver } from "@hookform/resolvers/zod";
import { useBuildingDetailStore } from "@/store/normal/building/detail";
import { Form, FormField } from "@/components/ui/form";
import { TextFormItem } from "@/components/common/form-input/text-field";
import CheckFormItem from "@/components/common/form-input/check-field";
import IconButton from "@/components/common/icon-button";
import SelectFormItem from "@/components/common/form-input/select-field";
import { convertSelectOptionType } from "@/utils/convert";
import { useBasicStore } from "@/store/basic-store";
import Button from "@/components/common/button";

const detailsInit = {
  typeSeq: undefined,
  capacity: 0,
  qty: 0,
  comments: "",
};

const FacilityEditForm = ({
  onSubmit,
}: {
  onSubmit: (values: Record<string, any>) => void;
}) => {
  const { building } = useBuildingDetailStore();
  const { basicCode } = useBasicStore();

  const form = useForm<FacilityFormType>({
    resolver: zodResolver(facilitySchema),
    defaultValues: {
      elvPassenger: 0,
      elvCargo: 0,
      elvEmr: 0,
      subsCapacity: 0,
      genCapacity: 0,
      upsYn: false,
      hvacDetails: [],
    },
  });

  useEffect(() => {
    if (!building) return;
    form.reset({
      elvPassenger: building.elvPassenger,
      elvCargo: building.elvCargo,
      elvEmr: building.elvEmr,
      subsCapacity: building.subsCapacity,
      genCapacity: building.genCapacity,
      upsYn: building.upsYn,
      hvacDetails: building.hvacDetails,
    });
  }, [form, building]);

  const {
    fields: subFields,
    append: appendSub,
    remove: removeSub,
  } = useFieldArray({
    control: form.control,
    name: "hvacDetails",
  });
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-6"
      >
        <div className="base-flex-col gap-6 !h-auto">
          <span className="text-md font-bold">승강기</span>
          <div className=" flex flex-col gap-6 xl:flex xl:flex-row xl:gap-12">
            <FormField
              control={form.control}
              name="elvPassenger"
              render={({ field }) => (
                <TextFormItem
                  label="승객용"
                  placeholder="승객용"
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
              name="elvCargo"
              render={({ field }) => (
                <TextFormItem
                  label="화물용"
                  placeholder="화물용"
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
              name="elvEmr"
              render={({ field }) => (
                <TextFormItem
                  label="비상용"
                  placeholder="비상용"
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
        <div className="base-flex-col gap-6 !h-auto">
          <span className="text-md font-bold">전기</span>
          <div className="flex flex-col xl:flex-row  gap-12">
            <FormField
              control={form.control}
              name="subsCapacity"
              render={({ field }) => (
                <TextFormItem
                  label="수변전실 수전용량"
                  placeholder="수변전실 수전용량"
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
              name="genCapacity"
              render={({ field }) => (
                <TextFormItem
                  label="발전기 수전용량"
                  placeholder="발전기 수전용량"
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
              name="upsYn"
              render={({ field }) => (
                <CheckFormItem
                  label="UPS 존재여부"
                  checked={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  name={field.name}
                  ref={field.ref}
                />
              )}
            />
          </div>
        </div>
        <div className="base-flex-col gap-6 !h-auto">
          <div className="flex items-center justify-between">
            <span className="text-md font-bold">냉난방</span>
            <IconButton icon="Plus" onClick={() => appendSub(detailsInit)} />
          </div>
          <div className="flex flex-col gap-6">
            {subFields.map((d, i) => (
              <div
                className="flex border border-border rounded-[4px] bg-background p-6 flex-col xl:flex-row  items-center gap-12"
                key={i + d.id}
              >
                {basicCode.hcCodes ? (
                  <FormField
                    control={form.control}
                    name={`hvacDetails.${i}.typeSeq`}
                    render={({ field }) => {
                      const handleValue = (value: string) => {
                        if (!value) return;
                        field.onChange(Number(value));
                      };
                      return (
                        <SelectFormItem
                          label="구분"
                          value={field.value?.toString()}
                          onValueChange={handleValue}
                          selectItem={convertSelectOptionType(
                            basicCode.hcCodes ?? []
                          )}
                        />
                      );
                    }}
                  />
                ) : null}
                <FormField
                  control={form.control}
                  name={`hvacDetails.${i}.capacity`}
                  render={({ field }) => (
                    <TextFormItem
                      label="용량"
                      placeholder="용량"
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
                  name={`hvacDetails.${i}.qty`}
                  render={({ field }) => (
                    <TextFormItem
                      label="수량"
                      placeholder="수량"
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
                  name={`hvacDetails.${i}.comments`}
                  render={({ field }) => (
                    <TextFormItem
                      label="비고"
                      placeholder="비고"
                      {...field}
                      value={field.value ?? ""}
                    />
                  )}
                />
                <IconButton
                  bgClassName=" hover:bg-red-50 hidden xl:flex shrink-0"
                  className="text-red-500 "
                  icon="Trash2"
                  onClick={() => removeSub(i)}
                />
                <Button
                  className="xl:hidden"
                  label="삭제"
                  variant={"delete"}
                  onClick={() => removeSub(i)}
                />
              </div>
            ))}
          </div>
        </div>
        <div className="w-full flex justify-end">
          <Button label="저장" className="xl:w-fit xl:px-4 xl:py-2 " />
        </div>
      </form>
    </Form>
  );
};

export default FacilityEditForm;
