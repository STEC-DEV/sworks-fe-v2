import Button from "@/components/common/button";
import FileFormItem from "@/components/common/form-input/file-field";
import { Form, FormField } from "@/components/ui/form";
import api from "@/lib/api/api-manager";
import { useUserMainStore } from "@/store/normal/user/main-store";
import { Response } from "@/types/common/response";
import { objectToFormData } from "@/utils/convert";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

const formSchema = z.object({
  files: z.instanceof(File),
});

type ExcelAddFormTypes = z.infer<typeof formSchema>;
const ExcelAddForm = ({ onClose }: { onClose: () => void }) => {
  const { getUserList } = useUserMainStore();
  const searchParams = useSearchParams();
  const form = useForm<ExcelAddFormTypes>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      files: undefined,
    },
  });
  const handleSubmit = async (values: ExcelAddFormTypes) => {
    const formData = objectToFormData(values);
    try {
      const res: Response<boolean> = await api
        .post(`user/w/sign/importform`, {
          body: formData,
        })
        .json();
      toast.success(res.message);
    } catch (err: any) {
      const errData: Response<boolean> = await err.response.json();

      console.error(errData.message);
      toast.error(errData.message);
    }
    onClose();
    await getUserList(new URLSearchParams(searchParams));
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col gap-6 px-6 w-full"
      >
        <FormField
          name="files"
          control={form.control}
          render={({ field }) => {
            return (
              <FileFormItem
                accept=".xlsx, .xls"
                value={field.value ? [field.value] : []}
                onChange={(files) => {
                  // files 배열의 첫 번째 파일만 저장, undefined 방지
                  const file = files[0];
                  field.onChange(file || null);
                }}
                multiple={false}
                isVertical
              />
            );
          }}
        />

        <Button
          label="밀어넣기"
          variant={form.watch("files") ? "default" : "disabled"}
        />
      </form>
    </Form>
  );
};

export default ExcelAddForm;
