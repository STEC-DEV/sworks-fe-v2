"use client";
import Button from "@/components/common/button";
import SelectFormItem from "@/components/common/form-input/select-field";
import { Form, FormField } from "@/components/ui/form";
import { useDecodeParam } from "@/hooks/params";
import { useVocDetailStore } from "@/store/normal/voc/detail-store";
import { useVocStore } from "@/store/normal/voc/voc-store";
import { convertSelectOptionType } from "@/utils/convert";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

const editForm = z.object({
  logSeq: z.number(),
  serviceTypeSeq: z.number(),
});

type EditFormType = z.infer<typeof editForm>;

const TypeEditForm = ({
  setOpen,
}: {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { userPermission } = useVocStore();
  const { vocDetail, getVocDetail, putUpdateServiceType } = useVocDetailStore();
  const form = useForm<EditFormType>({
    resolver: zodResolver(editForm),
    defaultValues: {
      logSeq: vocDetail?.logs.logSeq,
      serviceTypeSeq: vocDetail?.logs.serviceTypeSeq,
    },
  });

  // useEffect(() => {
  //   if (!vocDetail) return;
  //   form.reset({
  //     logSeq: vocDetail.logs.logSeq,
  //     serviceTypeSeq: vocDetail.logs.serviceTypeSeq,
  //   });
  // }, [form, vocDetail]);

  const handleSubmit = async (values: EditFormType) => {
    if (!vocDetail) return;
    const res = await putUpdateServiceType(values);
    res.data ? toast.success("저장") : toast.error(res.message);
    setOpen(false);
    await getVocDetail(vocDetail?.logs.logSeq.toString());
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="px-6 base-flex-col gap-6 w-full"
      >
        <FormField
          control={form.control}
          name="serviceTypeSeq"
          render={({ field }) => {
            const handleValue = (value: string) => {
              console.log(value);
              if (!value) return;
              field.onChange(parseInt(value));
            };
            return (
              <SelectFormItem
                label="유형"
                selectItem={convertSelectOptionType(userPermission ?? [])}
                value={field.value?.toString()}
                onValueChange={handleValue}
                required
              />
            );
          }}
        />
        <Button label="저장" />
      </form>
    </Form>
  );
};

export default TypeEditForm;
