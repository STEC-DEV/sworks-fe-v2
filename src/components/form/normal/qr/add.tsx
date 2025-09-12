import Button from "@/components/common/button";
import SelectFormItem from "@/components/common/form-input/select-field";
import { TextFormItem } from "@/components/common/form-input/text-field";
import { Form, FormField } from "@/components/ui/form";
import { useBasicStore } from "@/store/basic-store";
import { convertSelectOptionType } from "@/utils/convert";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import z from "zod";

const AddSchema = z.object({
  name: z.string().min(2, "2글자 이상 입력해주세요."),
  serviceTypeSeq: z.number().optional(),
  comments: z.string(),
  tel: z.string(),
});

type AddFormType = z.infer<typeof AddSchema>;

const QrAddForm = ({
  onSubmit,
}: {
  onSubmit: (value: AddFormType) => void;
}) => {
  const { basicCode } = useBasicStore();
  const form = useForm<AddFormType>({
    resolver: zodResolver(AddSchema),
    defaultValues: {
      name: "",
      serviceTypeSeq: undefined,
      comments: "",
      tel: "",
    },
  });

  const handleSubmit = (value: AddFormType) => {
    onSubmit(value);
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
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
        <Button type="submit" label="생성" />
      </form>
    </Form>
  );
};

export default QrAddForm;
