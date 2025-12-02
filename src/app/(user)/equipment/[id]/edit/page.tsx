"use client";
import Button from "@/components/common/button";
import { DateFormItem } from "@/components/common/form-input/date-field";
import FileFormItem, {
  ImageFormItem,
} from "@/components/common/form-input/file-field";
import SelectFormItem from "@/components/common/form-input/select-field";
import { TextFormItem } from "@/components/common/form-input/text-field";
import AppTitle from "@/components/common/label/title";
import { Form, FormField } from "@/components/ui/form";
import { useBasicStore } from "@/store/basic-store";
import { useEquipmentDetailStore } from "@/store/normal/equipment/equip-detail-store";
import {
  convertRecordDataToFormData,
  convertSelectOptionType,
} from "@/utils/convert";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import z from "zod";

const formSchema = z.object({
  equipSeq: z.number().min(1, "장비 ID값이 존재하지 않습니다."),
  serviceTypeSeq: z.number().min(1, "업무 유형을 선택해주세요."),

  serial: z.string().min(1, "관리번호를 입력해주세요."),

  name: z.string().min(1, "장비명을 입력해주세요."),

  capacity: z.string().min(1, "규격용량을 입력해주세요."),

  usage: z.string().min(1, "용도를 입력해주세요."),

  maker: z.string().min(1, "제조사를 입력해주세요."),

  buyer: z.string().min(1, "구매처를 입력해주세요."),

  amount: z.string().min(1, "수량을 입력해주세요."),

  cost: z.string(),

  buyDt: z.date(),

  //api에 빠져있음
  //   manager: z.string().min(1, "관리 부서를 입력해주세요."),

  removeImage: z.boolean(),
  // updateFiles: z.array(z.instanceof(File)),
  // images: z.string,
  images: z.instanceof(File).nullable(),
});

type UpdateFormType = z.infer<typeof formSchema>;

const Page = () => {
  const router = useRouter();
  const [existedFile, setExistedFile] = useState<string | null>(null);
  const { basicCode } = useBasicStore();
  const { equipmentDetail, patchUpdateEquipmentDetail } =
    useEquipmentDetailStore();

  const form = useForm<UpdateFormType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      equipSeq: 0,
      serviceTypeSeq: 0,
      serial: "",
      name: "",
      capacity: "",
      usage: "",
      maker: "",
      buyer: "",
      amount: "",
      cost: "",
      buyDt: undefined,
      removeImage: false,
      images: null,
    },
  });

  useEffect(() => {
    if (!equipmentDetail) return;

    // form 값들을 업데이트
    form.reset({
      equipSeq: equipmentDetail.equipSeq,
      serviceTypeSeq: equipmentDetail.serviceTypeSeq || 0,
      serial: equipmentDetail.serial || "",
      name: equipmentDetail.name || "",
      capacity: equipmentDetail.capacity || "",
      usage: equipmentDetail.usage || "",
      maker: equipmentDetail.maker || "",
      buyer: equipmentDetail.buyer || "",
      amount: equipmentDetail.amount?.toString() || "",
      cost: equipmentDetail.cost?.toString() || "",
      buyDt: new Date(equipmentDetail.buyDt),
      removeImage: false,
      images: null,
    });

    setExistedFile(equipmentDetail.images);
  }, [equipmentDetail, form]);

  const handleSubmit = async (values: UpdateFormType) => {
    const formData = convertRecordDataToFormData(values, true);
    await patchUpdateEquipmentDetail(formData);
    router.replace(`/equipment/${values.equipSeq}`);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col gap-12"
      >
        <AppTitle title="장비 수정" isBorder />
        <div className="grid xl:grid-cols-2 gap-x-24 gap-y-12">
          <FormField
            control={form.control}
            name="serviceTypeSeq"
            render={({ field }) => {
              const handleValue = (value: string) => {
                console.log(value);
                if (!value) return;
                field.onChange(Number(value));
              };

              return (
                <SelectFormItem
                  label="유형"
                  selectItem={
                    basicCode.contractCodes
                      ? convertSelectOptionType(basicCode.contractCodes)
                      : [] // 빈 배열로 처리
                  }
                  onValueChange={handleValue}
                  value={field.value?.toString()}
                  required
                />
              );
            }}
          />
          <FormField
            control={form.control}
            name="serial"
            render={({ field }) => (
              <TextFormItem
                label="관리번호"
                placeholder="관리번호"
                {...field}
                required
              />
            )}
          />
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <TextFormItem
                label="장비명"
                placeholder="장비명"
                {...field}
                required
              />
            )}
          />
          <FormField
            control={form.control}
            name="capacity"
            render={({ field }) => (
              <TextFormItem
                label="규격용량"
                placeholder="규격용량"
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
                label="용도"
                placeholder="용도"
                {...field}
                required
              />
            )}
          />
          <FormField
            control={form.control}
            name="maker"
            render={({ field }) => (
              <TextFormItem
                label="제조사"
                placeholder="제조사"
                {...field}
                required
              />
            )}
          />
          <FormField
            control={form.control}
            name="buyer"
            render={({ field }) => (
              <TextFormItem
                label="구매처"
                placeholder="구매처"
                {...field}
                required
              />
            )}
          />
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <TextFormItem
                label="수량"
                placeholder="수량"
                type="number"
                min={1}
                {...field}
                required
              />
            )}
          />
          <FormField
            control={form.control}
            name="cost"
            render={({ field }) => (
              <TextFormItem
                label="비용"
                placeholder="비용"
                type="number"
                min={0}
                {...field}
              />
            )}
          />
          <FormField
            control={form.control}
            name="buyDt"
            render={({ field }) => (
              <DateFormItem
                label="구매일"
                value={field.value}
                onChange={(date) => field.onChange(date)}
                required
              />
            )}
          />
          {/* <FormField
            control={form.control}
            name="manager"
            render={({ field }) => (
              <TextFormItem
                label="관리부서"
                placeholder="관리부서"
                {...field}
                required
              />
            )}
          /> */}
        </div>
        <FormField
          control={form.control}
          name="images"
          render={({ field }) => {
            const handleRemove = () => {
              form.setValue("removeImage", true);
            };

            const existingFiles = () => {
              if (!equipmentDetail) return;
              const isRemove = form.watch("removeImage");
              console.log("삭제 여부 : ", isRemove);
              console.log(isRemove ? null : equipmentDetail.images);

              return isRemove ? null : equipmentDetail.images;
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
        <Button type="submit" label="저장" />
      </form>
    </Form>
  );
};

export default Page;
