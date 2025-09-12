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
} from "@/utils/convert";
import Button from "@/components/common/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export const facilityEditFormSchema = z.object({
  facilitySeq: z.number(),
  facilityCodeSeq: z.number("관리 유형을 선택해주세요.").min(1),
  description: z.string("내용을 입력해주세요."),
  fromDt: z.date(),
  toDt: z.date().nullable(),
  constractor: z.string(),
  tel: z
    .string()
    .min(9, { message: "자릿수를 확인해주세요." })
    .max(11, { message: "자릿수를 확인해주세요." })
    .optional(),
  cost: z.string(),
  // files: z
  //   .array(
  //     z.object({
  //       attachSeq: z.number(),
  //       path: z.string(),
  //     })
  //   )
  //   .optional(),
  removeAttaches: z.array(z.number()),
  insertAttaches: z.array(z.instanceof(File)),
});

export type FacilityEditFormType = z.infer<typeof facilityEditFormSchema>;

const FacilityDetailEditForm = () => {
  const router = useRouter();
  const [existFiles, setExistFiles] = useState<Attach[]>([]);
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
      toDt: undefined,
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
      setExistFiles(facilityDetail.attaches || []);
      form.reset({
        facilitySeq: facilityDetail.facilitySeq,
        facilityCodeSeq: facilityDetail.facilityCodeSeq,
        description: facilityDetail.description,
        fromDt: new Date(facilityDetail.fromDt),
        toDt: facilityDetail.toDt ? new Date(facilityDetail.toDt) : undefined,
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
    const formData = convertRecordDataToFormData(values);
    const res = await updateFacilityDetail(formData);
    if (res.data) toast.success("수정 완료");
    else {
      toast.error(res.message);
    }
    router.replace(window.location.pathname.replace("/edit", ""));
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col gap-12"
      >
        <div className="grid grid-cols-2 gap-x-24 gap-y-12">
          {basicCode.typeCodes ? (
            <FormField
              control={form.control}
              name="facilityCodeSeq"
              render={({ field }) => {
                const handleValue = (value: string) => {
                  field.onChange(Number(value));
                };
                return (
                  <SelectFormItem
                    label="유형"
                    selectItem={convertSelectOptionType(code ?? [])}
                    onValueChange={handleValue}
                    value={field.value?.toString()}
                    required
                  />
                );
              }}
            />
          ) : null}
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
                label={decodeValue === "MRO" ? "반입일" : "시작일"}
                value={field.value}
                onChange={(date) =>
                  handleDateChange("start", date, field.onChange)
                }
                required
              />
            )}
          />
          {decodeValue !== "MRO" ? (
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
          ) : null}

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
        <FormField
          control={form.control}
          name="insertAttaches"
          render={({ field }) => {
            const handleRemoveExistFiles = (data: string) => {
              console.log("삭제 : ", data);
              const curRemoveFiles = form.getValues("removeAttaches") || [];

              form.setValue("removeAttaches", [
                ...curRemoveFiles,
                parseInt(data),
              ]);

              setExistFiles((prev) =>
                prev.filter((v, i) => v.attachSeq !== parseInt(data))
              );
            };

            return (
              <FileFormItem
                label="첨부파일"
                accept="accept"
                multiple={true}
                {...field}
                value={field.value}
                existingFiles={existFiles?.map((v, i) =>
                  v.attachSeq.toString()
                )}
                onChange={field.onChange}
                onRemoveExitedFiles={handleRemoveExistFiles}
              />
            );
          }}
        />
        <Button type="submit" label="저장" />
      </form>
    </Form>
  );
};

export default FacilityDetailEditForm;
