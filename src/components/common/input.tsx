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
        className,
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
          className,
        )}
        {...props}
      />
    </div>
  );
};

const TextArea = ({
  className,
  maxLength = 255,
  showCount = true,
  value,
  ...props
}: React.ComponentProps<"textarea"> & {
  maxLength?: number;
  showCount?: boolean;
}) => {
  const count = typeof value === "string" ? value.length : 0;
  return (
    <div className="relative w-full">
      <textarea
        className={cn(
          `text-sm px-3 py-1 h-40 rounded-[4px] border border-[var(--border)] transition-[border,box-shadow] duration-300 bg-white w-full
          hover:border-[var(--primary)]
          focus:outline-none focus:ring-1 focus:ring-[var(--primary)] focus:border-[var(--primary)] focus:ring-inset 
          resize-none
          `,
          showCount && "pb-8", // 글자수 공간 확보
          className,
        )}
        value={value}
        maxLength={maxLength}
        {...props}
      />

      {showCount && (
        <div className="absolute bottom-2 right-3 text-xs text-gray-500">
          <span
            className={count > maxLength ? "text-red-500 font-semibold" : ""}
          >
            {count}
          </span>
          <span className="text-gray-400"> / {maxLength}</span>
        </div>
      )}
    </div>
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
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { toast } from "sonner";
import { useDragAndDrop } from "@/hooks/dnd/darg-drop";
import ImageBox, { ImageBoxDialog } from "./image-box";

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
  },
);
PasswordInput.displayName = "PasswordInput";

interface FileInputProps extends Omit<
  React.ComponentProps<"input">,
  "value" | "onChange"
> {
  className?: string;
  multiple?: boolean;
  accept?: string;
  maxSize?: number; // bytes
  value?: File[];
  imageOnly?: boolean;
  isVertical?: boolean;
  max?: number;
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
      max,
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

    useEffect(() => {
      console.log("=======값");
      console.log(value);
    }, [value]);

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

      //전체 파일수 제한
      if (max && multiple) {
        const curLen =
          value.length + (existingFiles?.length || 0) + fileList.length;
        console.log(max);
        console.log(curLen);
        if (max < curLen) {
          toast.error(`최대 ${max}의 파일만 업로드 가능합니다.`);
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

      // input 요소의 value 초기화
      if (internalRef.current) {
        internalRef.current.value = "";
      }
      // setFiles(updatedFiles);
      onFilesChange?.(updatedFiles);
    };

    return (
      <div
        className={cn(
          `flex flex-col gap-6 h-auto  md:flex-row  ${
            isVertical ? "md:flex-col " : null
          }`,
          className,
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
          } h-32 flex flex-col items-center xl:p-0 py-6 justify-center   w-full rounded-[4px] border-2 border-dashed border-[var(--icon)] hover:bg-[var(--background)] hover:cursor-pointer ${
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
            <div className="bg-gray-200 rounded-[50px] p-3">
              <Upload className="text-[var(--description-light)]" size={20} />
            </div>
            <span className="text-sm text-[var(--description-dark)]">
              파일을 드래그하거나 클릭하세요
            </span>
          </div>
        </div>

        {value.length > 0 || (existingFiles && existingFiles.length > 0) ? (
          <div
            className={`min-w-0 w-full md:w-1/2  h-full flex flex-col gap-1 sm:h-auto sm:flex-none
             ${isVertical ? "md:w-full" : null}
          `}
          >
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
  },
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
    if (!file) {
      setImg(false);
      return;
    }
    console.log(file.name);
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
      className="flex flex-row justify-between px-2 py-1 items-center gap-2"
      variant={"list"}
    >
      <FileTextIcon className="text-[var(--icon)] flex-shrink-0" size={20} />
      <span className="text-sm truncate flex-1 min-w-0">{data}</span>
      <IconButton
        icon="X"
        onClick={() => onRemove(data)}
        className="flex-shrink-0"
      />
    </CustomCard>
  );
};

/**
 * 단일 파일(이미지)
 */

interface SingleImageDndInputProps {
  multiple?: false;
  value?: File | null;
  existingFile?: string | null;
  isRemove?: boolean;
  // isVertical?: boolean;
  onFileChange: (file: File | null) => void;
  onRemoveExistingFile?: () => void;
  id?: string;
}

interface MultipleImageDndInputProps {
  multiple: true;
  value?: File[];
  existingFiles?: string[];
  removedExistingFiles?: string[];
  // isVertical?: boolean;
  onFilesChange: (file: File[]) => void;
  onRemoveExistingFile?: (file: string) => void;
  max?: number;
  id?: string;
}

type UnifiedImageDndInputProps =
  | SingleImageDndInputProps
  | MultipleImageDndInputProps;
export const ImageDndInput = (props: UnifiedImageDndInputProps) => {
  const { multiple = false } = props;
  /**
   * 입력
   * @param fileList
   * @returns
   */
  const handleFile = (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;

    //단일모드 입력
    if (!multiple) {
      const singleProps = props as SingleImageDndInputProps;
      if (fileList?.length > 1) {
        toast.error("최대 1개의 파일만 등록 가능합니다.");
        return;
      }
      singleProps.onFileChange(fileList[0]);
    } else {
      //다중모드 입력
      const multiProps = props as MultipleImageDndInputProps;
      const currentFiles = multiProps.value || [];
      const existingCount = multiProps.existingFiles?.length || 0;
      const removedCount = multiProps.removedExistingFiles?.length || 0;
      const curExistingCount = existingCount - removedCount;

      //최대 개수 체크
      if (multiProps.max) {
        const totalCount =
          currentFiles.length + curExistingCount + fileList.length; // 등록할 값+ 이미 등록된(서버) 값 + 현재 추가한 값
        if (totalCount > multiProps.max) {
          toast.error(`최대 ${multiProps.max}개의 파일만 업로드 가능합니다.`);
          return;
        }
        const newFiles = Array.from(fileList);
        multiProps.onFilesChange([...currentFiles, ...newFiles]);
      }
    }
  };

  const { isDragOver, dragHandlers } = useDragAndDrop({ onDrop: handleFile });

  //단일모드 렌더링
  if (!multiple) {
    const singleProps = props as SingleImageDndInputProps;
    console.log("이미지:", singleProps.existingFile);
    console.log("isRemove : ", singleProps.isRemove);

    const hasImage =
      singleProps.value || (singleProps.existingFile && !singleProps.isRemove);
    console.log(
      "hasImage : ",
      singleProps.value || (singleProps.existingFile && !singleProps.isRemove),
    );
    const imageSource = singleProps.value
      ? URL.createObjectURL(singleProps.value)
      : singleProps.existingFile || "";

    const handleRemoveFile = () => {
      if (singleProps.value) singleProps.onFileChange(null);
      else singleProps.onRemoveExistingFile?.();
    };

    return (
      <div>
        <input
          className="hidden"
          id={`input-file-single-${props.id}`}
          type="file"
          onChange={(e) => handleFile(e.target.files)}
          multiple={false}
          accept="image/*"
        />
        {hasImage ? (
          <ImageBox
            src={imageSource}
            onRemove={handleRemoveFile}
            isEdit={true}
          />
        ) : (
          <label
            htmlFor={`input-file-single-${props.id}`}
            className="block cursor-pointer"
          >
            <DragDropZone isDragOver={isDragOver} dragHandlers={dragHandlers} />
          </label>
        )}
      </div>
    );
  }

  //멀티 렌더링
  const multiProps = props as MultipleImageDndInputProps;
  const currentFiles = multiProps.value || [];
  const existingFiles = multiProps.existingFiles || [];
  const removedFiles = multiProps.removedExistingFiles || [];
  const displayExistingFiles = existingFiles.filter(
    (f) => !removedFiles.includes(f),
  );
  const hasFiles = currentFiles.length > 0 || displayExistingFiles.length > 0;

  const handleRemoveNewFile = (file: File) => {
    multiProps.onFilesChange(currentFiles.filter((f) => f !== file));
  };

  return (
    <div className="flex flex-col gap-4 min-w-0 w-full overflow-hidden">
      <input
        className="hidden"
        id={`input-file-single-${props.id}`}
        type="file"
        onChange={(e) => handleFile(e.target.files)}
        multiple={true}
        accept="image/*"
      />
      <label
        htmlFor={`input-file-single-${props.id}`}
        className="block cursor-pointer"
      >
        <DragDropZone isDragOver={isDragOver} dragHandlers={dragHandlers} />
      </label>
      {hasFiles ? (
        <ScrollArea className="w-full">
          <div className="flex flex-row gap-4 ">
            {existingFiles.map((v, i) => (
              <ImageBox
                src={v}
                key={i}
                isEdit
                onRemove={() => multiProps.onRemoveExistingFile?.(v)}
              />
            ))}
            {currentFiles.map((file, idx) => {
              console.log(file);
              return (
                <ImageBox
                  key={`new-${idx}`}
                  src={URL.createObjectURL(file)}
                  onRemove={() => handleRemoveNewFile(file)}
                  isEdit
                />
              );
            })}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      ) : null}
    </div>
  );
};

const CheckBox = ({
  className,
  type,
  ...props
}: React.ComponentProps<"input">) => {
  return <input type="checkbox" {...props} />;
};

export const DragDropZone = ({
  isDragOver,
  dragHandlers,
  children,
}: {
  isDragOver: boolean;
  dragHandlers: any;
  children?: React.ReactNode;
}) => {
  return (
    <div
      className={`
          flex flex-col items-center justify-center h-32  w-full rounded-[4px] border-2 border-dashed border-[var(--icon)] hover:bg-[var(--background)] hover:cursor-pointer ${
            isDragOver
              ? "border-solid border-[var(--primary)] bg-[var(--background)]"
              : ""
          }`}
      id="input-file"
      onDragEnter={dragHandlers.onDragEnter}
      onDragOver={dragHandlers.onDragOver}
      onDragLeave={dragHandlers.onDragLeave}
      onDrop={dragHandlers.onDrop}
    >
      {children || (
        <div className={`flex flex-col items-center justify-center gap-6 `}>
          <div className="bg-gray-200 rounded-[50px] p-3">
            <Upload className="text-[var(--description-light)]" size={20} />
          </div>
          <span className="text-sm text-[var(--description-dark)]">
            파일을 드래그하거나 클릭하세요
          </span>
        </div>
      )}
    </div>
  );
};

export const DragDropZoneChildren = ({
  isDragOver,
  dragHandlers,
  children,
}: {
  isDragOver: boolean;
  dragHandlers: any;
  children?: React.ReactNode;
}) => {
  return (
    <div
      className={`
          flex flex-col items-center justify-center w-full rounded-[4px] ${
            children ? "" : "border-2 border-dashed "
          } border-[var(--icon)] hover:bg-[var(--background)] hover:cursor-pointer ${
            isDragOver
              ? "border-solid border-[var(--primary)] bg-[var(--background)]"
              : ""
          }`}
      id="input-file"
      onDragEnter={dragHandlers.onDragEnter}
      onDragOver={dragHandlers.onDragOver}
      onDragLeave={dragHandlers.onDragLeave}
      onDrop={dragHandlers.onDrop}
    >
      {children || (
        <div className={`flex flex-col items-center justify-center gap-6 `}>
          <div className="bg-[var(--primary)] rounded-[50px] p-2">
            <Upload className="text-white" size={20} />
          </div>
          <span className="text-md text-[var(--description-dark)]">
            파일을 드래그하거나 클릭하세요
          </span>
        </div>
      )}
    </div>
  );
};

export { InputSearch, TextArea, PasswordInput, DragNDropInput, CheckBox };

export default Input;
