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

const InputSearch = ({
  className,
  ...props
}: React.ComponentProps<"input">) => {
  return (
    <div className="flex gap-2 items-center justify-center border-b">
      <Search size={24} className="text-[var(--icon)]" />
      <Input
        className={cn(
          "flex-1 px-0 border-none focus:ring-0 focus:border-none ",
          className
        )}
        {...props}
      />
    </div>
  );
};

const TextArea = ({
  className,
  ...props
}: React.ComponentProps<"textarea">) => {
  return (
    <textarea
      className={cn(
        `text-sm px-3 py-1 h-40 rounded-[4px] border border-[var(--border)] transition-[border,box-shadow] duration-300 bg-white
        hover:border-[var(--primary)]
        focus:outline-none focus:ring-1 focus:ring-[var(--primary)] focus:border-[var(--primary)] focus:ring-inset 
        resize-none
        
        `,
        className
      )}
      {...props}
    />
  );
};

import {
  EyeIcon,
  EyeOffIcon,
  FileIcon,
  FileTextIcon,
  ImageIcon,
  Search,
  Upload,
  XIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { file } from "zod";
import CustomCard from "./card";
import IconButton from "./icon-button";
import { ScrollArea } from "../ui/scroll-area";
import { toast } from "sonner";

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
  imageOnly?: boolean;
  isVertical?: boolean;
  //수정 시 기존에 존재하는 파일
  existingFiles?: string[];
  onFilesChange?: (files: File[]) => void;
  //수정 시 기존에 존재하는 파일 삭제 seq전달
  onRemoveExistFiles?: (files: string) => void;
  // [key: string]: any;
}

const DragNDropInput = React.forwardRef<HTMLInputElement, FileInputProps>(
  (props, forwardedRef) => {
    const {
      className,
      value = [],
      multiple = true,
      accept,
      maxSize = 10 * 1024 * 1024,
      imageOnly = false,
      isVertical = false,
      existingFiles,
      onFilesChange,
      onRemoveExistFiles,
      ...rest
    } = props;
    const [isDragOver, setIsDragOver] = useState(false);
    const internalRef = React.useRef<HTMLInputElement>(null);

    // 두 ref를 모두 세팅
    const setRefs = (el: HTMLInputElement | null) => {
      internalRef.current = el;
      if (typeof forwardedRef === "function") {
        forwardedRef(el);
      } else if (forwardedRef) {
        (
          forwardedRef as React.MutableRefObject<HTMLInputElement | null>
        ).current = el;
      }
    };

    // 파일 입력 클릭
    const handleClick = () => {
      internalRef.current?.click();
    };

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

    //파일검증
    const validateFile = (file: File): boolean => {
      let allowExtension = [
        // 이미지
        ".jpg",
        ".jpeg",
        ".png",
        ".gif",
        ".webp",
        ".bmp",
      ];
      const docsExtension = [
        //문서
        ".pdf",
        ".doc",
        ".docx",
        ".xls",
        ".xlsx",
        ".csv",
        ".hwp",
        ".hwpx",
      ];

      const fileExtension = file.name.toLowerCase().split(".").pop();
      allowExtension = imageOnly
        ? [...allowExtension]
        : [...allowExtension, ...docsExtension];
      if (!fileExtension) {
        toast.error("파일 확장자가 존재하지않습니다.");
        return false;
      }

      if (!allowExtension.includes(`.${fileExtension}`)) {
        toast.error(`.${fileExtension}은(는) 허용되지않은 확장자입니다.`);
        return false;
      } else {
        return true;
      }
    };

    //파일 올리는 함수
    const handleFiles = (fileList: FileList | null) => {
      if (!fileList || fileList?.length === 0) return;

      //단일이면서 이미 파일이 있는경우
      if (!multiple) {
        const totalExistingFiles = (existingFiles?.length || 0) + value.length;
        if (totalExistingFiles >= 1) {
          toast.error("최대 1개의 파일만 업로드 가능합니다.");
          return;
        }
      }

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
      <div
        className={cn(
          ` h-auto  flex flex-col gap-6 md:h-60 md:flex-row  ${
            isVertical ? "md:flex-col md:h-auto" : null
          }`,
          className
        )}
      >
        <input
          ref={setRefs}
          type="file"
          multiple={multiple}
          accept={accept}
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
          {...rest}
        />
        <div
          className={` ${
            value.length > 0
              ? `md:w-1/2 ${isVertical ? "md:w-full" : null}`
              : ""
          } flex flex-col items-center justify-center h-60  w-full rounded-[4px] border-2 border-dashed border-[var(--icon)] hover:bg-[var(--background)] hover:cursor-pointer ${
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

        {value.length > 0 || (existingFiles && existingFiles.length > 0) ? (
          <div
            className={` w-full md:w-1/2  h-full flex flex-col gap-1 sm:h-auto sm:flex-none
             ${isVertical ? "md:w-full" : null}
          `}
          >
            {/* <span className="text-sm text-[var(--description-light)]">
              선택된 파일
            </span> */}
            <div className="flex-1 min-h-0 ">
              <ScrollArea className=" h-full sm:h-auto sm:max-h-none [&_[data-radix-scroll-area-viewport]>:first-child]:!block">
                <div className=" flex flex-col gap-2 pr-2 w-full min-w-0">
                  {existingFiles?.map((v, i) => (
                    <ExistFileBox
                      key={i}
                      data={v}
                      onRemove={(data) => onRemoveExistFiles?.(data)}
                    />
                  ))}
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
  }
);

const FileBox = ({
  file,
  onRemove,
}: {
  file: File;
  onRemove: (file: File) => void;
}) => {
  const [img, setImg] = useState<boolean>(false);
  const imgExtension = [
    // 이미지
    ".jpg",
    ".jpeg",
    ".png",
    ".gif",
    ".webp",
    ".bmp",
  ];

  useEffect(() => {
    const fileExtension = file.name.toLowerCase().split(".").pop();
    setImg(imgExtension.includes(`.${fileExtension}`));
  }, [file]);

  return (
    <CustomCard
      className="flex-row justify-between px-2 py-1 items-center"
      variant={"list"}
    >
      <div className="flex items-center gap-2">
        {img ? (
          <ImageIcon className="text-[var(--icon)]" size={20} />
        ) : (
          <FileTextIcon className="text-[var(--icon)]" size={20} />
        )}

        <span className="text-sm">{file.name}</span>
      </div>

      <IconButton icon="X" onClick={() => onRemove(file)} />
    </CustomCard>
  );
};

const ExistFileBox = ({
  data,
  onRemove,
}: {
  data: any;
  onRemove: (data: any) => void;
}) => {
  return (
    <CustomCard
      className="w-full flex-row justify-between px-2 py-1 items-center min-w-0 overflow-hidden"
      variant={"list"}
    >
      <div className="flex items-center gap-2 min-w-0 flex-1">
        <FileTextIcon className="text-[var(--icon)] flex-shrink-0" size={20} />
        <span className="text-sm truncate min-w-0 flex-1">{data}</span>
      </div>
      <IconButton
        icon="X"
        onClick={() => onRemove(data)}
        className="flex-shrink-0 ml-2"
      />
    </CustomCard>
  );
};

const CheckBox = ({
  className,
  type,
  ...props
}: React.ComponentProps<"input">) => {
  return <input type="checkbox" />;
};

export { InputSearch, TextArea, PasswordInput, DragNDropInput, CheckBox };

export default Input;
