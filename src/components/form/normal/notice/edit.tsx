"use client";
import Button from "@/components/common/button";
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
import { useNoticeDetailStore } from "@/store/normal/notice/notice-detail-store";
import { useNoticeStore } from "@/store/normal/notice/notice-store";
import { SelectOption } from "@/types/common/select-item";
import { convertSelectOptionType, objectToFormData } from "@/utils/convert";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

const NoticeSchema = z.object({
  noticeSeq: z.number(),
  serviceTypeSeq: z.array(z.number()),
  title: z.string().min(1, "제목을 입력해주세요."),
  description: z.string().min(1, "내용을 입력해주세요."),
  endDt: z.date(),
  viewYn: z.boolean(),
  deleteAttaches: z.array(z.number()),
  insertAttaches: z.array(z.instanceof(File)),
});

type NoticeEditFormType = z.infer<typeof NoticeSchema>;

const NoticeEditForm = () => {
  const router = useRouter();
  const { basicCode } = useBasicStore();
  const { getClassification } = useNoticeStore();
  const { notice, patchUpdateNotice } = useNoticeDetailStore();
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

  const form = useForm<NoticeEditFormType>({
    resolver: zodResolver(NoticeSchema),
    defaultValues: {
      noticeSeq: undefined,
      serviceTypeSeq: [],
      title: "",
      description: "",
      endDt: new Date(),
      viewYn: false,
      deleteAttaches: [],
      insertAttaches: [],
    },
  });

  useEffect(() => {
    if (!notice) return;
    form.reset({
      noticeSeq: notice.noticeSeq,
      serviceTypeSeq: notice.serviceTypes.map((v) => v.serviceTypeSeq),
      title: notice.title,
      description: notice.description,
      endDt: new Date(notice.endDt),
      viewYn: notice.viewYn,
      deleteAttaches: [],
      insertAttaches: [],
    });
  }, [form, notice]);

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

  const handleSubmit = async (values: NoticeEditFormType) => {
    if (!notice) return;
    const formData = objectToFormData(values, true);
    await patchUpdateNotice(formData);
    router.push(`/notice/${notice?.noticeSeq}`);
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col gap-6"
      >
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
                label="주요공지사항"
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
              {...field}
            />
          )}
        />
        <FormField
          control={form.control}
          name="insertAttaches"
          render={({ field }) => {
            const handleRemoveExistFiles = (data: string) => {
              //현재 이름을 넘겨서 기존파일에서 이름같은거 찾은 후 seq뽐아야함
              console.log("삭제 : ", data);
              const curRemoveFiles = form.getValues("deleteAttaches") || [];

              form.setValue("deleteAttaches", [
                ...curRemoveFiles,
                parseInt(data),
              ]);
            };

            const existedFile = () => {
              const removeFiles = form.watch("deleteAttaches");
              if (!notice) return;
              const allFiles = [
                ...notice.imageAttaches,
                ...notice.fileAttaches,
              ];
              return allFiles
                .filter((v) => !removeFiles.includes(v.attachSeq))
                .map((v) => v.attachSeq.toString());
            };
            return (
              <FileFormItem
                label="첨부파일"
                accept="accept"
                multiple={true}
                max={3}
                {...field}
                value={field.value}
                onChange={field.onChange}
                isVertical
                existingFiles={existedFile()}
                onRemoveExitedFiles={handleRemoveExistFiles}
              />
            );
          }}
        />
        <div className="flex justify-end">
          <Button label="등록" size={"sm"} />
        </div>
      </form>
    </Form>
  );
};

export default NoticeEditForm;
