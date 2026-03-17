"use client";
import CustomCard from "@/components/common/card";
import IconButton from "@/components/common/icon-button";
import AppTitle from "@/components/common/label/title";
import { useDecodeParam } from "@/hooks/params";
import { usePermission } from "@/hooks/usePermission";
import { Attach, FacilityDetail } from "@/types/normal/facility/fac-detail";
import { format } from "date-fns";
import { FileTextIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";

interface FacInfoProps {
  data: FacilityDetail;
  title: string;
}

const FacInfo = ({ data, title }: FacInfoProps) => {
  const { rawValue } = useDecodeParam("type");
  const router = useRouter();
  const { canWorkerEdit } = usePermission();

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="flex justify-between items-center ">
        <AppTitle title={title} isPrev prevPath={`/facility/${rawValue}`} />
        {canWorkerEdit && (
          <IconButton
            icon="SquarePen"
            bgClassName="!rounded-DEFAULT border border-border-strong shadow-sm hover:bg-primary-background "
            onClick={() => router.push(`${data.facilitySeq}/edit`)}
          />
        )}
      </div>

      <CustomCard className="gap-4  p-6 divide-y divide-border">
        <KeyValue label="R&M 유형" value={data.facilityCodeName} />
        <KeyValue label="설명" value={data.description} />
        <KeyValue
          label={`${rawValue === "mro" ? "반입" : "시작"}`}
          value={format(data.fromDt, "yyyy-MM-dd")}
        />
        {rawValue !== "mro" ? (
          <KeyValue
            label="종료"
            value={data.toDt ? format(data.toDt, "yyyy-MM-dd") : "내용없음"}
          />
        ) : null}

        <KeyValue label="업체" value={data.constractor} />
        <KeyValue label="연락처" value={data.tel || "내용없음"} />
        <KeyValue label="비용" value={`${data.cost}원` || "0원"} />
      </CustomCard>

      <div className="flex flex-col gap-6">
        <span className="text-lg font-bold">보고서</span>

        <CustomCard className="p-6">
          {data.attaches.length > 0 ? (
            data.attaches.map((f, i) => <FileBox key={i} file={f} />)
          ) : (
            <span className="text-sm text-[var(--description-light)]">
              보고서가 존재하지않습니다.
            </span>
          )}
        </CustomCard>
      </div>
    </div>
  );
};

const KeyValue = ({ label, value }: { label: string; value: string }) => {
  return (
    <div className="flex flex-col gap-1 xl:flex-row xl:justify-between pb-4">
      <span className="text-sm text-description">{label}</span>
      <span className="text-sm font-medium text-description-strong">
        {value}
      </span>
    </div>
  );
};

export const FileBox = ({ file }: { file: Attach }) => {
  const convertToMB = (fileLength: number, decimals: number = 2): number => {
    if (fileLength === 0) return 0;

    const megaByte = 1024 * 1024;
    const result = fileLength / megaByte;

    return parseFloat(result.toFixed(decimals));
  };
  return (
    <CustomCard
      className="flex-row items-center justify-between cursor-default bg-background gap-4"
      variant={"list"}
      size={"sm"}
    >
      <div className="flex items-center gap-2">
        <FileTextIcon className="text-primary" size={16} strokeWidth={2} />
        <div className="flex gap-2 items-center">
          <span className="text-sm">{file.fileName}</span>
          <span className="text-xs text-description">
            {convertToMB(file.fileLength)} MB
          </span>
        </div>
      </div>

      <IconButton
        bgClassName="hover:bg-primary-background border border-border-strong"
        icon="Download"
        onClick={() => {
          downloadFile(file.path, file.fileName);
        }}
      />
    </CustomCard>
  );
};

export const downloadFile = async (url: string, fileName: string) => {
  try {
    const response = await fetch(url);
    const blob = await response.blob();

    const blobUrl = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = fileName;

    document.body.appendChild(link);
    link.click();

    // 정리
    URL.revokeObjectURL(blobUrl);
    document.body.removeChild(link);
  } catch (err) {
    console.log(err);
    toast.error("파일 다운로드 실패");
  }
};

export default FacInfo;
