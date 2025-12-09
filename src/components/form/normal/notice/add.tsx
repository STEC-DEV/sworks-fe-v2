"use client";
import Button from "@/components/common/button";
import CheckFormItem from "@/components/common/form-input/check-field";
import { DateFormItem } from "@/components/common/form-input/date-field";
import FileFormItem from "@/components/common/form-input/file-field";
import { MultiSelectFormItem } from "@/components/common/form-input/select-field";
import {
  TextAreaFormItem,
  TextFormItem,
} from "@/components/common/form-input/text-field";
import { CheckBox } from "@/components/common/input";
import { Form, FormField } from "@/components/ui/form";
import { useBasicStore } from "@/store/basic-store";
import { useNoticeStore } from "@/store/normal/notice/notice-store";
import { SelectOption } from "@/types/common/select-item";
import { convertSelectOptionType, objectToFormData } from "@/utils/convert";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

const NoticeSchema = z.object({
  serviceTypeSeq: z.array(z.number()).min(1, "유형을 선택해주세요."),
  title: z.string().min(1, "제목을 입력해주세요."),
  description: z.string().min(1, "내용을 입력해주세요."),
  endDt: z.date(),
  viewYn: z.boolean(),
  attaches: z.array(z.instanceof(File)),
});

type NoticeAddFormType = z.infer<typeof NoticeSchema>;

const NoticeAddForm = () => {
  const router = useRouter();
  const { basicCode } = useBasicStore();
  const { postAddNotice, getClassification } = useNoticeStore();
  const [all, setAll] = useState<boolean>(false);
  const [userClassification, setUserClassification] = useState<
    SelectOption[] | null
  >(null);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const res = await getClassification();
    if (!res) return;
    const convertData = convertSelectOptionType(res);
    setUserClassification(convertData);
  };

  const form = useForm<NoticeAddFormType>({
    resolver: zodResolver(NoticeSchema),
    defaultValues: {
      serviceTypeSeq: [],
      title: "",
      description: "",
      endDt: new Date(),
      viewYn: true,
      attaches: [],
    },
  });

  const allNotice = () => {
    if (!basicCode.contractCodes) return;
    const code = convertSelectOptionType(basicCode.contractCodes);

    const handleCheck = (check: boolean) => {
      setAll(check);
      if (!check) {
        form.setValue("serviceTypeSeq", []);
      } else {
        form.setValue(
          "serviceTypeSeq",
          code.map((c) => parseInt(c.value.toString()))
        );
      }
    };

    return (
      <div className="flex items-center gap-2">
        <span className="text-xs text-[var(--description-light)]">
          전체 공지
        </span>
        <CheckBox
          checked={all}
          onChange={(e) => handleCheck(e.target.checked)}
        />
      </div>
    );
  };

  const handleSubmit = async (values: NoticeAddFormType) => {
    const formData = objectToFormData(values, true);
    for (let [key, value] of formData.entries()) {
      if (key === "description") {
        console.log("Raw value:", JSON.stringify(value));
        // "\n" 또는 "\r\n"으로 표시됨
      }
    }
    await postAddNotice(formData);
    router.push("/notice");
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col gap-6"
      >
        <FormField
          control={form.control}
          name="viewYn"
          render={({ field }) => {
            return (
              <CheckFormItem
                label="비공개"
                description="계약 담당자 비공개 여부"
                checked={!field.value}
                {...field}
                onChange={(e) => {
                  field.onChange(!e.target.checked);
                }}
              />
            );
          }}
        />
        {allNotice()}
        {!all && (
          <FormField
            control={form.control}
            name="serviceTypeSeq"
            render={({ field }) => {
              const handleSelect = (value: string[]) => {
                const v = value.map((v) => parseInt(v));
                field.onChange(v);
                if (value.length === 5) setAll(true);
              };
              return (
                <MultiSelectFormItem
                  label="업무유형"
                  value={field.value.map((v) => v.toString())}
                  onValueChange={handleSelect}
                  selectItem={userClassification ?? []}
                  required
                />
              );
            }}
          />
        )}
        {/* 
        25.11.26
        주요공지사항이 필수면 안되지않냐라고 의견전달 했으나 필수로하자고 해서 따름
         */}
        <FormField
          control={form.control}
          name="endDt"
          render={({ field }) => {
            return (
              <DateFormItem
                label="공지기간"
                value={field.value}
                onChange={field.onChange}
                required
              />
            );
          }}
        />

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <TextFormItem label="제목" placeholder="제목" required {...field} />
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <TextAreaFormItem
              className="h-100"
              label="내용"
              placeholder="내용"
              required
              showCount={true}
              {...field}
            />
          )}
        />
        <FormField
          control={form.control}
          name="attaches"
          render={({ field }) => (
            <FileFormItem
              label="첨부파일"
              accept="accept"
              multiple={true}
              max={3}
              {...field}
              value={field.value}
              onChange={field.onChange}
              isVertical
            />
          )}
        />
        <div className="flex justify-end">
          <Button label="등록" size={"sm"} />
        </div>
      </form>
    </Form>
  );
};

export default NoticeAddForm;
