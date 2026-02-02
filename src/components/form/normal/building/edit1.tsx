import { Form, FormField } from "@/components/ui/form";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { useBuildingDetailStore } from "@/store/normal/building/detail";
import FileFormItem, {
  ImageFormItem,
} from "@/components/common/form-input/file-field";
import { TextFormItem } from "@/components/common/form-input/text-field";
import { DateFormItem } from "@/components/common/form-input/date-field";
import Button from "@/components/common/button";
import z from "zod";

export const buildingSchema = z.object({
  // buildingSeq: z.number(),
  dongName: z.string().min(1, "명칭을 입력해주세요."),
  address: z.string().min(1, "주소를 입력해주세요."),
  totalArea: z.string().min(1, "연면적을 입력해주세요."),
  completeDt: z.date("준공일을 입력해주세요."),
  usage: z.string().min(1, "건물용도를 입력해주세요."),
  selfParkingSpaces: z.number(),
  autoParkingSpaces: z.number(),
  handicapParkingSpaces: z.number(),
  basementFloors: z.number(),
  groundFloors: z.number(),
  removeImage: z.boolean(),
  images: z.instanceof(File).nullable(),
});

type BuildingFormType = z.infer<typeof buildingSchema>;

const BuildingEditForm = ({
  onSubmit,
}: {
  onSubmit: (values: Record<string, any>) => void;
}) => {
  const { building } = useBuildingDetailStore();

  const form = useForm<BuildingFormType>({
    resolver: zodResolver(buildingSchema),
    defaultValues: {
      dongName: "",
      completeDt: new Date(),
      address: "",
      totalArea: "",
      usage: "",
      selfParkingSpaces: 0,
      autoParkingSpaces: 0,
      handicapParkingSpaces: 0,
      basementFloors: 0,
      groundFloors: 0,
      removeImage: false,
      images: null,
    },
  });
  useEffect(() => {
    if (!building) return;
    form.reset({
      // buildingSeq: createBuilding.buildingSeq,
      dongName: building.dongName,
      address: building.address,
      totalArea: building.totalArea,
      completeDt: new Date(building.completeDt),
      usage: building.usage,
      selfParkingSpaces: building.selfParkingSpaces,
      autoParkingSpaces: building.autoParkingSpaces,
      handicapParkingSpaces: building.handicapParkingSpaces,
      basementFloors: building.basementFloors,
      groundFloors: building.groundFloors,
      removeImage: false,
      images: null,
    });
  }, [building, form]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-6"
      >
        <div className="flex flex-col gap-6 xl:grid xl:grid-cols-2 xl: gap-x-24 xl:gap-y-12 ">
          <FormField
            control={form.control}
            name="dongName"
            render={({ field }) => (
              <TextFormItem
                label="명칭"
                placeholder="명칭"
                {...field}
                required
              />
            )}
          />
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <TextFormItem
                label="위치"
                placeholder="위치"
                {...field}
                required
              />
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
            name="completeDt"
            render={({ field }) => (
              <DateFormItem
                label="준공일"
                value={field.value}
                onChange={field.onChange}
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
        <div className="base-flex-col gap-6 !h-auto">
          <span className="text-md font-bold">층</span>
          <div className="flex flex-col gap-6 xl:flex xl:flex-row xl:gap-12">
            <FormField
              control={form.control}
              name="basementFloors"
              render={({ field }) => (
                <TextFormItem
                  label="지하"
                  placeholder="지하"
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
              name="groundFloors"
              render={({ field }) => (
                <TextFormItem
                  label="지상"
                  placeholder="지상"
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
          <FormField
            control={form.control}
            name="images"
            render={({ field }) => {
              const handleRemove = () => {
                form.setValue("removeImage", true);
              };
              const existingFiles = () => {
                if (!building) return;
                const isRemove = form.watch("removeImage");
                console.log("삭제 여부 : ", isRemove);
                console.log(isRemove ? null : building.images);

                return isRemove ? null : building.images;
              };
              return (
                <ImageFormItem
                  label="이미지"
                  multiple={false}
                  {...field}
                  value={field.value}
                  isRemove={form.watch("removeImage")}
                  onChange={field.onChange}
                  existingFile={existingFiles()}
                  onRemoveExistingFile={handleRemove}
                />
              );
            }}
          />
        </div>
        <div className="w-full flex justify-end">
          <Button label="저장" className="" />
        </div>
      </form>
    </Form>
  );
};

export default BuildingEditForm;
