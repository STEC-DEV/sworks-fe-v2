"use client";
import Button from "@/components/common/button";
import CheckFormItem from "@/components/common/form-input/check-field";
import FileFormItem from "@/components/common/form-input/file-field";
import SelectFormItem, {
  ComboboxFormItem,
} from "@/components/common/form-input/select-field";
import {
  TextAreaFormItem,
  TextFormItem,
} from "@/components/common/form-input/text-field";
import { Form, FormField } from "@/components/ui/form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useDecodeParam } from "@/hooks/params";
import { useAuthStore } from "@/store/auth/auth-store";
import { useBasicStore } from "@/store/basic-store";
import { useQrStore } from "@/store/normal/qr/qr-store";
import { useVocStore } from "@/store/normal/voc/voc-store";
import { SelectOption } from "@/types/common/select-item";
import {
  convertRecordDataToFormData,
  convertSelectOptionType,
} from "@/utils/convert";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

const AddSchema = z
  .object({
    vocSeq: z.number("위치를 선택해주세요.").min(1).optional(),
    createUser: z.string().min(1, "이름을 입력해주세요."),

    phone: z.string().optional(),
    serviceTypeSeq: z.number("유형을 선택해주세요.").min(1).optional(),
    title: z.string().min(1, "제목을 입력해주세요."),
    content: z.string().min(1, "내용을 입력해주세요."),
    //true -> 모바일, false -> 수기
    division: z.boolean(),
    replyYn: z.boolean(),
    images: z.array(z.instanceof(File)),
  })
  .refine(
    (data) => {
      if (data.replyYn) {
        return data.phone && data.phone.length >= 9 && data.phone.length <= 11;
      }
      return true;
    },
    {
      message: "전화번호를 올바르게 입력해주세요.",
      path: ["phone"], // 에러가 phone 필드에 표시됨
    }
  );

type AddFormType = z.infer<typeof AddSchema>;

interface VocAddFormProps {
  onSubmit: (values: any) => void;
}
const VocAddForm = ({ onSubmit }: VocAddFormProps) => {
  const { getUserPermission, userPermission } = useVocStore();
  const [vocPoint, setVocPoint] = useState<SelectOption[]>([]);
  const { allQrList, getAllQrList } = useQrStore();

  const form = useForm<AddFormType>({
    resolver: zodResolver(AddSchema),

    defaultValues: {
      vocSeq: undefined,
      createUser: "",
      phone: "",
      division: true, // 추가
      replyYn: false, // 추가
      images: [],
      serviceTypeSeq: undefined,
      title: "",
      content: "",
    },
  });

  useEffect(() => {
    getUserPermission();
    getAllQrList();
  }, []);

  useEffect(() => {
    if (!allQrList) return;
    const convertAllVocPoint = convertSelectOptionType(allQrList);
    setVocPoint(convertAllVocPoint);
  }, [allQrList]);

  // const handleSubmit = async (values: AddFormType) => {
  //   const formData = convertRecordDataToFormData(values);
  //   formData ? toast.success("등록") : toast.error("실패");
  //   setOpen(false);
  // };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className=" flex-1  min-h-0 flex flex-col gap-4 "
      >
        <ScrollArea className="flex-1 min-h-0 px-6 ">
          <div className="h-full base-flex-col gap-4">
            <FormField
              control={form.control}
              name="vocSeq"
              render={({ field }) => {
                const handleValue = (value: string) => {
                  field.onChange(Number(value));
                };
                return (
                  <ComboboxFormItem
                    label="위치"
                    selectItem={vocPoint}
                    onValueChange={handleValue}
                    value={field.value?.toString()}
                    required
                  />
                );
              }}
            />
            {userPermission ? (
              <FormField
                control={form.control}
                name="serviceTypeSeq"
                render={({ field }) => {
                  const handleValue = (value: string) => {
                    field.onChange(Number(value));
                  };
                  return (
                    <SelectFormItem
                      label="업무 유형"
                      selectItem={convertSelectOptionType(userPermission ?? [])}
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
              name="createUser"
              render={({ field }) => (
                <TextFormItem
                  label="작성자"
                  placeholder="작성자"
                  {...field}
                  required
                />
              )}
            />
            <FormField
              control={form.control}
              name="replyYn"
              render={({ field }) => (
                <CheckFormItem
                  label="회신여부"
                  description="전화번호를 입력하시면 처리내용을 회신받을 수 있습니다."
                  checked={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  name={field.name}
                  ref={field.ref}
                />
              )}
            />
            {form.watch("replyYn") ? (
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <TextFormItem
                    label="전화번호"
                    placeholder="전화번호"
                    {...field}
                  />
                )}
              />
            ) : null}

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <TextFormItem
                  label="제목"
                  placeholder="제목"
                  {...field}
                  required
                />
              )}
            />
            {/* textarea로 변경예정 */}
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <TextAreaFormItem
                  label="내용"
                  placeholder="내용"
                  {...field}
                  required
                />
              )}
            />
            <FormField
              control={form.control}
              name="images"
              render={({ field }) => (
                <FileFormItem
                  label="첨부파일"
                  accept="accept"
                  multiple={true}
                  {...field}
                  value={field.value}
                  onChange={field.onChange}
                  imageOnly
                  isVertical
                />
              )}
            />
          </div>
        </ScrollArea>
        <div className="px-6 flex-shrink-0">
          <Button type="submit" label="접수" />
        </div>
      </form>
    </Form>
  );
};

export default VocAddForm;
