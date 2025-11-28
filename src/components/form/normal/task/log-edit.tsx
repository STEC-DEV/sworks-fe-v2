import z from "zod";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField } from "@/components/ui/form";
import { TextAreaFormItem } from "@/components/common/form-input/text-field";
import { ImageFormItem } from "@/components/common/form-input/file-field";
import { ScrollArea } from "@/components/ui/scroll-area";
import Button from "@/components/common/button";
import { Log } from "@/types/normal/task/detail-daily";
import { toast } from "sonner";

const formSchema = z.object({
  issue: z.string(),
  deleteAttaches: z.array(z.number()),
  insertAttaches: z.array(z.instanceof(File)),
});
type LogEditFormType = z.infer<typeof formSchema>;

const LogEdit = ({
  log,
  onSubmit,
}: {
  log: Log;
  onSubmit: (values: Record<string, any>) => void;
}) => {
  const form = useForm<LogEditFormType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      issue: "",
      deleteAttaches: [],
      insertAttaches: [],
    },
  });

  useEffect(() => {
    if (!log) return;
    form.reset({
      issue: log.issue || "",
      deleteAttaches: [],
      insertAttaches: [],
    });
  }, [log]);
  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-6 w-full"
        onSubmit={form.handleSubmit(onSubmit, (err) => {
          console.log(err);
        })}
      >
        <ScrollArea>
          <div className="px-6 pb-2">
            <div className="flex flex-col gap-6 ">
              <FormField
                name="issue"
                control={form.control}
                render={({ field }) => (
                  <TextAreaFormItem
                    label="특이사항"
                    placeholder="특이사항"
                    {...field}
                  />
                )}
              />
              <FormField
                name="insertAttaches"
                control={form.control}
                render={({ field }) => {
                  const removeExitedFiles = (file: string) => {
                    const curRemoveFiles =
                      form.getValues("deleteAttaches") || [];
                    const exitedFiles = log.attach.filter(
                      (v) => !curRemoveFiles.includes(v.attachSeq)
                    );
                    const removeFile = exitedFiles.find(
                      (v) => v.images === file
                    )?.attachSeq;
                    if (!removeFile)
                      return toast.error("삭제할 이미지가 존재하지 않습니다.");

                    form.setValue("deleteAttaches", [
                      ...curRemoveFiles,
                      removeFile,
                    ]);
                  };
                  const existedFiles = () => {
                    const curRemoveFiles = form.watch("deleteAttaches") || [];
                    return (log?.attach ?? [])
                      .filter((v) => !curRemoveFiles.includes(v.attachSeq))
                      .map((v) => v.images);
                  };
                  return (
                    <ImageFormItem
                      label="이미지"
                      {...field}
                      value={field.value}
                      onChange={field.onChange}
                      multiple={true}
                      max={3}
                      existingFiles={existedFiles()}
                      onRemoveExistingFile={removeExitedFiles}
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

export default LogEdit;
