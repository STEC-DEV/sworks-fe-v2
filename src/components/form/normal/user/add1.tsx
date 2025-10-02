import SelectFormItem from "@/components/common/form-input/select-field";
import CommonFormContainer from "@/components/ui/custom/form/form-container";
import { FormField } from "@/components/ui/form";
import { useBasicStore } from "@/store/basic-store";
import { useUserMainStore } from "@/store/normal/user/main-store";
import { convertSelectOptionType } from "@/utils/convert";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import z from "zod";

const formSchema = z.object({
  codeSeq: z.number("사용자 유형을 선택해주세요.").min(1),
});

export type UserTypeSelectFormType = z.infer<typeof formSchema>;

interface UserTypeSelectFormProps {
  onNext: (values: UserTypeSelectFormType) => void;
}

const UserTypeSelectForm = ({ onNext }: UserTypeSelectFormProps) => {
  const { createUser, createUserClassification } = useUserMainStore();

  const form = useForm<UserTypeSelectFormType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      codeSeq: createUser.codeSeq,
    },
  });
  return (
    <CommonFormContainer
      title="사용자 유형"
      form={form}
      nextLabel="다음"
      onNext={onNext}
    >
      <div>
        {createUserClassification ? (
          <FormField
            control={form.control}
            name="codeSeq"
            render={({ field }) => {
              const handleValue = (value: string) => {
                field.onChange(Number(value));
              };
              return (
                <SelectFormItem
                  label="사용자 유형"
                  selectItem={convertSelectOptionType(
                    createUserClassification.userTypes ?? []
                  )}
                  onValueChange={handleValue}
                  value={field.value?.toString()}
                  required
                />
              );
            }}
          />
        ) : null}
      </div>
    </CommonFormContainer>
  );
};

export default UserTypeSelectForm;
