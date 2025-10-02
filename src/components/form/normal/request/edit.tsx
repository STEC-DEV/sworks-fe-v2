import Button from "@/components/common/button";
import FileFormItem, {
  ImageFormItem,
} from "@/components/common/form-input/file-field";
import SelectFormItem from "@/components/common/form-input/select-field";
import {
  TextAreaFormItem,
  TextFormItem,
} from "@/components/common/form-input/text-field";
import { Form, FormField } from "@/components/ui/form";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useDecodeParam } from "@/hooks/params";
import { useReqDetailStore } from "@/store/normal/req/detail";
import { useRequestTaskStore } from "@/store/normal/req/main";
import {
  convertRecordDataToFormData,
  convertSelectOptionType,
} from "@/utils/convert";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

const formSchema = z.object({
  requestSeq: z.number(),
  title: z.string("제목을 입력해주세요.").min(1, "제목을 입력해주세요."),
  description: z.string("내용을 입력해주세요.").min(1, "내용을 입력해주세요."),
  removeImage: z.array(z.number().nullable()),
  insertImage: z.array(z.instanceof(File)),
});

type FormType = z.infer<typeof formSchema>;

const RequestEditForm = ({ onClose }: { onClose: () => void }) => {
  const { getServiceType } = useRequestTaskStore();
  const { request, getRequestDetail, patchUpdateRequestDetail } =
    useReqDetailStore();
  const { rawValue: id } = useDecodeParam("id");

  const [existingFiles, setExistingFiles] = useState<string[]>([]);
  const form = useForm<FormType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      requestSeq: undefined,
      title: "",
      description: "",
      removeImage: [],
      insertImage: [],
    },
  });

  useEffect(() => {
    if (!id) return;
    getRequestDetail(id);
  }, [id]);

  useEffect(() => {
    getServiceType();
  }, []);

  useEffect(() => {
    if (!request) return;
    form.reset({
      requestSeq: request.requestSeq,
      title: request.title,
      description: request.description,
      removeImage: [],
      insertImage: [],
    });
    setExistingFiles(request.attaches.map((v, i) => v.path));
  }, [form, request]);
  const handleSubmit = async (values: FormType) => {
    const formData = convertRecordDataToFormData(values);
    console.log(values);
    const res = await patchUpdateRequestDetail(formData);

    res && request ? getRequestDetail(request.requestSeq.toString()) : null;
    onClose();
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit, (err) => console.log(err))}
        className="flex-1 flex flex-col min-h-0"
      >
        <div className="flex-1 overflow-hidden min-h-0">
          <ScrollArea className="h-full w-full">
            <div className="h-full flex flex-col gap-6 px-6 pb-1">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <TextFormItem
                    label="제목"
                    placeholder="제목"
                    {...field}
                    required
                  />
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <TextAreaFormItem
                    label="내용"
                    placeholder="내용"
                    {...field}
                    required
                  />
                )}
              />
              <FormField
                control={form.control}
                name="insertImage"
                render={({ field }) => {
                  //기존 존재하는 파일 삭제
                  const handleRemoveExistingImage = (file: string) => {
                    console.log("실행");
                    const removeFile = request?.attaches.find(
                      (f) => f.path === file
                    );
                    if (!removeFile) return;
                    const removeImageValue = form.getValues("removeImage");
                    form.setValue("removeImage", [
                      ...removeImageValue,
                      removeFile?.attachSeq,
                    ]);
                    setExistingFiles((prev) => prev.filter((e) => e !== file));
                  };

                  return (
                    <ImageFormItem
                      label="이미지"
                      multiple={true}
                      {...field}
                      value={field.value}
                      onChange={field.onChange}
                      max={3}
                      existingFiles={existingFiles}
                      onRemoveExistingFile={handleRemoveExistingImage}
                    />
                  );
                }}
              />
            </div>
          </ScrollArea>
        </div>
        <div className="flex-shrink-0 px-6 pt-4">
          <Button label="저장" />
        </div>
      </form>
    </Form>
  );
};

export default RequestEditForm;
