import { FormControl, FormItem, FormMessage } from "@/components/ui/form";
import React, { useMemo } from "react";
import { DragNDropInput } from "../input";
import { FieldValues } from "react-hook-form";

interface FileFormItemProps<
  T extends FieldValues,
  Multiple extends boolean = true
> extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "onChange" | "value"
  > {
  label?: string;
  required?: boolean;
  multiple?: Multiple;
  accept?: string;
  maxSize?: number;
  isVertical?: boolean;
  // React Hook Form props
  onChange?: (...event: any[]) => void;
  value?: File[];
  imageOnly?: boolean;
  //생성이 아닌 수정의 경우 기존 파일이 string 타입의 path로 받아오기에 해당 파라미터로 받아서 구현
  existingFiles?: string[];
  onRemoveExitedFiles?: (data: string) => void;
}

const FileFormItem = <T extends FieldValues, Multiple extends boolean = true>({
  label,
  required = false,
  multiple = true as Multiple,
  accept,
  maxSize = 10 * 1024 * 1024, // 10MB 기본값
  imageOnly = false,
  isVertical = false,
  onChange, // React Hook Form의 onChange
  value = [], // React Hook Form의 value
  existingFiles,
  onRemoveExitedFiles,
  ...props
}: FileFormItemProps<T, Multiple>) => {
  const handleFilesChange = (files: File[]) => {
    onChange?.(files); // React Hook Form에 알림
  };

  //value를 배열로 정규화
  const normalizedValue = useMemo(() => {
    if (!value) return [];
    return Array.isArray(value) ? value : [value];
  }, [value]);

  return (
    <FormItem className="w-full">
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
          value={normalizedValue}
          accept={accept}
          maxSize={maxSize}
          multiple={multiple}
          onFilesChange={handleFilesChange}
          existingFiles={existingFiles}
          onRemoveExistFiles={onRemoveExitedFiles}
          imageOnly={imageOnly}
          isVertical={isVertical}
          {...props}
        />
      </FormControl>
      <FormMessage className="text-xs text-red-500" />
    </FormItem>
  );
};

export default FileFormItem;
