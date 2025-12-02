import Button from "@/components/common/button";
import { TextFormItem } from "@/components/common/form-input/text-field";
import { Form, FormField } from "@/components/ui/form";

import { useDeptStore } from "@/store/admin/dept/dept-store";
import { zodResolver } from "@hookform/resolvers/zod";

import React from "react";
import { useForm } from "react-hook-form";
import z from "zod";

const DeptSchema = z.object({
  deptName: z.string().min(2, "2글자 이상 입력해주세요."),
});

export type DeptAddType = z.infer<typeof DeptSchema>;

const DeptAddForm = ({ onClose }: { onClose: () => void }) => {
  const { getDepartmentList, postAddDept } = useDeptStore();

  const form = useForm<DeptAddType>({
    resolver: zodResolver(DeptSchema),
    defaultValues: {
      deptName: "",
    },
  });

  const onSubmit = async (values: DeptAddType) => {
    await postAddDept(values);
    onClose();
    await getDepartmentList();
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-6 px-6 w-full"
      >
        <FormField
          name="deptName"
          control={form.control}
          render={({ field }) => (
            <TextFormItem label="부서명" placeholder="부서명" {...field} />
          )}
        />
        <Button label="생성" />
      </form>
    </Form>
  );
};

export default DeptAddForm;
