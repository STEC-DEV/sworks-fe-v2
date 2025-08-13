import Button from "@/components/common/button";
import { DateFormItem } from "@/components/common/form-input/date-field";
import { TextFormItem } from "@/components/common/form-input/text-field";
import { Form, FormField } from "@/components/ui/form";
import useDateValidation from "@/hooks/date/useDateSet";
import { useWorkplaceDetailStore } from "@/store/admin/workplace/workplace-detail-store";
import { Contract } from "@/types/admin/workplace/contract-info";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { useParams } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  contractSeq: z.number(),
  contractManager: z.string().optional(),
  contractStaff: z.string().optional(),
  status: z.boolean(),
  startDt: z.date(),
  endDt: z.date().nullable(),
  contractAmount: z.string().optional(),
  comments: z.string().optional(),
});

export type basicFormType = z.infer<typeof formSchema>;

const ContractEditForm = ({
  data,
  setOpen,
}: {
  data: Contract;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { patchContract, getContractList } = useWorkplaceDetailStore();
  const { id } = useParams();
  const form = useForm<basicFormType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      contractSeq: data.contractSeq,
      contractManager: data.contractManager ?? "",
      contractStaff: data.contractStaff ?? "",
      status: data.status,
      startDt: new Date(data.startDt),
      endDt: data.endDt ? new Date(data.endDt) : null,
      contractAmount: data.contractAmount?.toString() ?? "0",
      comments: data.comments ?? "",
    },
  });
  const { handleDateChange } = useDateValidation({
    form,
    startFieldName: "startDt",
    endFieldName: "endDt",
  });

  const handleSubmit = async (values: basicFormType) => {
    if (!id) return;
    const updateContract: Record<string, any> = {
      ...values,
      // startDt: format(values.startDt, "yyyy-MM-dd"),
      contractAmount: values.contractAmount
        ? parseInt(values.contractAmount)
        : 0,
    };
    console.log(updateContract);
    await patchContract(updateContract);

    await getContractList(id?.toString());
    setOpen(false);
  };

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-6"
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <div className="flex flex-col gap-6">
          <FormField
            control={form.control}
            name="contractManager"
            render={({ field }) => (
              <TextFormItem
                label="담당자"
                placeholder="담당자"
                required
                {...field}
              />
            )}
          />
          <FormField
            control={form.control}
            name="startDt"
            render={({ field }) => (
              <DateFormItem
                label="계약일"
                value={field.value}
                onChange={(date) =>
                  handleDateChange("start", date, field.onChange)
                }
              />
            )}
          />
          <FormField
            control={form.control}
            name="endDt"
            render={({ field }) => (
              <DateFormItem
                label="해약일"
                value={field.value}
                onChange={(date) =>
                  handleDateChange("end", date, field.onChange)
                }
              />
            )}
          />
          <FormField
            control={form.control}
            name="contractStaff"
            render={({ field }) => (
              <TextFormItem
                label="인원"
                placeholder="인원"
                required
                {...field}
              />
            )}
          />
          <FormField
            control={form.control}
            name="contractAmount"
            render={({ field }) => (
              <TextFormItem
                label="금액"
                placeholder="금액"
                type="number"
                required
                {...field}
              />
            )}
          />
        </div>
        <Button label="저장" type="submit" />
      </form>
    </Form>
  );
};

export default ContractEditForm;
