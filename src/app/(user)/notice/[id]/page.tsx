"use client";
import BaseSkeleton from "@/components/common/base-skeleton";
import AppTitle from "@/components/common/label/title";
import { KeyValueItem } from "@/components/ui/custom/key-value";
import { useDecodeParam } from "@/hooks/params";
import { useUIStore } from "@/store/common/ui-store";
import { useNoticeDetailStore } from "@/store/normal/notice/notice-detail-store";
import React, { useEffect } from "react";
import { FileBox } from "../../facility/_components/fac-info";
import IconButton from "@/components/common/icon-button";
import CheckDialog from "@/components/common/check-dialog";
import { dialogText } from "../../../../../public/text";
import { usePermission } from "@/hooks/usePermission";
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();
  const { loadingKeys, notice, getNoticeDetail, deleteNotice } =
    useNoticeDetailStore();
  const { isLoading, hasError } = useUIStore();
  const { rawValue: id } = useDecodeParam("id");
  const { canWorkerEdit } = usePermission();

  useEffect(() => {
    if (!id) return;
    getNoticeDetail(id);
  }, [id]);

  if (isLoading(loadingKeys.data) || !notice)
    return (
      <div>
        <BaseSkeleton />
      </div>
    );
  if (hasError(loadingKeys.data)) return <div>에러발생</div>;

  return (
    <>
      <div className="flex items-center justify-between  border-b-2 border-border pb-4">
        <AppTitle title="공지사항" />
        {canWorkerEdit && (
          <div className="flex gap-2">
            <IconButton
              icon="SquarePen"
              onClick={() => {
                router.push(`/notice/${id}/edit`);
              }}
            />
            <CheckDialog
              title={dialogText.defaultDelete.title}
              description={dialogText.defaultDelete.description}
              actionLabel={dialogText.defaultDelete.actionLabel}
              onClick={() => {
                deleteNotice(id);
                router.push("/notice");
              }}
            >
              <IconButton icon="Trash2" />
            </CheckDialog>
          </div>
        )}
      </div>

      <KeyValueItem
        label="제목"
        value={notice.title}
        labelStyle="text-sm"
        valueStyle="text-md"
      />
      <KeyValueItem
        label="내용"
        value={notice.description}
        labelStyle="text-sm"
        valueStyle="text-md"
        isTextArea
      />
      {notice.fileAttaches.length > 0 && (
        <div className="flex flex-col gap-1">
          <span className="text-sm text-[var(--description-light)]">
            첨부파일
          </span>
          <div className="flex flex-col gap-4">
            {notice.fileAttaches.map((f, i) => (
              <FileBox
                key={`file-${i}`}
                file={{
                  attachSeq: f.attachSeq,
                  fileExt: f.fileName.slice(f.fileName.lastIndexOf(".")),
                  fileLength: f.fileLength,
                  fileName: f.fileName,
                  path: f.path,
                }}
              />
            ))}
            {notice.imageAttaches.map((f, i) => (
              <FileBox
                key={`image-${i}`}
                file={{
                  attachSeq: f.attachSeq,
                  fileExt: f.fileName.slice(f.fileName.lastIndexOf(".")),
                  fileLength: f.fileLength,
                  fileName: f.fileName,
                  path: f.path,
                }}
              />
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default Page;
