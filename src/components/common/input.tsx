"use client";
import { cn } from "@/lib/utils";
import React, { useEffect, useRef, useState } from "react";

const Input = ({
  className,
  type,
  ...props
}: React.ComponentProps<"input">) => {
  return (
    <input
      className={cn(
        `text-sm px-3 py-1 h-9 rounded-[4px] border border-[var(--border)] transition-[border,box-shadow] duration-300 bg-white
        hover:border-[var(--primary)]
        focus:outline-none focus:ring-1 focus:ring-[var(--primary)] focus:border-[var(--primary)] focus:ring-inset 
        `,
        className
      )}
      type={type}
      {...props}
    />
  );
};

import {
  EyeIcon,
  EyeOffIcon,
  FileIcon,
  FileTextIcon,
  Upload,
  XIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { file } from "zod";
import CustomCard from "./card";
import IconButton from "./icon-button";
import { ScrollArea } from "../ui/scroll-area";

interface PasswordInputProps extends React.ComponentProps<"input"> {}

const PasswordInput = React.forwardRef<HTMLInputElement>(
  ({ className, ...props }: PasswordInputProps, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const disabled =
      props.value === "" || props.value === undefined || props.disabled;

    return (
      <div className="relative">
        <Input
          type={showPassword ? "text" : "password"}
          className={cn("hide-password-toggle w-full", className)}
          ref={ref}
          {...props}
        />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent hover:cursor-pointer"
          onClick={() => setShowPassword((prev) => !prev)}
          disabled={disabled}
        >
          {showPassword && !disabled ? (
            <EyeIcon className="h-4 w-4" aria-hidden="true" />
          ) : (
            <EyeOffIcon className="h-4 w-4" aria-hidden="true" />
          )}
          <span className="sr-only">
            {showPassword ? "Hide password" : "Show password"}
          </span>
        </Button>

        {/* hides browsers password toggles */}
        <style>{`
					.hide-password-toggle::-ms-reveal,
					.hide-password-toggle::-ms-clear {
						visibility: hidden;
						pointer-events: none;
						display: none;
					}
				`}</style>
      </div>
    );
  }
);
PasswordInput.displayName = "PasswordInput";

interface FileInputProps
  extends Omit<React.ComponentProps<"input">, "value" | "onChange"> {
  className?: string;
  multiple?: boolean;
  accept?: string;
  maxSize?: number; // bytes
  value?: File[];
  onFilesChange?: (files: File[]) => void;
  [key: string]: any;
}

const DragNDropInput = ({
  className,
  value = [],
  multiple = true,
  accept,
  maxSize = 10 * 1024 * 1024, // 10MB 기본값
  onFilesChange,
  ...props
}: FileInputProps) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /** 드래그 처리 */
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    handleFiles(e.dataTransfer.files);
  };

  // 파일 입력 클릭
  const handleClick = () => {
    console.log("실행됨", fileInputRef.current?.click());
    fileInputRef.current?.click();
  };

  //파일검증
  const validateFile = (file: File): boolean => {
    return true;
  };

  //파일 올리는 함수
  const handleFiles = (fileList: FileList | null) => {
    if (!fileList) return;

    const newFiles = Array.from(fileList);

    //파일검증
    const validFiles = newFiles.filter(validateFile);
    if (validFiles.length !== newFiles.length) return;

    const updatedFiles = multiple ? [...value, ...validFiles] : validFiles;
    //console.log(updatedFiles);
    //setFiles(updatedFiles);
    onFilesChange?.(updatedFiles);
  };

  //파일 제거
  const handleRemoveFile = async (item: File) => {
    const updatedFiles = value.filter((v) => v !== item);
    // setFiles(updatedFiles);
    onFilesChange?.(updatedFiles);
  };

  return (
    <div className={cn("h-60 w-full flex  gap-6 ", className)}>
      <input
        ref={fileInputRef}
        type="file"
        multiple={multiple}
        accept={accept}
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
        {...props}
      />
      <div
        className={`flex-1 flex items-center justify-center h-full rounded-[4px] border-2 border-dashed border-[var(--icon)] hover:bg-[var(--background)] hover:cursor-pointer ${
          isDragOver
            ? "border-solid border-[var(--primary)] bg-[var(--background)]"
            : ""
        }`}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <div className={`flex flex-col items-center justify-center gap-6 `}>
          <div className="bg-[var(--primary)] rounded-[50px] p-2">
            <Upload className="text-white" size={20} />
          </div>
          <span className="text-lg font-bold">
            파일을 드래그하거나 클릭하세요
          </span>
          <span className="text-md text-[var(--description-light)]">
            여러 파일을 동시에 업로드할 수 있습니다
          </span>
        </div>
      </div>
      {value.length > 0 ? (
        <div className="flex-1 h-full flex flex-col gap-1 ">
          <span className="text-sm text-[var(--description-light)]">
            선택된 파일
          </span>
          <div className="flex-1 min-h-0">
            <ScrollArea className="h-full">
              <div className="flex flex-col gap-2 pr-2">
                {value.map((v, i) => (
                  <FileBox file={v} key={i} onRemove={handleRemoveFile} />
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      ) : null}
    </div>
  );
};

const FileBox = ({
  file,
  onRemove,
}: {
  file: File;
  onRemove: (file: File) => void;
}) => {
  return (
    <CustomCard
      className="flex-row justify-between px-2 py-1 items-center"
      variant={"list"}
    >
      <div className="flex gap-2">
        <FileTextIcon className="text-[var(--icon)]" size={20} />
        <span>{file.name}</span>
      </div>

      <IconButton icon="X" onClick={() => onRemove(file)} />
    </CustomCard>
  );
};

export { PasswordInput, DragNDropInput };

export default Input;
