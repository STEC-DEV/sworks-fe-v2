"use client";
import { TextFormItem } from "@/components/common/form-input/text-field";
import CommonFormContainer from "@/components/ui/custom/form/form-container";
import { FormField } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import z from "zod";

const formSchema = z.object({
  siteName: z
    .string("사업장명을 입력해주세요.")
    .min(2, "2글자 이상 입력해주세요."),
  siteTel: z.string(),
  siteAddress: z.string(),
  siteTypeSeq: z.number("관리 유형을 선택해주세요.").min(1),
});

export type formType = z.infer<typeof formSchema>;

interface WorkplaceAddFormProps {
  onPrev?: () => void;
  onNext: () => void;
}

const WorkplaceAddForm = ({ onNext, onPrev }: WorkplaceAddFormProps) => {
  const form = useForm<formType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      siteName: "",
      siteTel: "",
      siteAddress: "",
      siteTypeSeq: 0,
    },
  });

  return (
    <CommonFormContainer
      title="기본정보"
      form={form}
      nextLabel="생성"
      onNext={onNext}
      onPrev={onPrev}
    >
      <div className="grid grid-cols-2 gap-x-24 gap-y-12">
        <FormField
          control={form.control}
          name="siteName"
          render={({ field }) => (
            <TextFormItem
              label="사업장명"
              placeholder="사업장명"
              required
              {...field}
            />
          )}
        />
        <FormField
          control={form.control}
          name="siteTel"
          render={({ field }) => (
            <TextFormItem label="전화번호" placeholder="전화번호" {...field} />
          )}
        />
        <FormField
          control={form.control}
          name="siteAddress"
          render={({ field }) => (
            <TextFormItem label="주소" placeholder="주소" {...field} />
          )}
        />
      </div>
    </CommonFormContainer>
  );
};

export default WorkplaceAddForm;
