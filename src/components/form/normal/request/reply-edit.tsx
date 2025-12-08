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
import { ScrollArea } from "@/components/ui/scroll-area";
import { useDecodeParam } from "@/hooks/params";
import { useReqDetailStore } from "@/store/normal/req/detail";
import { ProcessStatus } from "@/types/common/basic-code";
import { Request, RequestLog } from "@/types/normal/request/req-detail";
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
  contents: z.string("내용을 입력해주세요.").min(1, "내용을 입력해주세요."),
  status: z.number("처리상태를 선택해주세요."),
  userSeq: z.array(z.number()).min(1, "담당자를 선택해주세요."),
  insertImages: z.array(z.instanceof(File)),
  deleteAttaches: z.array(z.number()),
});

type ReplyEditFormSchema = z.infer<typeof formSchema>;

const ReplyEditForm = ({
  data,
  onClose,
}: {
  data: RequestLog;
  onClose: () => void;
}) => {
  const { postUpdateReply, getRequestDetail } = useReqDetailStore();
  const { rawValue } = useDecodeParam("id");
  const form = useForm<ReplyEditFormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      logSeq: undefined,
      contents: "",
      status: 0,
      userSeq: [],
      insertImages: [],
      deleteAttaches: [],
    },
  });

  useEffect(() => {
    if (!form || !data) return;
    console.log(data);
    form.reset({
      logSeq: data.logSeq,
      contents: data.logContents,
      status: data.logStatus,
      userSeq: data.users.map((v) => v.managerSeq),
      insertImages: [],
      deleteAttaches: [],
    });
  }, [form, data]);

  const handleSubmit = async (values: ReplyEditFormSchema) => {
    const formData = convertRecordDataToFormData(values);
    const res = await postUpdateReply(formData);
    onClose();
    await getRequestDetail(rawValue);
    form.reset();
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit, (err) => console.log(err))}
        className="flex flex-col gap-4 w-full"
      >
        <ScrollArea className="overflow-hidden">
          <div className="px-6 pb-2">
            <div className="flex flex-col gap-6">
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
                  return (
                    <UserInputFormItem
                      {...field}
                      value={field.value}
                      onValueChange={field.onChange}
                      required
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
                name="insertImages"
                render={({ field }) => {
                  const handleRemove = (file: string) => {
                    const curRemoveFiles =
                      form.getValues("deleteAttaches") || [];
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
                      id="reply"
                      label="이미지"
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
          </div>
        </ScrollArea>

        <div className="px-6 shrink-0">
          <Button label="저장" />
        </div>
      </form>
    </Form>
  );
};

export default ReplyEditForm;
