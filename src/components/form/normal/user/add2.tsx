import FileFormItem from "@/components/common/form-input/file-field";
import { TextFormItem } from "@/components/common/form-input/text-field";
import CommonFormContainer from "@/components/ui/custom/form/form-container";
import { FormField } from "@/components/ui/form";
import { useUserMainStore } from "@/store/normal/user/main-store";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import z from "zod";

const formSchema = z.object({
  userName: z.string("이름을 입력해주세요.").min(1),
  sabun: z.string("사번을 입력해주세요.").min(1),
  job: z.string(),
  email: z.email(),
  phone: z
    .string()
    .min(9, { message: "자릿수를 확인해주세요." })
    .max(11, { message: "자릿수를 확인해주세요." }),
  images: z.array(z.instanceof(File)),
});

export type UserAddFormType = z.infer<typeof formSchema>;

interface UserAddFormProps {
  onNext: (values: UserAddFormType) => void;
  onPrev: () => void;
}

const UserAddForm = ({ onNext, onPrev }: UserAddFormProps) => {
  const { createUser } = useUserMainStore();
  const form = useForm<UserAddFormType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userName: createUser.userName,
      sabun: createUser.sabun,
      job: createUser.job,
      email: createUser.email,
      phone: createUser.phone,
      images: createUser.images,
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
          name="userName"
          render={({ field }) => (
            <TextFormItem label="이름" placeholder="이름" required {...field} />
          )}
        />
        <FormField
          control={form.control}
          name="sabun"
          render={({ field }) => (
            <TextFormItem label="사번" placeholder="이름" required {...field} />
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <TextFormItem
              label="전화번호"
              placeholder="전화번호 ( - 제외)"
              required
              {...field}
            />
          )}
        />
        <FormField
          control={form.control}
          name="job"
          render={({ field }) => (
            <TextFormItem label="직급" placeholder="직급" {...field} />
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <TextFormItem label="이메일" placeholder="이메일" {...field} />
          )}
        />
      </div>
      <FormField
        control={form.control}
        name="images"
        render={({ field }) => (
          <FileFormItem
            label="프로필 이미지"
            accept="accept"
            multiple={false}
            {...field}
            value={field.value}
            onChange={field.onChange}
            imageOnly
          />
        )}
      />
    </CommonFormContainer>
  );
};

export default UserAddForm;
