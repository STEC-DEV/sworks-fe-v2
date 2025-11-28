import Button from "@/components/common/button";
import { TextFormItem } from "@/components/common/form-input/text-field";
import { Form, FormField } from "@/components/ui/form";
import { useWorkplaceDetailStore } from "@/store/admin/workplace/workplace-detail-store";
import { Workplace } from "@/types/admin/workplace/v2/workplace";
import { WorkplaceDetail } from "@/types/admin/workplace/workplace-detail";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import z from "zod";

const formSchema = z.object({
  siteName: z
    .string("사업장명을 입력해주세요.")
    .min(2, "2글자 이상 입력해주세요."),
  siteTel: z.string(),
  siteAddress: z.string(),
  //   siteTypeSeq: z.number("관리 유형을 선택해주세요.").min(1),
});

export type FormType = z.infer<typeof formSchema>;

const WorkplaceInfoEditForm = ({
  data,
  setOpen,
}: {
  data: Workplace;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { getWorkplaceDetail, patchWorkplaceInfo } = useWorkplaceDetailStore();
  const form = useForm<FormType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      siteName: data.siteName,
      siteTel: data.siteTel,
      siteAddress: data.siteAddress ?? "",
    },
  });

  const handleSubmit = async (values: FormType) => {
    const updateData: WorkplaceDetail = { ...data, ...values };

    await patchWorkplaceInfo(updateData);
    setOpen(false);
    await getWorkplaceDetail(data.siteSeq);
  };
  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-6 w-full"
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <div className="flex flex-col gap-6 px-6">
          <FormField
            control={form.control}
            name="siteName"
            render={({ field }) => (
              <TextFormItem
                label="사업장명"
                placeholder="사업장명"
                required
                {...field}
              />
            )}
          />
          <FormField
            control={form.control}
            name="siteTel"
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
            name="siteAddress"
            render={({ field }) => (
              <TextFormItem label="주소" placeholder="주소" {...field} />
            )}
          />
        </div>
        <div className="shrink-0 px-6">
          <Button label="저장" type="submit" />
        </div>
      </form>
    </Form>
  );
};

export default WorkplaceInfoEditForm;
