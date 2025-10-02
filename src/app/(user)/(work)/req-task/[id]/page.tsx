"use client";
import { KeyValueItem } from "@/app/(user)/equipment/[id]/[history-id]/page";
import { ProcessBadge } from "@/components/common/badge";
import BaseSkeleton from "@/components/common/base-skeleton";
import CustomCard from "@/components/common/card";
import IconButton from "@/components/common/icon-button";
import AppTitle from "@/components/common/label/title";
import RequestEditForm from "@/components/form/normal/request/edit";
import ReplyAddForm from "@/components/form/normal/request/reply-add";
import BaseDialog from "@/components/ui/custom/base-dialog";
import DialogCarousel from "@/components/ui/custom/image/size-carousel";
import { useDecodeParam } from "@/hooks/params";
import { useReqDetailStore } from "@/store/normal/req/detail";
import { format } from "date-fns";
import React, { useEffect, useState } from "react";

const Page = () => {
  const { getRequestDetail } = useReqDetailStore();
  const { rawValue } = useDecodeParam("id");
  useEffect(() => {
    if (!rawValue) return;
    getRequestDetail(rawValue);
  }, [rawValue]);
  return (
    <div className="flex xl:flex-row xl:gap-12">
      <Info />
      <Reply />
    </div>
  );
};

const Info = () => {
  const { request: data } = useReqDetailStore();
  const [open, setOpen] = useState<boolean>(false);
  return (
    <>
      {data ? (
        <div className="flex-1 flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <AppTitle title={data.title} />
            <BaseDialog
              title="수정"
              triggerChildren={<IconButton icon="SquarePen" />}
              open={open}
              setOpen={setOpen}
            >
              <RequestEditForm onClose={() => setOpen(false)} />
            </BaseDialog>
          </div>

          <div className="flex flex-col gap-6">
            <KeyValueItem
              label="업무유형"
              labelStyle="text-sm"
              valueStyle="text-blue-500 text-sm"
              value={data.serviceTypeName}
            />
            <KeyValueItem
              label="내용"
              labelStyle="text-sm"
              valueStyle="text-sm"
              value={data.description}
            />
            <KeyValueItem
              label="요청자"
              labelStyle="text-sm"
              valueStyle="text-sm"
              value={data.userName}
            />

            <DialogCarousel pathList={data.attaches.map((a, j) => a.path)} />
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col gap-6">
          <BaseSkeleton className="h-7" />
          <div className="flex flex-col gap-1">
            <BaseSkeleton className="h-5 w-20" />
            <BaseSkeleton className="h-5" />
          </div>
          <div className="flex flex-col gap-1">
            <BaseSkeleton className="h-5 w-20" />
            <BaseSkeleton className="h-5" />
          </div>
          <div className="flex flex-col gap-1">
            <BaseSkeleton className="h-5 w-20" />
            <BaseSkeleton className="h-5" />
          </div>
          <div className="flex flex-col gap-1">
            <BaseSkeleton className="h-34 " />
          </div>
        </div>
      )}
    </>
  );
};

const Reply = () => {
  const { request: data } = useReqDetailStore();

  return (
    <div className="flex-1 flex flex-col gap-6">
      <AppTitle title="처리내용" />

      {data ? (
        <div className="flex flex-col gap-6">
          {data.logs.map((v, i) => (
            <CustomCard className="gap-2" key={i} size={"sm"}>
              <div className="flex justify-between items-center">
                <ProcessBadge value={v.logStatus} />
                <div className="flex justify-end gap-2">
                  <IconButton icon="SquarePen" />
                  <IconButton icon="Trash2" />
                </div>
              </div>

              <div className="flex justify-between">
                <span className="text-sm">{v.createUserName}</span>
                <span className="text-[var(--description-light)] text-xs">
                  {format(v.logWorkDt, "yyyy-MM-dd hh:mm:ss")}
                </span>
              </div>
              <div className="flex gap-4">
                <span className="text-sm text-[var(--description-light)]">
                  담당자
                </span>

                {v.users.map((v, i) => (
                  <span
                    key={i}
                    className="px-2 rounded-xl bg-background text-sm text-[var(--description-dark)]"
                  >
                    {v.managerName}
                  </span>
                ))}
              </div>
              <div>
                <span>{v.logContents}</span>
              </div>
            </CustomCard>
          ))}
        </div>
      ) : (
        <BaseSkeleton />
      )}
      <ReplyAddForm />
    </div>
  );
};

export default Page;
