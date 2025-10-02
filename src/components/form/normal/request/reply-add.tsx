import UserInput, {
  UserInputFormItem,
} from "@/app/(user)/(work)/req-task/[id]/_components/user-input";
import Button from "@/components/common/button";
import FileFormItem, {
  ImageFormItem,
} from "@/components/common/form-input/file-field";
import SelectFormItem from "@/components/common/form-input/select-field";
import { TextAreaFormItem } from "@/components/common/form-input/text-field";
import { Form, FormField, FormItem } from "@/components/ui/form";
import { useDecodeParam } from "@/hooks/params";
import { useReqDetailStore } from "@/store/normal/req/detail";
import { ProcessStatus } from "@/types/common/basic-code";
import {
  convertRecordDataToFormData,
  convertSelectOptionType,
} from "@/utils/convert";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

const formSchema = z.object({
  requestSeq: z.number(),
  contents: z.string("내용을 입력해주세요.").min(1, "내용을 입력해주세요."),
  status: z.number("처리상태를 선택해주세요."),
  userSeq: z.array(z.number()),
  images: z.array(z.instanceof(File)),
});

type ReplyAddFormSchema = z.infer<typeof formSchema>;

const ReplyAddForm = () => {
  const { postAddReply, getRequestDetail } = useReqDetailStore();
  const { rawValue } = useDecodeParam("id");
  const form = useForm<ReplyAddFormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      requestSeq: undefined,
      contents: "",
      status: 0,
      userSeq: [],
      images: [],
    },
  });

  useEffect(() => {
    if (!rawValue) return;
    form.setValue("requestSeq", parseInt(rawValue));
  }, [rawValue]);

  const handleSubmit = async (values: ReplyAddFormSchema) => {
    const formData = convertRecordDataToFormData(values);
    const res = await postAddReply(formData);
    await getRequestDetail(rawValue);
    form.reset();
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit, (err) => console.log(err))}
        className="flex flex-col gap-4"
      >
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => {
            const handleChange = (value: string) => {
              if (!value) return;

              field.onChange(parseInt(value));
            };
            return (
              <SelectFormItem
                label="처리상태"
                selectItem={convertSelectOptionType(ProcessStatus)}
                onValueChange={handleChange}
                value={field.value?.toString()}
              />
            );
          }}
        />
        <FormField
          control={form.control}
          name="userSeq"
          render={({ field }) => {
            const handleChange = () => {};
            return (
              <UserInputFormItem
                value={field.value}
                onValueChange={field.onChange}
              />
            );
          }}
        />

        <FormField
          control={form.control}
          name="contents"
          render={({ field }) => (
            <TextAreaFormItem
              className="h-20"
              label="내용"
              placeholder="내용"
              {...field}
              required
            />
          )}
        />
        <FormField
          control={form.control}
          name="images"
          render={({ field }) => (
            <ImageFormItem
              label="이미지"
              multiple={true}
              {...field}
              value={field.value}
              onChange={field.onChange}
              max={3}
            />
          )}
        />
        <div className="flex justify-end">
          <Button label="등록" size={"sm"} />
        </div>
      </form>
    </Form>
  );
};

export default ReplyAddForm;
