"use client";

import { useBasicStore } from "@/store/basic-store";
import React, { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { FireFormType, fireSchema } from "./add3";
import { zodResolver } from "@hookform/resolvers/zod";
import { useBuildingDetailStore } from "@/store/normal/building/detail";
import { Form, FormField } from "@/components/ui/form";
import IconButton from "@/components/common/icon-button";
import { TextFormItem } from "@/components/common/form-input/text-field";
import SelectFormItem from "@/components/common/form-input/select-field";
import { convertSelectOptionType } from "@/utils/convert";
import CheckFormItem from "@/components/common/form-input/check-field";
import { FirePanelType } from "@/types/normal/building/building";
import Button from "@/components/common/button";
import { FormCard } from "@/components/layout/form/form-container";
import EmptyBox from "@/components/ui/custom/empty";

const detailsInit = {
  typeSeq: undefined,
  flowRate: 0,
  totalHead: 0,
  qty: 0,
  comments: "",
};

const FireEditForm = ({
  onSubmit,
}: {
  onSubmit: (values: Record<string, any>) => void;
}) => {
  const { building } = useBuildingDetailStore();
  const { basicCode } = useBasicStore();

  const form = useForm<FireFormType>({
    resolver: zodResolver(fireSchema),
    defaultValues: {
      overheadTank: building?.overheadTank ?? 0,
      overheadTankFireWater: building?.overheadTankFireWater ?? 0,
      underTank: building?.underTank ?? 0,
      underTankFireWater: building?.underTankFireWater ?? 0,
      firePanelType: building?.firePanelType ?? undefined,
      sprinklerYn: building?.sprinklerYn ?? false,
      gasExtYn: building?.gasExtYn ?? false,
      pumpDetails: building?.pumpDetails ?? [],
    },
  });

  const {
    fields: subFields,
    append: appendSub,
    remove: removeSub,
  } = useFieldArray({
    control: form.control,
    name: "pumpDetails",
  });

  const numericChange =
    (onChange: (v: number) => void) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      onChange(e.target.value === "" ? 0 : Number(e.target.value));

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        {/* 소방정보 카드 */}
        <FormCard title="소방정보">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="firePanelType"
              render={({ field }) => (
                <SelectFormItem
                  label="수신기"
                  value={field.value?.toString()}
                  onValueChange={(v) => v && field.onChange(Number(v))}
                  selectItem={convertSelectOptionType(FirePanelType)}
                  required
                />
              )}
            />
            <FormField
              control={form.control}
              name="sprinklerYn"
              render={({ field }) => (
                <CheckFormItem
                  label="스프링클러 여부"
                  checked={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  name={field.name}
                  ref={field.ref}
                />
              )}
            />
            <FormField
              control={form.control}
              name="gasExtYn"
              render={({ field }) => (
                <CheckFormItem
                  label="가스계소화설비 유무"
                  checked={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  name={field.name}
                  ref={field.ref}
                />
              )}
            />
          </div>
        </FormCard>

        {/* 소화용수 카드 */}
        <FormCard title="소화용수">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="overheadTank"
              render={({ field }) => (
                <TextFormItem
                  label="고가수조"
                  placeholder="0"
                  type="number"
                  {...field}
                  onChange={numericChange(field.onChange)}
                />
              )}
            />
            <FormField
              control={form.control}
              name="overheadTankFireWater"
              render={({ field }) => (
                <TextFormItem
                  label="중 소화용수 (고가)"
                  placeholder="0"
                  type="number"
                  {...field}
                  onChange={numericChange(field.onChange)}
                />
              )}
            />
            <FormField
              control={form.control}
              name="underTank"
              render={({ field }) => (
                <TextFormItem
                  label="저수조"
                  placeholder="0"
                  type="number"
                  {...field}
                  onChange={numericChange(field.onChange)}
                />
              )}
            />
            <FormField
              control={form.control}
              name="underTankFireWater"
              render={({ field }) => (
                <TextFormItem
                  label="중 소화용수 (저수조)"
                  placeholder="0"
                  type="number"
                  {...field}
                  onChange={numericChange(field.onChange)}
                />
              )}
            />
          </div>
        </FormCard>

        {/* 펌프 카드 */}
        <FormCard
          title="펌프"
          titleOptionChildren={
            <IconButton icon="Plus" onClick={() => appendSub(detailsInit)} />
          }
        >
          {subFields.length > 0 ? (
            <div className="flex flex-col gap-3">
              {subFields.map((d, i) => (
                <div
                  key={i + d.id}
                  className="grid grid-cols-1 xl:grid-cols-6 gap-4 p-4 rounded-xl bg-background border border-border items-end"
                >
                  {basicCode.pumpCodes && (
                    <FormField
                      control={form.control}
                      name={`pumpDetails.${i}.typeSeq`}
                      render={({ field }) => (
                        <SelectFormItem
                          label="구분"
                          value={field.value?.toString()}
                          onValueChange={(v) => v && field.onChange(Number(v))}
                          selectItem={convertSelectOptionType(
                            basicCode.pumpCodes ?? [],
                          )}
                        />
                      )}
                    />
                  )}
                  <FormField
                    control={form.control}
                    name={`pumpDetails.${i}.flowRate`}
                    render={({ field }) => (
                      <TextFormItem
                        label="토출량"
                        placeholder="0"
                        type="number"
                        {...field}
                        onChange={numericChange(field.onChange)}
                      />
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`pumpDetails.${i}.totalHead`}
                    render={({ field }) => (
                      <TextFormItem
                        label="전양정"
                        placeholder="0"
                        type="number"
                        {...field}
                        onChange={numericChange(field.onChange)}
                      />
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`pumpDetails.${i}.qty`}
                    render={({ field }) => (
                      <TextFormItem
                        label="수량"
                        placeholder="0"
                        type="number"
                        {...field}
                        onChange={numericChange(field.onChange)}
                      />
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`pumpDetails.${i}.comments`}
                    render={({ field }) => (
                      <TextFormItem
                        label="비고"
                        placeholder="비고"
                        {...field}
                        value={field.value ?? ""}
                      />
                    )}
                  />
                  <div className="flex justify-end">
                    <IconButton
                      bgClassName="hover:bg-red-50"
                      className="text-red-500"
                      icon="Trash2"
                      onClick={() => removeSub(i)}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyBox message="펌프 항목을 추가해주세요." />
          )}
        </FormCard>

        <div className="flex justify-end">
          <Button label="저장" size="sm" />
        </div>
      </form>
    </Form>
  );
};
export default FireEditForm;
