import CustomCard from "@/components/common/card";
import IconButton from "@/components/common/icon-button";
import Input, {
  DragDropZone,
  DragDropZoneChildren,
} from "@/components/common/input";
import { FormControl, FormItem, FormMessage } from "@/components/ui/form";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { useDragAndDrop } from "@/hooks/dnd/darg-drop";
import {
  isExistingAttach,
  ScheduleAttach,
  ScheduleFormAttach,
} from "@/types/normal/schedule/day-schedule";
import { PlusIcon } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const ScheduleFileFormItem = () => {
  return <div></div>;
};

export const ScheduleImageFileFormItem = ({
  label,
  required = false,
  value,
  existedFile,
  removeExistedFile,
  max = 3,
  photoType,
  onChange,
  onExistedFileRemove,
  onDeleteFile,
}: {
  label?: string;
  photoType: number;
  value: ScheduleFormAttach[];
  existedFile: ScheduleAttach[];
  removeExistedFile: ScheduleAttach[];
  max?: number;

  onChange: (value: ScheduleFormAttach[]) => void;
  onExistedFileRemove: (seq: number) => void;
  onDeleteFile: (data: ScheduleFormAttach) => void;
  required?: boolean;
}) => {
  const [total, setTotal] = useState<number>(0);
  //기존 존재파일 디스플레이 상태
  const [displayedExistedFiles, setDisplayedExistedFiles] = useState<
    ScheduleAttach[]
  >([]);

  console.log("🟡 ScheduleImageFileFormItem 렌더!");
  console.log("🟡 받은 props - value:", value);
  console.log("🟡 받은 props - existedFile:", existedFile);
  console.log("🟡 현재 total:", total);

  //기존 존재파일 디스플레이 상태 업데이트
  useEffect(() => {
    setDisplayedExistedFiles(existedFile);
  }, [existedFile]);

  useEffect(() => {
    console.log("🟡 value 변경 감지! 새 value:", value);
  }, [value]);

  //전체 파일수 계산
  useEffect(() => {
    // 신규 파일만 카운트
    const newFilesCount = value.filter((v) => !isExistingAttach(v)).length;
    // 기존 파일 - 삭제된 파일
    const existedCount = existedFile.length - removeExistedFile.length;
    const newTotal = newFilesCount + existedCount;
    console.log("🟡 total 계산:");
    console.log("  newFilesCount:", newFilesCount);
    console.log("  existedCount:", existedCount);
    console.log("  newTotal:", newTotal);

    setTotal(newTotal);
  }, [value, existedFile, removeExistedFile]);

  // useEffect(() => {
  //   console.log("현재 이미지", value);
  // }, [value]);

  const handleRemoveFile = (data: ScheduleFormAttach) => {
    isExistingAttach(data)
      ? onExistedFileRemove(data.attachSeq)
      : onDeleteFile(data);
  };
  const handleNewFileUpdate = (data: ScheduleFormAttach) => {
    if (isExistingAttach(data)) {
      setDisplayedExistedFiles((prev) =>
        prev.map((file) => (file.attachSeq === data.attachSeq ? data : file)),
      );
      // 기존 파일은 attachSeq로 찾기
      const existingIndex = value.findIndex(
        (v) => isExistingAttach(v) && v.attachSeq === data.attachSeq,
      );

      if (existingIndex !== -1) {
        const newValue = [...value];
        newValue[existingIndex] = {
          ...value[existingIndex], // 기존 값 유지
          comments: data.comments ?? "", // 수정된 값만 덮어쓰기
          viewYn: data.viewYn,
        };
        onChange(newValue);
      } else {
        onChange([
          ...value,
          {
            attachSeq: data.attachSeq,
            photoType: photoType, // 컴포넌트의 photoType
            comments: data.comments ?? "",
            viewYn: data.viewYn,
            attaches: null,
          },
        ]);
      }
    } else {
      // 신규 파일 수정 - 참조로 찾기
      const newFileIndex = value.findIndex((v) => {
        // File 객체로 비교 (참조 비교)
        return !isExistingAttach(v) && v.attaches === data.attaches;
      });

      if (newFileIndex !== -1) {
        const newValue = [...value];
        newValue[newFileIndex] = data;
        onChange(newValue);
      }
    }
  };

  //파일 업로드 함수
  const handleFile = (fileList: FileList | null) => {
    console.log("handleFile 호출됨!", fileList);
    if (!fileList || fileList.length === 0) {
      console.log("파일 없음!");
      return;
    }

    const existedCount = existedFile.length || 0;
    const removeExistedCount = removeExistedFile.length || 0;
    const curExistedCount = existedCount - removeExistedCount;
    // 여기가 문제: value.length가 아니라 신규 파일만 세야 함
    const newFilesCount = value.filter((v) => !isExistingAttach(v)).length;
    const totalCount = curExistedCount + newFilesCount;

    console.log("📊 카운트 정보:");
    console.log("  existedCount:", existedCount);
    console.log("  removeExistedCount:", removeExistedCount);
    console.log("  curExistedCount:", curExistedCount);
    console.log("  newFilesCount:", newFilesCount);
    console.log("  totalCount:", totalCount);
    console.log("  max:", max);
    console.log("  새로 추가할 파일:", fileList.length);

    if (totalCount + fileList.length > max) {
      console.log("❌ 최대 개수 초과!");
      return toast.error(`최대 ${max}개의 파일만 등록 가능합니다.`);
    }
    const newFiles: ScheduleFormAttach[] = Array.from(fileList).map((file) => ({
      attachSeq: null,
      photoType: photoType, // 일반 파일
      attaches: file,
      comments: "",
      viewYn: true,
    }));
    console.log("✅ 새로 만든 파일:", newFiles);
    console.log("📦 현재 value:", value);
    console.log("🚀 onChange에 전달할 값:", [...value, ...newFiles]);

    // 기존 값에 새 파일 추가한 배열 전체 전달
    onChange([...value, ...newFiles]);
  };
  const { isDragOver, dragHandlers } = useDragAndDrop({ onDrop: handleFile });

  return (
    <FormItem className="w-full flex-1 flex flex-col gap-2 ">
      <div className="flex">
        {label ? (
          <span className="text-xs text-[var(--description-light)]">
            {label}
          </span>
        ) : null}
        {required ? <span className="text-xs text-red-500">*</span> : null}
      </div>
      <FormControl className="w-full">
        <div className="w-full">
          <input
            className="hidden"
            id={`input-file-multiple${photoType}`}
            type="file"
            onChange={(e) => {
              console.log("📁 input onChange 이벤트!");
              handleFile(e.target.files);
              e.target.value = "";
            }}
            multiple={true}
            accept="image/*"
          />
          {(() => {
            console.log("🎨 렌더링 분기 - total:", total);
            return null;
          })()}

          {total > 0 ? (
            <ScrollArea className="w-full overflow-hidden">
              {(() => {
                console.log("🎨 total > 0 렌더링");
                return null;
              })()}
              <div className="flex gap-6">
                {displayedExistedFiles.map((v, i) => (
                  <ImageFileItem
                    key={`exist-${v.attachSeq}`}
                    data={v}
                    onChange={handleNewFileUpdate}
                    onDelete={handleRemoveFile}
                  />
                ))}
                {(() => {
                  console.log(
                    "🎨 신규 파일 개수:",
                    value.filter((v) => !isExistingAttach(v)).length,
                  );
                  return null;
                })()}
                {value
                  .filter((v) => !isExistingAttach(v))
                  .map((v, i) => {
                    console.log("🎨 ImageFileItem 렌더링 시작:", i, v);
                    return (
                      <ImageFileItem
                        key={"new" + i}
                        data={v}
                        onChange={handleNewFileUpdate}
                        onDelete={handleRemoveFile}
                      />
                    );
                  })}
                {total < max ? (
                  <label
                    htmlFor={`input-file-multiple${photoType}`}
                    className="block cursor-pointer"
                  >
                    <CustomCard
                      className="w-50 h-full flex items-center justify-center hover:bg-background cursor-pointer"
                      size={"sm"}
                    >
                      <>
                        <DragDropZoneChildren
                          isDragOver={isDragOver}
                          dragHandlers={dragHandlers}
                        >
                          <PlusIcon className="text-[var(--icon)]" />
                        </DragDropZoneChildren>
                      </>
                    </CustomCard>
                  </label>
                ) : null}
              </div>
              <ScrollBar
                className="absolute bottom-0 left-0"
                orientation="horizontal"
              />
            </ScrollArea>
          ) : (
            <>
              {(() => {
                console.log("🎨 total === 0 렌더링");
                return null;
              })()}
              <label
                htmlFor={`input-file-multiple${photoType}`}
                className="block cursor-pointer"
              >
                <DragDropZone
                  isDragOver={isDragOver}
                  dragHandlers={dragHandlers}
                />
              </label>
            </>
          )}
        </div>
      </FormControl>
      <FormMessage className="text-xs text-red-500" />
    </FormItem>
  );
};

export const ImageFileItem = ({
  data,
  onChange,
  onDelete,
}: {
  data: ScheduleFormAttach;
  onChange: (value: ScheduleFormAttach) => void;
  onDelete: (value: ScheduleFormAttach) => void;
}) => {
  console.log("🖼️ ImageFileItem 내부 렌더링!", data);
  console.log("🖼️ isExistingAttach:", isExistingAttach(data));
  const onTextChange = (value: string) => {
    // console.log("onTextChange 호출:", value);
    onChange({ ...data, comments: value });
  };

  const onSecretChange = (value: boolean) => {
    onChange({ ...data, viewYn: !value });
  };

  const imageUrl = isExistingAttach(data)
    ? data.path
    : data.attaches
      ? URL.createObjectURL(data.attaches)
      : ""; // 또는 기본 이미지 URL

  console.log("🖼️ 생성된 imageUrl:", imageUrl);
  return (
    <CustomCard className="w-50 gap-4 relative" size={"sm"}>
      <div className="relative w-full h-32 overflow-hidden rounded-[4px] border">
        {(() => {
          console.log("🖼️ Image 컴포넌트 렌더링 직전");
          return null;
        })()}
        <Image
          fill
          className="object-cover"
          src={imageUrl}
          alt="이미지"
          onLoadingComplete={() => console.log("✅ 이미지 로드 완료!")}
          onError={(e) => console.log("❌ 이미지 로드 실패!", e)}
        />
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-xs text-[var(--description-light)]">설명</span>
        <Input
          type="text"
          name="comments"
          value={data.comments ?? ""}
          onChange={(e) => {
            console.log("=== Input onChange 발생 ===");
            console.log("e.target.value:", e.target.value);
            console.count("Input onChange 횟수");
            onTextChange(e.target.value);
          }}
        />
      </div>
      <div className="absolute right-0 top-0">
        <IconButton
          icon="X"
          bgClassName=" hover:bg-red-50"
          className="text-red-500"
          onClick={() => {
            onDelete(data);
          }}
        />
      </div>
    </CustomCard>
  );
};

{
  /* <div className="flex items-center gap-2">
        <span className="text-xs text-[var(--description-light)]">비공개</span>
        <Switch
          name="viewYn"
          className="ring ring-[var(--border)]  hover:cursor-pointer data-[state=checked]:bg-blue-500 data-[state=unchecked]:bg-[var(--background)] [&_[data-slot=switch-thumb]]:bg-white focus-visible:ring-0 focus-visible:outline-none"
          checked={!data.viewYn}
          onCheckedChange={onSecretChange}
        />
      </div> */
}
