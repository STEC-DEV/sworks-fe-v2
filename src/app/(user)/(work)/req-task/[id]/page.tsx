"use client";

import { ProcessBadge } from "@/components/common/badge";
import BaseSkeleton from "@/components/common/base-skeleton";
import CustomCard from "@/components/common/card";
import CheckDialog from "@/components/common/check-dialog";
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
import { dialogText } from "../../../../../../public/text";
import { KeyValueItem } from "@/components/ui/custom/key-value";
import { usePermission } from "@/hooks/usePermission";
import { useUIStore } from "@/store/common/ui-store";
import { Request } from "@/types/normal/request/req-detail";
import ReplyEditForm from "@/components/form/normal/request/reply-edit";
import { useAuthStore } from "@/store/auth/auth-store";
import EmptyBox from "@/components/ui/custom/empty";
import { useRouter } from "next/navigation";

const Page = () => {
  const { getRequestDetail, loadingKeys, request } = useReqDetailStore();
  const { isLoading, hasError } = useUIStore();
  const { rawValue } = useDecodeParam("id");
  useEffect(() => {
    if (!rawValue) return;
    getRequestDetail(rawValue);
  }, [rawValue, getRequestDetail]);

  if (isLoading(loadingKeys.INFO) || !request) return <RequestDetailSkeleton />;
  if (hasError(loadingKeys.INFO)) return <div>에러 발생</div>;

  return (
    <div className="flex flex-col gap-12 xl:flex-row xl:gap-12">
      <Info data={request} />
      <Reply data={request} />
    </div>
  );
};

const Info = ({ data }: { data: Request }) => {
  const { canWorkerEdit } = usePermission();
  const [open, setOpen] = useState<boolean>(false);
  const { loginProfile } = useAuthStore();
  const { deleteRequest } = useReqDetailStore();
  const router = useRouter();

  const onDelete = async () => {
    await deleteRequest(data.requestSeq);
    router.push(`/req-task`);
  };
  return (
    <>
      {data ? (
        <div className="flex-1 flex flex-col gap-6">
          <div className="flex justify-between items-center pb-4 border-b-2 border-border">
            <AppTitle title={data.title} />
            <div className="flex items-center gap-2">
              {canWorkerEdit && (
                <BaseDialog
                  title="수정"
                  triggerChildren={<IconButton icon="SquarePen" />}
                  open={open}
                  setOpen={setOpen}
                >
                  <RequestEditForm onClose={() => setOpen(false)} />
                </BaseDialog>
              )}
              {(canWorkerEdit || data.userSeq === loginProfile?.userSeq) && (
                <CheckDialog
                  title={dialogText.defaultDelete.title}
                  description={dialogText.defaultDelete.description}
                  actionLabel={dialogText.defaultDelete.actionLabel}
                  onClick={onDelete}
                >
                  <IconButton icon="Trash2" />
                </CheckDialog>
              )}
            </div>
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

            <DialogCarousel pathList={data.attaches.map((a) => a.path)} />
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

const Reply = ({ data }: { data: Request }) => {
  const { deleteReply, getRequestDetail } = useReqDetailStore();
  const { canWorkerEdit } = usePermission();
  const { loginProfile } = useAuthStore();
  // const [open, setOpen] = useState<boolean>(false);
  const [openDialogs, setOpenDialogs] = useState<Record<string, boolean>>({});

  const handleRemove = async (seq: string) => {
    if (!data) return;
    await deleteReply(seq);
    await getRequestDetail(data?.requestSeq.toString());
  };

  const createSetOpen = (logSeq: string) => {
    return (value: boolean | ((prev: boolean) => boolean)) => {
      setOpenDialogs((prev) => ({
        ...prev,
        [logSeq]:
          typeof value === "function" ? value(prev[logSeq] || false) : value,
      }));
    };
  };

  return (
    <div className="flex-1 flex flex-col gap-6">
      <AppTitle title="처리내용" isBorder />

      {data ? (
        <div className="flex flex-col gap-6">
          {data.logs.length > 0 ? (
            data.logs.map((v, i) => (
              <CustomCard className="gap-2" key={i} size={"sm"}>
                <div className="flex justify-between items-center">
                  <ProcessBadge value={v.logStatus} />
                  {canWorkerEdit &&
                    loginProfile?.userSeq === v.createUserSeq && (
                      <div className="flex justify-end gap-2">
                        <BaseDialog
                          key={i}
                          title="처리내용 수정"
                          triggerChildren={<IconButton icon="SquarePen" />}
                          open={openDialogs[v.logSeq] || false}
                          setOpen={createSetOpen(v.logSeq.toString())}
                        >
                          <ReplyEditForm
                            data={v}
                            onClose={() => createSetOpen(v.logSeq.toString())}
                          />
                        </BaseDialog>
                        <CheckDialog
                          title={dialogText.defaultDelete.title}
                          description={dialogText.defaultDelete.description}
                          actionLabel={dialogText.defaultDelete.actionLabel}
                          onClick={() => handleRemove(v.logSeq.toString())}
                        >
                          <IconButton icon="Trash2" />
                        </CheckDialog>
                      </div>
                    )}
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
                      className="px-2 rounded-xl text-sm bg-blue-500 text-white"
                    >
                      {v.managerName}
                    </span>
                  ))}
                </div>
                <div>
                  <span>{v.logContents}</span>
                </div>
                <DialogCarousel pathList={v.attaches.map((a) => a.path)} />
              </CustomCard>
            ))
          ) : (
            <span className="text-sm text-[var(--description-light)]">
              처리내용을 등록해주세요.
            </span>
          )}
        </div>
      ) : (
        <BaseSkeleton />
      )}
      {canWorkerEdit && <ReplyAddForm />}
    </div>
  );
};

export default Page;

const RequestDetailSkeleton = () => {
  return (
    <div className="flex xl:flex-row xl:gap-12 overflow-hidden">
      <div className="flex-1 flex flex-col gap-6">
        <BaseSkeleton className="h-8" />
        {Array.from({ length: 3 }, (_, i) => (
          <div key={i} className="flex flex-col gap-1">
            <BaseSkeleton className="h-5 w-15" />
            <BaseSkeleton className="h-5" />
          </div>
        ))}
        <div className="flex gap-4 overflow-hidden">
          {Array.from({ length: 3 }, (_, i) => (
            <BaseSkeleton key={i} className="h-32 w-48" />
          ))}
        </div>
      </div>
      <div className="flex-1 flex flex-col gap-6">
        <BaseSkeleton className="h-8" />
        {Array.from({ length: 3 }, (_, i) => (
          <BaseSkeleton className="h-50" key={i} />
        ))}
      </div>
    </div>
  );
};
