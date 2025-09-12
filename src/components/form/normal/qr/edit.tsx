import Button from "@/components/common/button";
import SelectFormItem from "@/components/common/form-input/select-field";
import {
  TextAreaFormItem,
  TextFormItem,
} from "@/components/common/form-input/text-field";
import { Form, FormField } from "@/components/ui/form";
import { useBasicStore } from "@/store/basic-store";
import { convertSelectOptionType } from "@/utils/convert";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

const EditSchema = z.object({
  vocSeq: z.number(),
  name: z.string().min(2, "2글자 이상 입력해주세요."),
  serviceTypeSeq: z.number(),
  comments: z.string(),
  tel: z.string(),
});

export type QREditFormType = z.infer<typeof EditSchema>;

const QrEditForm = ({
  data,
  onSubmit,
}: {
  data: QRListItem;
  onSubmit: (value: QREditFormType) => void;
}) => {
  const { basicCode } = useBasicStore();
  const form = useForm<QREditFormType>({
    resolver: zodResolver(EditSchema),
    defaultValues: {
      vocSeq: undefined,
      name: "",
      serviceTypeSeq: undefined,
      comments: "",
      tel: "",
    },
  });

  useEffect(() => {
    if (!data) return;
    form.reset({
      vocSeq: data.vocSeq,
      name: data.name,
      serviceTypeSeq: data.serviceTypeSeq,
      comments: data.comments,
      tel: data.tel,
    });
  }, [form, data]);

  // const handleSubmit = (value: EditFormType) => {
  //   onSubmit(value);
  // };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4 px-6"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <TextFormItem
              label="위치명"
              placeholder="위치명"
              {...field}
              required
            />
          )}
        />
        {basicCode.contractCodes ? (
          <FormField
            control={form.control}
            name="serviceTypeSeq"
            render={({ field }) => {
              const handleValue = (value: string) => {
                if (!value) return;
                field.onChange(Number(value));
              };

              return (
                <SelectFormItem
                  label="업무 유형"
                  selectItem={convertSelectOptionType(
                    basicCode.contractCodes ?? []
                  )}
                  onValueChange={handleValue}
                  value={field.value?.toString()}
                />
              );
            }}
          />
        ) : null}

        <FormField
          control={form.control}
          name="comments"
          render={({ field }) => (
            <TextFormItem label="설명" placeholder="설명" {...field} />
          )}
        />
        <FormField
          control={form.control}
          name="tel"
          render={({ field }) => (
            <TextFormItem label="연락처" placeholder="연락처" {...field} />
          )}
        />
        <Button type="submit" label="저장" />
      </form>
    </Form>
  );
};

export default QrEditForm;
