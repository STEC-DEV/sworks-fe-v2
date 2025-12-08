import Button from "@/components/common/button";
import SelectFormItem from "@/components/common/form-input/select-field";
import { TextFormItem } from "@/components/common/form-input/text-field";

import { Form, FormField } from "@/components/ui/form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useDecodeParam } from "@/hooks/params";
import { useAdminDetailStore } from "@/store/admin/admin/admin-detail";
import { useDeptStore } from "@/store/admin/dept/dept-store";
import { convertSelectOptionType } from "@/utils/convert";

import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "next/navigation";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

const formSchema = z.object({
  userSeq: z.number(),
  userName: z.string("이름을 입력해주세요.").min(2, "2글자 이상 입력해주세요,"),
  job: z.string(),
  deptSeq: z.number("부서를 선택해주세요."),
  phone: z
    .string()
    .min(9, { message: "자릿수를 확인해주세요." })
    .max(11, { message: "자릿수를 확인해주세요." }),
  email: z
    .string()
    .refine(
      (val) => {
        // 빈 문자열이면 통과
        if (!val || val.trim() === "") return true;
        // 값이 있으면 이메일 형식 검증
        return z.string().email().safeParse(val).success;
      },
      { message: "이메일 형식을 확인해주세요." }
    )
    .optional(),
  removeImage: z.boolean(),
});

export type basicFormType = z.infer<typeof formSchema>;

const InfoEditForm = ({ onClose }: { onClose: () => void }) => {
  const { admin, patchAdminInfo, getAdminDetail } = useAdminDetailStore();
  const { departmentList, getDepartmentList } = useDeptStore();

  const { rawValue } = useDecodeParam("id");
  const form = useForm<basicFormType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userSeq: admin?.userSeq,
      userName: admin?.userName,
      job: admin?.job || "",
      deptSeq: admin?.deptSeq,
      phone: admin?.phone,
      email: admin?.email || "",
      removeImage: false,
    },
  });

  // useEffect(() => {
  //   getDepartmentList();
  //   return () => {
  //     if (!rawValue) return;
  //     getAdminDetail(rawValue);
  //   };
  // }, [rawValue]);

  const handleSubmit = async (values: basicFormType) => {
    await patchAdminInfo(values);
    onClose();
    await getAdminDetail(rawValue);
  };

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-6 w-full"
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <ScrollArea className="overflow-hidden">
          <div className="flex flex-col gap-6 px-6 pb-1">
            <FormField
              control={form.control}
              name="userName"
              render={({ field }) => (
                <TextFormItem
                  label="이름"
                  placeholder="이름"
                  required
                  {...field}
                />
              )}
            />
            {departmentList ? (
              <FormField
                control={form.control}
                name="deptSeq"
                render={({ field }) => {
                  const handleValue = (value: string) => {
                    console.log("선택값 : ", value);
                    field.onChange(Number(value));
                  };
                  return (
                    <SelectFormItem
                      label="부서"
                      selectItem={convertSelectOptionType(departmentList)}
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
              name="job"
              render={({ field }) => (
                <TextFormItem label="직책" placeholder="직책" {...field} />
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <TextFormItem label="이메일" placeholder="이메일" {...field} />
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <TextFormItem
                  label="전화번호"
                  placeholder="전화번호"
                  required
                  {...field}
                />
              )}
            />
          </div>
        </ScrollArea>
        <div className="shrink-0 px-6">
          <Button label="저장" type="submit" />
        </div>
      </form>
    </Form>
  );
};

export default InfoEditForm;
