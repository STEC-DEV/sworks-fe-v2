"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { useFacilityMainStore } from "@/store/normal/facility/facility-main-store";
import { useFacilityDetailStore } from "@/store/normal/facility/facility-detail";
import z from "zod";
import { Form, FormField } from "@/components/ui/form";
import { useDecodeParam } from "@/hooks/params";
import { useBasicStore } from "@/store/basic-store";
import { BasicCode } from "@/types/common/basic-code";
import FileFormItem from "@/components/common/form-input/file-field";
import { TextFormItem } from "@/components/common/form-input/text-field";
import { DateFormItem } from "@/components/common/form-input/date-field";
import useDateValidation from "@/hooks/date/useDateSet";
import SelectFormItem from "@/components/common/form-input/select-field";
import {
  convertRecordDataToFormData,
  convertSelectOptionType,
  objectToFormData,
} from "@/utils/convert";
import Button from "@/components/common/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { FormCard } from "@/components/layout/form/form-container";

export const facilityEditFormSchema = z.object({
  facilitySeq: z.number(),
  facilityCodeSeq: z.number("관리 유형을 선택해주세요.").min(1),
  description: z.string("내용을 입력해주세요."),
  fromDt: z.date(),
  toDt: z.date().nullable(),
  constractor: z.string("내용을 입력해주세요.").min(1, "내용을 입력해주세요."),
  tel: z
    .string()
    .refine(
      (val) => !val || (val.length >= 9 && val.length <= 11),
      "전화번호를 올바르게 입력해주세요.",
    ),
  cost: z.string(),

  removeAttaches: z.array(z.number()),
  insertAttaches: z.array(z.instanceof(File)),
});

export type FacilityEditFormType = z.infer<typeof facilityEditFormSchema>;

const FacilityDetailEditForm = () => {
  const router = useRouter();

  const { decodeValue } = useDecodeParam("type");
  const { rawValue: id } = useDecodeParam("id");
  const { basicCode } = useBasicStore();
  const [code, setCode] = useState<BasicCode[]>();
  const { facilityDetail, getFacilityDetail, updateFacilityDetail } =
    useFacilityDetailStore();

  useEffect(() => {
    switch (decodeValue) {
      case "R&M":
        setCode(basicCode.rnmCodes);
        break;
      case "M&O":
        setCode(basicCode.mnoCodes);
        break;
      case "MRO":
        setCode(basicCode.mroCodes);
        break;
    }
  }, [decodeValue]);

  const form = useForm<FacilityEditFormType>({
    resolver: zodResolver(facilityEditFormSchema),
    defaultValues: {
      facilitySeq: undefined,
      facilityCodeSeq: undefined,
      description: "",
      fromDt: undefined,
      toDt: null,
      constractor: "",
      tel: "",
      cost: "",
      // files: [],
      removeAttaches: [],
      insertAttaches: [],
    },
  });
  useEffect(() => {
    if (facilityDetail) {
      form.reset({
        facilitySeq: facilityDetail.facilitySeq,
        facilityCodeSeq: facilityDetail.facilityCodeSeq,
        description: facilityDetail.description,
        fromDt: new Date(facilityDetail.fromDt),
        toDt: facilityDetail.toDt ? new Date(facilityDetail.toDt) : null,
        constractor: facilityDetail.constractor,
        tel: facilityDetail.tel,
        cost: facilityDetail.cost?.toString(),
        // files: facilityDetail.attaches,
        removeAttaches: [],
        insertAttaches: [],
      });
    }
  }, [facilityDetail, form]);

  //상세 데이터 조회
  useEffect(() => {
    if (id) {
      getFacilityDetail(id);
    }
  }, [id]);

  useEffect(() => {
    console.log(facilityDetail);
  }, [facilityDetail]);

  const { handleDateChange } = useDateValidation({
    form,
    startFieldName: "fromDt",
    endFieldName: "toDt",
  });

  const handleSubmit = async (values: FacilityEditFormType) => {
    const formData = objectToFormData(values);
    const res = await updateFacilityDetail(formData);
    if (res.data) toast.success("수정 완료");
    else {
      toast.error(res.message);
    }
    router.replace(window.location.pathname.replace("/edit", ""));
  };

  const isMro = decodeValue === "MRO";

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col gap-4"
      >
        {/* 기본정보 카드 */}
        <FormCard title="기본정보">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 xl:gap-x-12">
            {basicCode.typeCodes && (
              <FormField
                control={form.control}
                name="facilityCodeSeq"
                render={({ field }) => (
                  <SelectFormItem
                    label="유형"
                    selectItem={convertSelectOptionType(code ?? [])}
                    onValueChange={(value) => field.onChange(Number(value))}
                    value={field.value?.toString()}
                    required
                  />
                )}
              />
            )}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <TextFormItem
                  label="내용"
                  placeholder="내용"
                  {...field}
                  required
                />
              )}
            />
            <FormField
              control={form.control}
              name="fromDt"
              render={({ field }) => (
                <DateFormItem
                  label={isMro ? "반입일" : "시작일"}
                  value={field.value}
                  onChange={(date) =>
                    handleDateChange("start", date, field.onChange)
                  }
                  required
                />
              )}
            />
            {!isMro && (
              <FormField
                control={form.control}
                name="toDt"
                render={({ field }) => (
                  <DateFormItem
                    label="해약일"
                    value={field.value}
                    onChange={(date) =>
                      handleDateChange("end", date, field.onChange)
                    }
                  />
                )}
              />
            )}
          </div>
        </FormCard>

        {/* 업체정보 카드 */}
        <FormCard title="업체정보">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 xl:gap-x-12">
            <FormField
              control={form.control}
              name="constractor"
              render={({ field }) => (
                <TextFormItem
                  label="업체"
                  placeholder="업체"
                  {...field}
                  required
                />
              )}
            />
            <FormField
              control={form.control}
              name="tel"
              render={({ field }) => (
                <TextFormItem label="연락처" placeholder="연락처" {...field} />
              )}
            />
            <FormField
              control={form.control}
              name="cost"
              render={({ field }) => (
                <TextFormItem label="비용" placeholder="비용" {...field} />
              )}
            />
          </div>
        </FormCard>

        {/* 첨부파일 카드 */}
        <FormCard title="첨부파일">
          <FormField
            control={form.control}
            name="insertAttaches"
            render={({ field }) => {
              const handleRemoveExistFiles = (data: string) => {
                const curRemoveFiles = form.getValues("removeAttaches") || [];
                form.setValue("removeAttaches", [
                  ...curRemoveFiles,
                  parseInt(data),
                ]);
              };

              const existedFiles = () => {
                const removeFiles = form.watch("removeAttaches");
                if (!facilityDetail) return;
                return facilityDetail.attaches
                  .filter((v) => !removeFiles.includes(v.attachSeq))
                  .map((v) => v.attachSeq.toString());
              };

              return (
                <FileFormItem
                  label=""
                  accept="accept"
                  multiple={true}
                  {...field}
                  value={field.value}
                  existingFiles={existedFiles()}
                  onChange={field.onChange}
                  onRemoveExitedFiles={handleRemoveExistFiles}
                />
              );
            }}
          />
        </FormCard>

        <div className="flex justify-end">
          <Button type="submit" label="저장" size="sm" />
        </div>
      </form>
    </Form>
  );
};

export default FacilityDetailEditForm;
