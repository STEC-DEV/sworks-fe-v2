import FileFormItem from "@/components/common/form-input/file-field";
import SelectFormItem, {
  MultiSelectFormItem,
} from "@/components/common/form-input/select-field";
import { TextFormItem } from "@/components/common/form-input/text-field";
import { MultiSelect } from "@/components/common/select-input";
import CommonFormContainer from "@/components/ui/custom/form/form-container";
import { FormField } from "@/components/ui/form";
import { useUserMainStore } from "@/store/normal/user/main-store";
import { convertSelectOptionType } from "@/utils/convert";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

const formSchema = z.object({
  userName: z.string("이름을 입력해주세요.").min(1, "이름을 입력해주세요."),
  sabun: z.string("사번을 입력해주세요.").min(1, "사번을 입력해주세요."),
  job: z.string(),
  email: z
    .string()
    .refine((val) => !val || z.string().email().safeParse(val).success, {
      message: "이메일 형식을 확인해주세요.",
    }),
  phone: z
    .string()
    .min(9, { message: "자릿수를 확인해주세요." })
    .max(11, { message: "자릿수를 확인해주세요." }),
  userServiceTypeSeq: z.array(z.number()),
  images: z.array(z.instanceof(File)),
});

export type UserAddFormType = z.infer<typeof formSchema>;

interface UserAddFormProps {
  onNext: (values: UserAddFormType) => void;
  onPrev: () => void;
}

const UserAddForm = ({ onNext, onPrev }: UserAddFormProps) => {
  const { createUser, createUserClassification } = useUserMainStore();

  const dynamicSchema = formSchema.refine(
    (data) => {
      // codeSeq가 8이 아닌 경우에만 userServiceTypeSeq 검증
      if (createUser.codeSeq !== 8) {
        return data.userServiceTypeSeq.length >= 1;
      }
      return true; // codeSeq가 8이면 검증 통과
    },
    {
      message: "담당 업무를 선택해주세요.",
      path: ["userServiceTypeSeq"], // 에러 표시 위치
    },
  );

  const form = useForm<UserAddFormType>({
    resolver: zodResolver(dynamicSchema),
    defaultValues: {
      userName: createUser.userName,
      sabun: createUser.sabun,
      job: createUser.job,
      email: createUser.email,
      phone: createUser.phone,
      userServiceTypeSeq: [],
      images: createUser.images,
    },
  });

  useEffect(() => {
    console.log(createUser);
  }, [createUser]);
  return (
    <CommonFormContainer
      title="기본정보"
      form={form}
      nextLabel="생성"
      onNext={onNext}
      onPrev={onPrev}
    >
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-x-24 gap-y-12">
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
            <TextFormItem
              label="사번"
              placeholder="사번"
              required
              {...field}
              onChange={(e) => {
                const filtered = e.target.value.replace(/[^0-9]/g, "");
                field.onChange(filtered);
              }}
            />
          )}
        />
        {createUser.codeSeq !== 8 ? (
          <FormField
            control={form.control}
            name="userServiceTypeSeq"
            render={({ field }) => {
              const handleValue = (value: string[]) => {
                const v = value.map((v) => parseInt(v));
                field.onChange(v);
              };
              return createUser.codeSeq === 6 ? (
                <MultiSelectFormItem
                  label="담당업무"
                  value={field.value.map((v) => v.toString())}
                  onValueChange={handleValue}
                  selectItem={convertSelectOptionType(
                    createUserClassification?.serviceTypes ?? [],
                  )}
                  required
                />
              ) : (
                <SelectFormItem
                  label="담당업무"
                  value={
                    field.value.length > 0
                      ? field.value[0].toString()
                      : undefined
                  }
                  onValueChange={(value) => {
                    field.onChange([parseInt(value)]); // 배열로 감싸고 숫자로 변환
                  }}
                  selectItem={convertSelectOptionType(
                    createUserClassification?.serviceTypes ?? [],
                  )}
                  required
                />
              );
            }}
          />
        ) : null}

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <TextFormItem
              label="전화번호"
              type="tel"
              placeholder="전화번호 ( - 제외)"
              required
              {...field}
              onChange={(e) => {
                const filtered = e.target.value.replace(/[^0-9]/g, "");
                field.onChange(filtered);
              }}
            />
          )}
        />
        {createUser.codeSeq !== 8 ? (
          <FormField
            control={form.control}
            name="job"
            render={({ field }) => (
              <TextFormItem label="직급" placeholder="직급" {...field} />
            )}
          />
        ) : null}

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <TextFormItem label="이메일" placeholder="이메일" {...field} />
          )}
        />
      </div>
      {createUser.codeSeq !== 8 ? (
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
      ) : null}
    </CommonFormContainer>
  );
};

export default UserAddForm;
