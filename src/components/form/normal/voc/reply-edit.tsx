import Button from "@/components/common/button";
import FileFormItem, {
  ImageFormItem,
} from "@/components/common/form-input/file-field";
import SelectFormItem from "@/components/common/form-input/select-field";
import { TextAreaFormItem } from "@/components/common/form-input/text-field";
import { Form, FormField } from "@/components/ui/form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useDecodeParam } from "@/hooks/params";
import { useVocDetailStore } from "@/store/normal/voc/detail-store";
import { ProcessStatus } from "@/types/common/basic-code";
import { convertSelectOptionType, objectToFormData } from "@/utils/convert";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

const formSchema = z.object({
  replySeq: z.number(),
  content: z.string(),
  status: z.number(),
  deleteAttaches: z.array(z.number()),
  insertAttaches: z.array(z.instanceof(File)),
});

type ReplyEditFormType = z.infer<typeof formSchema>;

interface ReplyEditFormProps {
  data: VocReply;
  onClose: () => void;
}

const ReplyEditForm = ({ data, onClose }: ReplyEditFormProps) => {
  const { rawValue } = useDecodeParam("id");
  const { getVocDetail, patchUpdateReply } = useVocDetailStore();
  const form = useForm<ReplyEditFormType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      replySeq: undefined,
      content: "",
      status: undefined,
      deleteAttaches: [],
      insertAttaches: [],
    },
  });

  useEffect(() => {
    if (!data) return;
    form.reset({
      replySeq: data.replySeq,
      content: data.content,
      status: data.status,
      deleteAttaches: [],
      insertAttaches: [],
    });
  }, [form, data]);

  const handleSubmit = async (values: ReplyEditFormType) => {
    const formData = objectToFormData(values);
    await patchUpdateReply(formData);
    await getVocDetail(rawValue);
    onClose();
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit, (err) => console.log(err))}
        className="flex flex-col gap-6 w-full"
      >
        <ScrollArea className="overflow-hidden">
          <div className="flex flex-col gap-6 px-6 pb-1">
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
              name="content"
              render={({ field }) => (
                <TextAreaFormItem label="내용" placeholder="내용" {...field} />
              )}
            />
            <FormField
              control={form.control}
              name="insertAttaches"
              render={({ field }) => {
                const handleRemove = (file: string) => {
                  const curRemoveFiles = form.getValues("deleteAttaches") || [];
                  const exitedFiles = data.attaches.filter(
                    (v) => !curRemoveFiles.includes(v.attachSeq)
                  );
                  const removeFile = exitedFiles.find(
                    (v) => v.path === file
                  )?.attachSeq;
                  if (!removeFile)
                    return toast.error("삭제할 이미지가 존재하지 않습니다.");

                  form.setValue("deleteAttaches", [
                    ...curRemoveFiles,
                    removeFile,
                  ]);
                };

                const existingFiles = () => {
                  const curRemoveFiles = form.watch("deleteAttaches") || [];
                  return data.attaches
                    .filter((v, i) => !curRemoveFiles.includes(v.attachSeq))
                    .map((v) => v.path);
                };

                return (
                  <ImageFormItem
                    label="이미지"
                    id="req-edit"
                    multiple={true}
                    {...field}
                    value={field.value}
                    onChange={field.onChange}
                    max={3}
                    existingFiles={existingFiles()}
                    onRemoveExistingFile={handleRemove}
                  />
                );
              }}
            />
          </div>
        </ScrollArea>
        <div className="shrink-0 px-6">
          <Button label="저장" />
        </div>
      </form>
    </Form>
  );
};

export default ReplyEditForm;
