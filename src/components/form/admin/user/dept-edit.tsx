import Button from "@/components/common/button";
import { TextFormItem } from "@/components/common/form-input/text-field";
import { Form, FormField } from "@/components/ui/form";
import { useAdminListStore } from "@/store/admin/admin/admin-list-store";
import { useDeptStore } from "@/store/admin/dept/dept-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

const DeptSchema = z.object({
  deptSeq: z.number(),
  deptName: z.string().min(2, "2글자 이상 입력해주세요."),
});

export type DeptEditType = z.infer<typeof DeptSchema>;

const DeptEditForm = ({
  id,
  name,
  onClose,
}: {
  id: number;
  name: string;
  onClose: () => void;
}) => {
  const searchParams = useSearchParams();
  const { getAdminList } = useAdminListStore();
  const { getDepartmentList, putUpdateDept } = useDeptStore();
  const form = useForm<DeptEditType>({
    resolver: zodResolver(DeptSchema),
    defaultValues: {
      deptSeq: 0,
      deptName: "",
    },
  });

  useEffect(() => {
    if (!form) return;

    form.reset({
      deptSeq: id,
      deptName: name,
    });
  }, [form, id, name]);

  const onSubmit = async (values: DeptEditType) => {
    if (!searchParams) return;
    await putUpdateDept(values);
    onClose();
    await getDepartmentList();
    await getAdminList(new URLSearchParams(searchParams));
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

export default DeptEditForm;
