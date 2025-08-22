import { FormControl, FormItem, FormMessage } from "@/components/ui/form";
import React from "react";
import { DragNDropInput } from "../input";
import { FieldValues } from "react-hook-form";

interface FileFormItemProps<T extends FieldValues>
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "onChange" | "value"
  > {
  label?: string;
  required?: boolean;
  multiple?: boolean;
  accept?: string;
  maxSize?: number;
  // React Hook Form props
  onChange?: (...event: any[]) => void;
  value?: File[];
  imageOnly?: boolean;
}

const FileFormItem = <T extends FieldValues>({
  label,
  required = false,
  multiple = true,
  accept,
  maxSize = 10 * 1024 * 1024, // 10MB 기본값
  imageOnly = false,
  onChange, // React Hook Form의 onChange
  value = [], // React Hook Form의 value
  ...props
}: FileFormItemProps<T>) => {
  const handleFilesChange = (files: File[]) => {
    onChange?.(files); // React Hook Form에 알림
  };

  return (
    <FormItem>
      <div>
        {label ? (
          <span className="text-xs text-[var(--description-light)]">
            {label}
          </span>
        ) : null}
        {required ? <span className="text-xs text-red-500">*</span> : null}
      </div>
      <FormControl>
        <DragNDropInput
          value={value}
          accept={accept}
          maxSize={maxSize}
          multiple={multiple}
          onFilesChange={handleFilesChange}
          imageOnly={imageOnly}
          {...props}
        />
      </FormControl>
      <FormMessage className="text-xs text-red-500" />
    </FormItem>
  );
};

export default FileFormItem;
