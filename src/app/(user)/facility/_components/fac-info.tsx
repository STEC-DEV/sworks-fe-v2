"use client";
import CustomCard from "@/components/common/card";
import IconButton from "@/components/common/icon-button";
import AppTitle from "@/components/common/label/title";
import { format } from "date-fns";
import { Download, DownloadIcon, FileTextIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";

interface FacInfoProps {
  data: FacilityDetail;
  title: string;
}

const FacInfo = ({ data, title }: FacInfoProps) => {
  const router = useRouter();

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <AppTitle title={title} />
        <IconButton
          icon="SquarePen"
          onClick={() => router.push(`${data.facilitySeq}/edit`)}
        />
      </div>

      <div className="flex flex-col gap-4">
        <KeyValue label="R&M 유형" value={data.facilityCodeName} />
        <KeyValue label="설명" value={data.description} />
        <KeyValue label="시작" value={format(data.fromDt, "yyyy-MM-dd")} />
        <KeyValue label="종료" value={format(data.toDt ?? "", "yyyy-MM-dd")} />
        <KeyValue label="업체" value={data.constractor} />
        <KeyValue label="연락처" value={data.tel ?? ""} />
        <KeyValue label="비용" value={data.cost?.toString() ?? ""} />
      </div>
      <span className="text-lg font-bold">보고서</span>
      <div className="space-y-2">
        {data.attaches.length > 0
          ? data.attaches.map((f, i) => <FileBox key={i} file={f} />)
          : null}
      </div>
    </div>
  );
};

const KeyValue = ({ label, value }: { label: string; value: string }) => {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs text-[var(--description-light)]">{label}</span>
      <span className="text-sm  ">{value}</span>
    </div>
  );
};

const FileBox = ({ file }: { file: Attach }) => {
  return (
    <CustomCard
      className="flex-row items-center justify-between hover:cursor-default"
      variant={"list"}
      size={"sm"}
    >
      <div className="flex items-center gap-2">
        <FileTextIcon
          className="text-[var(--icon)]"
          size={16}
          strokeWidth={1}
        />
        <span className="text-sm">{file.fileName}</span>
      </div>

      <IconButton
        bgClassName="hover:bg-blue-50"
        icon="Download"
        onClick={() => {
          downloadFile(file.path, file.fileName);
        }}
      />
    </CustomCard>
  );
};

const downloadFile = async (url: string, fileName: string) => {
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
