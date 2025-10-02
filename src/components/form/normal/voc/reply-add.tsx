import Button from "@/components/common/button";
import CheckFormItem from "@/components/common/form-input/check-field";
import FileFormItem from "@/components/common/form-input/file-field";
import SelectFormItem from "@/components/common/form-input/select-field";
import {
  TextAreaFormItem,
  TextFormItem,
} from "@/components/common/form-input/text-field";
import { Form, FormField } from "@/components/ui/form";
import { useVocDetailStore } from "@/store/normal/voc/detail-store";
import { ProcessStatus } from "@/types/common/basic-code";
import {
  convertRecordDataToFormData,
  convertSelectOptionType,
} from "@/utils/convert";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

const formSchema = z.object({
  logSeq: z.number(),
  content: z.string().min(3, "3자 이상 입력해주세요."),
  status: z.number("처리상태를 선택해주세요."),
  sendYn: z.boolean(),
  images: z.array(z.instanceof(File)),
});

type AddFormType = z.infer<typeof formSchema>;

const ReplyAddForm = () => {
  const { vocDetail, postAddReply, getVocDetail } = useVocDetailStore();
  const form = useForm<AddFormType>({
    resolver: zodResolver(formSchema),
    reValidateMode: "onSubmit",
    defaultValues: {
      logSeq: undefined,
      content: "",
      status: undefined,
      sendYn: false,
      images: [],
    },
  });

  useEffect(() => {
    if (!vocDetail) return;
    form.setValue("logSeq", vocDetail.logs.logSeq);
  }, [vocDetail]);

  const handleSubmit = async (values: AddFormType) => {
    if (!vocDetail) return;
    const formData = convertRecordDataToFormData(values);
    const res = await postAddReply(formData);
    res.data ? toast.success("등록") : toast.error(res.message);
    await handleReset();
    await getVocDetail(vocDetail.logs.logSeq.toString());
  };

  const handleReset = async () => {
    if (!vocDetail) return;

    form.reset({
      logSeq: vocDetail.logs.logSeq,
      content: "",
      status: undefined,
      sendYn: false,
      images: [],
    });

    form.clearErrors();
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col gap-6"
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
                // key={field.value || "empty"}
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
          name="content"
          render={({ field }) => (
            <TextAreaFormItem placeholder="내용" label="내용" {...field} />
          )}
        />
        {vocDetail && vocDetail.logs.replyYn ? (
          <FormField
            control={form.control}
            name="sendYn"
            render={({ field }) => (
              <CheckFormItem
                label="알람전송"
                checked={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                name={field.name}
                ref={field.ref}
              />
            )}
          />
        ) : null}

        <FormField
          control={form.control}
          name="images"
          render={({ field }) => (
            <FileFormItem
              label="첨부파일"
              accept="accept"
              multiple={true}
              {...field}
              value={field.value}
              onChange={field.onChange}
              imageOnly
              isVertical
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
