import CheckFormItem from "@/components/common/form-input/check-field";
import SelectFormItem from "@/components/common/form-input/select-field";
import { TextFormItem } from "@/components/common/form-input/text-field";
import IconButton from "@/components/common/icon-button";
import CommonFormContainer from "@/components/ui/custom/form/form-container";
import { FormField } from "@/components/ui/form";
import { useBasicStore } from "@/store/basic-store";
import { useBuildingStore } from "@/store/normal/building/building";
import { FirePanelType } from "@/types/normal/building/building";
import { convertSelectOptionType } from "@/utils/convert";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import z from "zod";

export const fireSchema = z.object({
  overheadTank: z.number(),
  overheadTankFireWater: z.number(),
  underTank: z.number(),
  underTankFireWater: z.number(),
  firePanelType: z.number(),
  sprinklerYn: z.boolean(),
  gasExtYn: z.boolean(),
  pumpDetails: z.array(
    z.object({
      typeSeq: z.number().optional(),
      flowRate: z.number(),
      totalHead: z.number(),
      qty: z.number(),
      comments: z.string(),
    })
  ),
});

export type FireFormType = z.infer<typeof fireSchema>;

const detailsInit = {
  typeSeq: undefined,
  flowRate: 0,
  totalHead: 0,
  qty: 0,
  comments: "",
};

interface FireAddFormProps {
  onNext: (values: Record<string, any>) => void;
  onPrev: () => void;
}

const FireAddForm = ({ onNext, onPrev }: FireAddFormProps) => {
  const { createBuilding } = useBuildingStore();
  const { basicCode } = useBasicStore();

  const form = useForm<FireFormType>({
    resolver: zodResolver(fireSchema),
    defaultValues: {
      overheadTank: 0,
      overheadTankFireWater: 0,
      underTank: 0,
      underTankFireWater: 0,
      firePanelType: undefined,
      sprinklerYn: false,
      gasExtYn: false,
      pumpDetails: [],
    },
  });

  useEffect(() => {
    if (!createBuilding) return;
    form.reset({
      overheadTank: createBuilding.overheadTank,
      overheadTankFireWater: createBuilding.overheadTankFireWater,
      underTank: createBuilding.underTank,
      underTankFireWater: createBuilding.underTankFireWater,
      firePanelType: createBuilding.firePanelType,
      sprinklerYn: createBuilding.sprinklerYn,
      gasExtYn: createBuilding.gasExtYn,
      pumpDetails: createBuilding.pumpDetails,
    });
  }, [form, createBuilding]);

  const {
    fields: subFields,
    append: appendSub,
    remove: removeSub,
  } = useFieldArray({
    control: form.control,
    name: "pumpDetails",
  });

  return (
    <CommonFormContainer
      title="설비정보"
      form={form}
      nextLabel="생성"
      onNext={onNext}
      onPrev={onPrev}
    >
      <div className="base-flex-col gap-6">
        <FormField
          control={form.control}
          name="firePanelType"
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
                selectItem={convertSelectOptionType(FirePanelType)}
                required
              />
            );
          }}
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
      <div className="base-flex-col gap-6 !h-auto">
        <span className="text-md font-bold">소화용수</span>
        <div className="flex flex-col gap-6">
          <div className="flex gap-12">
            <FormField
              control={form.control}
              name="overheadTank"
              render={({ field }) => (
                <TextFormItem
                  label="고가수조"
                  placeholder="고가수조"
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
              name="overheadTankFireWater"
              render={({ field }) => (
                <TextFormItem
                  label="중 소화용수"
                  placeholder="중 소화용수"
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
          <div className="flex gap-12">
            <FormField
              control={form.control}
              name="underTank"
              render={({ field }) => (
                <TextFormItem
                  label="저수조"
                  placeholder="저수조"
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
              name="underTankFireWater"
              render={({ field }) => (
                <TextFormItem
                  label="중 소화용수"
                  placeholder="중 소화용수"
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
      </div>

      <div className="base-flex-col gap-6 !h-auto">
        <div className="flex items-center justify-between">
          <span className="text-md font-bold">펌프</span>
          <IconButton icon="Plus" onClick={() => appendSub(detailsInit)} />
        </div>
        <div className="flex flex-col gap-6">
          {subFields.map((d, i) => (
            <div className="flex items-center gap-12" key={i + d.id}>
              {basicCode.hcCodes ? (
                <FormField
                  control={form.control}
                  name={`pumpDetails.${i}.typeSeq`}
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
                          basicCode.pumpCodes ?? []
                        )}
                      />
                    );
                  }}
                />
              ) : null}
              <FormField
                control={form.control}
                name={`pumpDetails.${i}.flowRate`}
                render={({ field }) => (
                  <TextFormItem
                    label="토출량"
                    placeholder="토출량"
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
                name={`pumpDetails.${i}.totalHead`}
                render={({ field }) => (
                  <TextFormItem
                    label="전양정"
                    placeholder="전양정"
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
                name={`pumpDetails.${i}.qty`}
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
                name={`pumpDetails.${i}.comments`}
                render={({ field }) => (
                  <TextFormItem label="비고" placeholder="비고" {...field} />
                )}
              />
              <IconButton
                bgClassName="hover:bg-red-50"
                className="text-red-500 "
                icon="Trash2"
                onClick={() => removeSub(i)}
              />
            </div>
          ))}
        </div>
      </div>
    </CommonFormContainer>
  );
};

export default FireAddForm;
