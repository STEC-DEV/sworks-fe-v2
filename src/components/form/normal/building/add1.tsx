import { DateFormItem } from "@/components/common/form-input/date-field";
import FileFormItem from "@/components/common/form-input/file-field";
import { TextFormItem } from "@/components/common/form-input/text-field";
import AppTitle from "@/components/common/label/title";
import CommonFormContainer from "@/components/ui/custom/form/form-container";
import { FormField } from "@/components/ui/form";
import { useBuildingStore } from "@/store/normal/building/building";
import { zodResolver } from "@hookform/resolvers/zod";
import { Images } from "lucide-react";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

export const buildingSchema = z.object({
  // buildingSeq: z.number(),
  dongName: z.string().min(1, "명칭을 입력해주세요."),
  address: z.string().min(1, "주소를 입력해주세요."),
  totalArea: z.string().min(1, "연면적을 입력해주세요."),
  completeDt: z.date("준공일을 입력해주세요."),
  usage: z.string().min(1, "명칭을 입력해주세요."),
  selfParkingSpaces: z.number(),
  autoParkingSpaces: z.number(),
  handicapParkingSpaces: z.number(),
  basementFloors: z.number(),
  groundFloors: z.number(),
  images: z.array(z.instanceof(File)),
});

export type BuildingFormType = z.infer<typeof buildingSchema>;

interface BuildingAddFormProps {
  onNext: (values: Record<string, any>) => void;
}

const BuildingAddForm = ({ onNext }: BuildingAddFormProps) => {
  const { createBuilding } = useBuildingStore();
  const form = useForm<BuildingFormType>({
    resolver: zodResolver(buildingSchema),
    defaultValues: {
      // buildingSeq: undefined,
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
      images: [],
    },
  });

  useEffect(() => {
    if (!createBuilding) return;
    form.reset({
      // buildingSeq: createBuilding.buildingSeq,
      dongName: createBuilding.dongName,
      address: createBuilding.address,
      totalArea: createBuilding.totalArea,
      completeDt: new Date(createBuilding.completeDt),
      usage: createBuilding.usage,
      selfParkingSpaces: createBuilding.selfParkingSpaces,
      autoParkingSpaces: createBuilding.autoParkingSpaces,
      handicapParkingSpaces: createBuilding.handicapParkingSpaces,
      basementFloors: createBuilding.basementFloors,
      groundFloors: createBuilding.groundFloors,
      images: createBuilding.images,
    });
  }, [form, createBuilding]);
  return (
    <CommonFormContainer
      title="건물정보"
      form={form}
      nextLabel="다음"
      onNext={onNext}
    >
      <div className="flex flex-col gap-6 xl:grid xl:grid-cols-2 xl: gap-x-24 xl:gap-y-12 ">
        <FormField
          control={form.control}
          name="dongName"
          render={({ field }) => (
            <TextFormItem label="명칭" placeholder="명칭" {...field} />
          )}
        />
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <TextFormItem label="위치" placeholder="위치" {...field} />
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
          name="usage"
          render={({ field }) => (
            <TextFormItem label="건물용도" placeholder="건물용도" {...field} />
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
          render={({ field }) => (
            <FileFormItem
              label="첨부파일"
              accept="accept"
              multiple={false}
              {...field}
              value={field.value}
              onChange={field.onChange}
              imageOnly
            />
          )}
        />
      </div>
    </CommonFormContainer>
  );
};

export default BuildingAddForm;
