"use client";
import SelectFormItem from "@/components/common/form-input/select-field";
import {
  PasswordTextFormItem,
  TextFormItem,
} from "@/components/common/form-input/text-field";
import CommonFormContainer from "@/components/ui/custom/form/form-container";
import { FormField } from "@/components/ui/form";
import { useDeptStore } from "@/store/admin/dept/dept-store";
import { convertSelectOptionType } from "@/types/common/select-item";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

const formSchema = z.object({
  userName: z.string("이름을 입력해주세요.").min(2, "2글자 이상 입력해주세요,"),
  job: z.string("직책을 입력해주세요.").min(2, "2글자 이상 입력해주세요,"),
  sabun: z.string("사번을 입력해주세요.").min(2, "2글자 이상 입력해주세요,"),
  deptSeq: z.number("부서를 선택해주세요.").min(0, "부서를 선택해주세요."),
  phone: z
    .string()
    .min(9, { message: "자릿수를 확인해주세요." })
    .max(11, { message: "자릿수를 확인해주세요." }),
  email: z.email({ message: "이메일 형식을 확인해주세요." }),
});

export type basicFormType = z.infer<typeof formSchema>;

interface AdminAddFormProps {
  onPrev?: () => void;
  onNext: (values: basicFormType) => void;
}

const AdminAddForm = ({ onNext, onPrev }: AdminAddFormProps) => {
  const { departmentList, getDepartmentList } = useDeptStore();
  //부서 목록 조회
  const form = useForm<basicFormType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userName: "",
      job: "",
      sabun: "",
      deptSeq: undefined,
      phone: "",
      email: "",
    },
  });

  useEffect(() => {
    getDepartmentList();
  }, []);

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
            <TextFormItem label="사번" placeholder="사번" required {...field} />
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
        {departmentList ? (
          <FormField
            control={form.control}
            name="deptSeq"
            render={({ field }) => {
              const handleValue = (value: string) => {
                field.onChange(Number(value));
              };
              return (
                <SelectFormItem
                  label="부서"
                  selectItem={convertSelectOptionType(departmentList)}
                  onValueChange={handleValue}
                  defaultValue={field.value?.toString()}
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
      </div>
    </CommonFormContainer>
  );
};

export default AdminAddForm;
