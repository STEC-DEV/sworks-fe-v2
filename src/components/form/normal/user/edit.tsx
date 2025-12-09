import Button from "@/components/common/button";
import { ImageFormItem } from "@/components/common/form-input/file-field";
import SelectFormItem from "@/components/common/form-input/select-field";
import { TextFormItem } from "@/components/common/form-input/text-field";

import { Form, FormField } from "@/components/ui/form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useDecodeParam } from "@/hooks/params";
import { useAdminDetailStore } from "@/store/admin/admin/admin-detail";
import { useDeptStore } from "@/store/admin/dept/dept-store";
import { useUserDetailStore } from "@/store/normal/user/detail-store";
import { convertSelectOptionType, objectToFormData } from "@/utils/convert";

import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "next/navigation";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

const formSchema = z.object({
  userSeq: z.number(),
  userName: z.string("이름을 입력해주세요.").min(2, "2글자 이상 입력해주세요,"),
  job: z.string(),
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
  userServiceTypeSeq: z.array(z.number()),
  removeImage: z.boolean(),
  images: z.instanceof(File).nullable(),
});

export type UserEditFormType = z.infer<typeof formSchema>;

const UserEditForm = ({ onClose }: { onClose: () => void }) => {
  const { user, patchUpdateUser, getUserDetail } = useUserDetailStore();

  const { rawValue } = useDecodeParam("id");
  const form = useForm<UserEditFormType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userSeq: user?.userSeq,
      userName: user?.userName,
      job: user?.job || "",
      userServiceTypeSeq: user?.serviceTypes.map((s) =>
        parseInt(s.userServiceTypeSeq)
      ),
      phone: user?.phone,
      email: user?.email || "",
      removeImage: false,
      images: null,
    },
  });

  useEffect(() => {
    if (!user) return;
    form.reset({
      userSeq: user.userSeq,
      userName: user.userName,
      job: user.job || "",
      phone: user.phone,
      userServiceTypeSeq:
        user?.serviceTypes.map((s) => parseInt(s.userServiceTypeSeq)) || [],
      email: user.email || "",
      removeImage: false,
      images: null,
    });
  }, [user]);

  const handleSubmit = async (values: UserEditFormType) => {
    const formData = objectToFormData(values);
    await patchUpdateUser(formData);
    onClose();
    await getUserDetail(rawValue);
  };

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-6 w-full"
        onSubmit={form.handleSubmit(handleSubmit, (err) => console.log(err))}
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
            <FormField
              control={form.control}
              name="images"
              render={({ field }) => {
                const handleRemove = () => {
                  form.setValue("removeImage", true);
                };

                const existingFiles = () => {
                  if (!user) return;
                  const isRemove = form.watch("removeImage");

                  return isRemove ? null : user.images;
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
        </ScrollArea>
        <div className="shrink-0 px-6">
          <Button label="저장" type="submit" />
        </div>
      </form>
    </Form>
  );
};

export default UserEditForm;
