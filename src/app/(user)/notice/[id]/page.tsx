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
import PrevLayout from "@/components/layout/prev-layout";
import CustomCard from "@/components/common/card";
import { format } from "date-fns";

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
      <div className="flex-1 flex flex-col gap-6 min-h-0 h-full">
        <BaseSkeleton className="h-9" />
        <div className="min-h-0 flex-1 flex flex-col xl:flex-row gap-6">
          <BaseSkeleton className="min-h-0 flex-[4] w-full" />
          <BaseSkeleton className="h-80 flex-[1]" />
        </div>
      </div>
    );
  if (hasError(loadingKeys.data)) return <div>에러발생</div>;

  return (
    <>
      <div className="flex flex-col gap-6 w-full h-full flex-1">
        <div className="flex items-center justify-between  ">
          <AppTitle title="공지사항" isPrev />
          {canWorkerEdit && (
            <div className="flex gap-2">
              <IconButton
                icon="SquarePen"
                bgClassName="!rounded-DEFAULT border border-border-strong shadow-sm bg-surface"
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
                <IconButton
                  icon="Trash2"
                  bgClassName="!rounded-DEFAULT border border-destructive hover:bg-red-50 shadow-sm bg-surface"
                  className="group-hover:text-destructive"
                />
              </CheckDialog>
            </div>
          )}
        </div>
        <div className="flex gap-6  flex-1 min-h-0">
          <CustomCard className="min-h-0 divide-y divide-border py-0 gap-0 flex-4/5">
            <div className="flex flex-col gap-1 p-6">
              {notice.serviceTypes.map((v, i) => (
                <span
                  key={i}
                  className="w-fit text-primary bg-primary-background px-2 rounded-DEFAULT border border-border-strong text-sm font-semibold"
                >
                  {v.serviceTypeName}
                </span>
              ))}

              <span className="text-2xl font-bold">{notice.title}</span>
            </div>
            <div className="p-6 flex-1">
              <p>{notice.description}</p>
            </div>
            <div className="p-6 flex flex-col gap-4">
              <span className="text-sm text-description">첨부파일</span>
              {notice.fileAttaches.length > 0 && (
                <div className="flex flex-col xl:flex-row gap-1">
                  <div className="flex flex-col xl:flex-row gap-4">
                    {notice.fileAttaches.map((f, i) => (
                      <FileBox
                        key={`file-${i}`}
                        file={{
                          attachSeq: f.attachSeq,
                          fileExt: f.fileName.slice(
                            f.fileName.lastIndexOf("."),
                          ),
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
                          fileExt: f.fileName.slice(
                            f.fileName.lastIndexOf("."),
                          ),
                          fileLength: f.fileLength,
                          fileName: f.fileName,
                          path: f.path,
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CustomCard>
          <CustomCard className="xl:flex-1/5 h-fit divide-y divide-border py-0 px-6 gap-0">
            <div className="py-6">
              <div className="flex flex-col gap-1">
                <span className="text-description text-xs">작성자</span>
                <div className="flex gap-2 items-center">
                  <div className="w-9  flex items-center justify-center text-surface text-sm font-bold aspect-square bg-primary rounded-full">
                    {notice.creator.slice(0, 1)}
                  </div>
                  <span className="font-semibold">{notice.creator}</span>
                </div>
              </div>
            </div>
            <div className="py-6">
              <KeyValueItem
                label="작성일"
                labelStyle="text-xs"
                value={format(notice.endDt, "yyyy-MM-dd")}
                valueStyle="text-base font-semibold"
              />
            </div>
            <div className="py-6">
              <KeyValueItem
                label="공개여부"
                labelStyle="text-xs"
                value={notice.viewYn ? "공개" : "비공개"}
                valueStyle="text-base font-semibold"
              />
            </div>
          </CustomCard>
        </div>
      </div>
    </>
  );
};

export default Page;
