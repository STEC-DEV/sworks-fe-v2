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
import { useRequestTaskStore } from "@/store/normal/req/main";
import {
  convertRecordDataToFormData,
  convertSelectOptionType,
} from "@/utils/convert";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import React, { Suspense, useEffect } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

const formSchema = z.object({
  serviceTypeSeq: z.number("업무 유형을 선택해주세요."),
  title: z.string("제목을 입력해주세요.").min(1, "제목을 입력해주세요."),
  description: z.string("내용을 입력해주세요.").min(1, "내용을 입력해주세요."),
  images: z.array(z.instanceof(File)),
});

type FormType = z.infer<typeof formSchema>;

const RequestAddForm = ({ onClose }: { onClose: () => void }) => {
  const { addServiceType, getServiceType, getRequestTask, postAddReqTask } =
    useRequestTaskStore();
  const searchParams = useSearchParams();
  const form = useForm<FormType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      serviceTypeSeq: undefined,
      title: "",
      description: "",
      images: [],
    },
  });

  useEffect(() => {
    getServiceType();
  }, []);
  const handleSubmit = async (values: FormType) => {
    const formData = convertRecordDataToFormData(values);
    const res = await postAddReqTask(formData);

    res && searchParams
      ? getRequestTask(new URLSearchParams(searchParams))
      : null;
    onClose();
  };
  return (
    <Suspense>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="flex-1 flex flex-col min-h-0"
        >
          <div className="flex-1 overflow-hidden min-h-0">
            <ScrollArea className="h-full w-full">
              <div className="h-full flex flex-col gap-6 px-6 pb-1">
                <FormField
                  control={form.control}
                  name="serviceTypeSeq"
                  render={({ field }) => {
                    const handleChange = (value: string) => {
                      if (!value) return;
                      field.onChange(Number(value));
                    };
                    return (
                      <SelectFormItem
                        label="업무유형"
                        selectItem={
                          addServiceType
                            ? convertSelectOptionType(addServiceType)
                            : []
                        }
                        onValueChange={handleChange}
                        value={field.value?.toString()}
                        required
                      />
                    );
                  }}
                />
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
                  name="images"
                  render={({ field }) => (
                    <ImageFormItem
                      label="이미지"
                      multiple={true}
                      max={3}
                      {...field}
                      value={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />
              </div>
            </ScrollArea>
          </div>
          <div className="flex-shrink-0 px-6 pt-4">
            <Button label="생성" />
          </div>
        </form>
      </Form>
    </Suspense>
  );
};

export default RequestAddForm;
