import Button from "@/components/common/button";
import CheckFormItem from "@/components/common/form-input/check-field";
import SelectFormItem from "@/components/common/form-input/select-field";
import { TextFormItem } from "@/components/common/form-input/text-field";
import IconButton from "@/components/common/icon-button";
import CommonFormContainer from "@/components/ui/custom/form/form-container";
import { FormField } from "@/components/ui/form";
import { useBasicStore } from "@/store/basic-store";
import { useBuildingStore } from "@/store/normal/building/building";
import { convertSelectOptionType } from "@/utils/convert";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import z from "zod";

export const facilitySchema = z.object({
  elvPassenger: z.number(),
  elvCargo: z.number(),
  elvEmr: z.number(),
  subsCapacity: z.number(),
  genCapacity: z.number(),
  upsYn: z.boolean(),
  hvacDetails: z.array(
    z.object({
      typeSeq: z.number().optional(),
      capacity: z.number(),
      qty: z.number(),
      comments: z.string().nullable(),
    })
  ),
});

export type FacilityFormType = z.infer<typeof facilitySchema>;

const detailsInit = {
  typeSeq: undefined,
  capacity: 0,
  qty: 0,
  comments: "",
};

interface FacilityAddFormProps {
  onNext: (values: Record<string, any>) => void;
  onPrev: () => void;
}

const FacilityAddForm = ({ onNext, onPrev }: FacilityAddFormProps) => {
  const { createBuilding } = useBuildingStore();
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
    if (!createBuilding) return;
    form.reset({
      elvPassenger: createBuilding.elvPassenger,
      elvCargo: createBuilding.elvCargo,
      elvEmr: createBuilding.elvEmr,
      subsCapacity: createBuilding.subsCapacity,
      genCapacity: createBuilding.genCapacity,
      upsYn: createBuilding.upsYn,
      hvacDetails: createBuilding.hvacDetails,
    });
  }, [form, createBuilding]);

  const {
    fields: subFields,
    append: appendSub,
    remove: removeSub,
  } = useFieldArray({
    control: form.control,
    name: "hvacDetails",
  });

  return (
    <CommonFormContainer
      title="설비정보"
      form={form}
      nextLabel="다음"
      onNext={onNext}
      onPrev={onPrev}
    >
      <div className="base-flex-col gap-6 !h-auto">
        <span className="text-md font-bold">승강기</span>
        <div className="flex flex-col xl:flex-row gap-12">
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
              {basicCode.hcCodes && (
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
              )}
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
    </CommonFormContainer>
  );
};

export default FacilityAddForm;
