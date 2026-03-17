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
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

// const Page = () => {
//   const { getRequestDetail, loadingKeys, request } = useReqDetailStore();
//   const { isLoading, hasError } = useUIStore();
//   const { rawValue } = useDecodeParam("id");
//   useEffect(() => {
//     if (!rawValue) return;
//     getRequestDetail(rawValue);
//   }, [rawValue, getRequestDetail]);

//   if (isLoading(loadingKeys.INFO) || !request) return <RequestDetailSkeleton />;
//   if (hasError(loadingKeys.INFO)) return <div>에러 발생</div>;

//   return (
//     <div className="flex flex-col gap-12 xl:flex-row xl:gap-12">
//       <Info data={request} />
//       <Reply data={request} />
//     </div>
//   );
// };

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
    <div className="flex flex-col gap-6 flex-1 min-h-0">
      {/* 요청 원문 카드 */}
      <RequestCard data={request} />

      {/* 2열 — 처리이력 타임라인 + 처리폼 */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 flex-1 min-h-0">
        <Timeline data={request} />
        <ReplyPanel />
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────
   요청 원문 카드 (헤더 역할)
───────────────────────────────────────── */
const RequestCard = ({ data }: { data: Request }) => {
  const { canWorkerEdit } = usePermission();
  const { loginProfile } = useAuthStore();
  const { deleteRequest } = useReqDetailStore();
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const onDelete = async () => {
    await deleteRequest(data.requestSeq);
    router.push("/req-task");
  };

  const latestStatus =
    data.logs.length > 0 ? data.logs[data.logs.length - 1].logStatus : null;

  return (
    <CustomCard className="gap-0 py-0 divide-y divide-border flex-shrink-0 ">
      {/* 메타바 */}
      <div className="flex items-center justify-between px-5 py-3  bg-gradient-to-r from-primary-hover to-primary">
        <div className="flex flex-col gap-1   flex-wrap">
          <div className="flex gap-3 items-center">
            {latestStatus !== null && <ProcessBadge value={latestStatus} />}
            <div className="w-0.25 h-5 bg-border-strong" />
            <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-primary-background text-primary border border-border-strong">
              {data.serviceTypeName}
            </span>
            <div className="w-0.25 h-5 bg-border-strong" />
            <span className="text-xs text-description-light">
              요청자
              <strong className="text-sm text-white">
                &nbsp;&nbsp;{data.userName}
              </strong>
            </span>
          </div>

          <h1 className="text-base font-bold text-white tracking-tight">
            {data.title}
          </h1>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {canWorkerEdit && (
            <BaseDialog
              title="수정"
              triggerChildren={
                <IconButton
                  icon="SquarePen"
                  bgClassName="!rounded-DEFAULT  border bg-white/10 border-white/20 shadow-sm hover:bg-white/30"
                  className="text-white"
                />
              }
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
              <IconButton
                icon="Trash2"
                bgClassName="!rounded-DEFAULT  border bg-white/10 border-white/20 hover:border-destructive hover:bg-white/30 shadow-sm"
                className="text-white group-hover:text-destructive"
              />
            </CheckDialog>
          )}
        </div>
      </div>

      {/* 요청 내용 + 이미지 */}
      <div className="px-5 py-4 flex flex-col gap-3">
        <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
          {data.description}
        </p>
        {data.attaches.length > 0 && (
          <DialogCarousel pathList={data.attaches.map((a) => a.path)} />
        )}
      </div>
    </CustomCard>
  );
};

/* ─────────────────────────────────────────
   좌측 타임라인 카드 — 처리이력만
───────────────────────────────────────── */
const Timeline = ({ data }: { data: Request }) => {
  const { deleteReply, getRequestDetail } = useReqDetailStore();
  const { canWorkerEdit } = usePermission();
  const { loginProfile } = useAuthStore();
  const [openDialogs, setOpenDialogs] = useState<Record<string, boolean>>({});

  const createSetOpen = (logSeq: string) => {
    return (value: boolean | ((prev: boolean) => boolean)) => {
      setOpenDialogs((prev) => ({
        ...prev,
        [logSeq]:
          typeof value === "function" ? value(prev[logSeq] || false) : value,
      }));
    };
  };

  const handleRemove = async (seq: string) => {
    await deleteReply(seq);
    await getRequestDetail(data.requestSeq.toString());
  };

  return (
    <CustomCard className="gap-0 py-0 divide-y divide-border flex flex-col min-h-0">
      <div className="flex items-center justify-between px-4 py-3 bg-background flex-shrink-0">
        <span className="text-sm font-bold text-description">
          처리 히스토리
        </span>
        <span className="text-xs text-description-light">
          {data.logs.length}건
        </span>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4">
        {data.logs.length > 0 ? (
          <div className="flex flex-col gap-5">
            {data.logs.map((v) => (
              <div key={v.logSeq} className="flex gap-3">
                {/* 아바타 */}
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-xs font-bold text-primary-foreground flex-shrink-0 mt-0.5">
                  {v.createUserName.charAt(0)}
                </div>
                {/* 본문 */}
                <div className="flex-1 flex flex-col gap-1.5 min-w-0">
                  {/* 헤더 */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-bold text-foreground">
                      {v.createUserName}
                    </span>
                    <ProcessBadge value={v.logStatus} />
                    <span className="text-xs text-description-light ml-auto">
                      {format(v.logWorkDt, "yyyy-MM-dd HH:mm:ss")}
                    </span>
                    {canWorkerEdit &&
                      loginProfile?.userSeq === v.createUserSeq && (
                        <>
                          <BaseDialog
                            title="처리내용 수정"
                            triggerChildren={
                              <IconButton
                                icon="SquarePen"
                                bgClassName="!rounded-DEFAULT border border-border-strong "
                              />
                            }
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
                            <IconButton
                              icon="Trash2"
                              bgClassName="!rounded-DEFAULT border border-border-strong hover:border-destructive hover:bg-red-50 "
                              className="group-hover:text-destructive"
                            />
                          </CheckDialog>
                        </>
                      )}
                  </div>
                  {/* 내용 박스 */}
                  <div className="rounded-xl border border-border bg-background overflow-hidden">
                    {v.users.length > 0 && (
                      <div className="flex items-center gap-2 flex-wrap px-3 py-2.5 border-b border-border">
                        <span className="text-xs text-description-light w-9 flex-shrink-0">
                          담당자
                        </span>
                        <div className="flex gap-1 flex-wrap">
                          {v.users.map((u, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 rounded-DEFAULT text-sm bg-primary text-primary-foreground"
                            >
                              {u.managerName}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    <div className="flex flex-col gap-1 px-3 py-2.5">
                      <span className="text-xs text-description-light">
                        내용
                      </span>
                      <span className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                        {v.logContents}
                      </span>
                    </div>
                    {v.attaches.length > 0 && (
                      <div className="px-3 py-2.5 border-t border-border">
                        <DialogCarousel
                          pathList={v.attaches.map((a) => a.path)}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <EmptyBox message="처리내용을 등록해주세요." />
          </div>
        )}
      </div>
    </CustomCard>
  );
};

/* ─────────────────────────────────────────
   우측 처리폼 카드
───────────────────────────────────────── */
const ReplyPanel = () => {
  const { canWorkerEdit } = usePermission();

  return (
    <CustomCard className="gap-0 py-0 divide-y divide-border flex flex-col min-h-0">
      <div className="px-4 py-3 bg-background flex-shrink-0">
        <span className="text-sm font-bold text-description">
          처리내용 등록
        </span>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        {canWorkerEdit ? (
          <ReplyAddForm />
        ) : (
          <div className="flex items-center justify-center h-full">
            <EmptyBox message="처리 권한이 없습니다." />
          </div>
        )}
      </div>
    </CustomCard>
  );
};

// const Info = ({ data }: { data: Request }) => {
//   const { canWorkerEdit } = usePermission();
//   const [open, setOpen] = useState<boolean>(false);
//   const { loginProfile } = useAuthStore();
//   const { deleteRequest } = useReqDetailStore();
//   const router = useRouter();

//   const onDelete = async () => {
//     await deleteRequest(data.requestSeq);
//     router.push(`/req-task`);
//   };
//   return (
//     <>
//       {data ? (
//         <div className="flex-1 flex flex-col gap-6">
//           <div className="flex justify-between items-center pb-4 border-b-2 border-border">
//             <AppTitle title={data.title} />
//             <div className="flex items-center gap-2">
//               {canWorkerEdit && (
//                 <BaseDialog
//                   title="수정"
//                   triggerChildren={<IconButton icon="SquarePen" />}
//                   open={open}
//                   setOpen={setOpen}
//                 >
//                   <RequestEditForm onClose={() => setOpen(false)} />
//                 </BaseDialog>
//               )}
//               {(canWorkerEdit || data.userSeq === loginProfile?.userSeq) && (
//                 <CheckDialog
//                   title={dialogText.defaultDelete.title}
//                   description={dialogText.defaultDelete.description}
//                   actionLabel={dialogText.defaultDelete.actionLabel}
//                   onClick={onDelete}
//                 >
//                   <IconButton icon="Trash2" />
//                 </CheckDialog>
//               )}
//             </div>
//           </div>

//           <div className="flex flex-col gap-6">
//             <KeyValueItem
//               label="업무유형"
//               labelStyle="text-sm"
//               valueStyle="text-blue-500 text-sm"
//               value={data.serviceTypeName}
//             />
//             <KeyValueItem
//               label="내용"
//               labelStyle="text-sm"
//               valueStyle="text-sm"
//               value={data.description}
//             />
//             <KeyValueItem
//               label="요청자"
//               labelStyle="text-sm"
//               valueStyle="text-sm"
//               value={data.userName}
//             />

//             <DialogCarousel pathList={data.attaches.map((a) => a.path)} />
//           </div>
//         </div>
//       ) : (
//         <div className="flex-1 flex flex-col gap-6">
//           <BaseSkeleton className="h-7" />
//           <div className="flex flex-col gap-1">
//             <BaseSkeleton className="h-5 w-20" />
//             <BaseSkeleton className="h-5" />
//           </div>
//           <div className="flex flex-col gap-1">
//             <BaseSkeleton className="h-5 w-20" />
//             <BaseSkeleton className="h-5" />
//           </div>
//           <div className="flex flex-col gap-1">
//             <BaseSkeleton className="h-5 w-20" />
//             <BaseSkeleton className="h-5" />
//           </div>
//           <div className="flex flex-col gap-1">
//             <BaseSkeleton className="h-34 " />
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// const Reply = ({ data }: { data: Request }) => {
//   const { deleteReply, getRequestDetail } = useReqDetailStore();
//   const { canWorkerEdit } = usePermission();
//   const { loginProfile } = useAuthStore();
//   // const [open, setOpen] = useState<boolean>(false);
//   const [openDialogs, setOpenDialogs] = useState<Record<string, boolean>>({});

//   const handleRemove = async (seq: string) => {
//     if (!data) return;
//     await deleteReply(seq);
//     await getRequestDetail(data?.requestSeq.toString());
//   };

//   const createSetOpen = (logSeq: string) => {
//     return (value: boolean | ((prev: boolean) => boolean)) => {
//       setOpenDialogs((prev) => ({
//         ...prev,
//         [logSeq]:
//           typeof value === "function" ? value(prev[logSeq] || false) : value,
//       }));
//     };
//   };

//   return (
//     <div className="flex-1 flex flex-col gap-6">
//       <AppTitle title="처리내용" isBorder />

//       {data ? (
//         <div className="flex flex-col gap-6">
//           {data.logs.length > 0 ? (
//             data.logs.map((v, i) => (
//               <CustomCard className="gap-2" key={i} size={"sm"}>
//                 <div className="flex justify-between items-center">
//                   <ProcessBadge value={v.logStatus} />
//                   {canWorkerEdit &&
//                     loginProfile?.userSeq === v.createUserSeq && (
//                       <div className="flex justify-end gap-2">
//                         <BaseDialog
//                           key={i}
//                           title="처리내용 수정"
//                           triggerChildren={<IconButton icon="SquarePen" />}
//                           open={openDialogs[v.logSeq] || false}
//                           setOpen={createSetOpen(v.logSeq.toString())}
//                         >
//                           <ReplyEditForm
//                             data={v}
//                             onClose={() => createSetOpen(v.logSeq.toString())}
//                           />
//                         </BaseDialog>
//                         <CheckDialog
//                           title={dialogText.defaultDelete.title}
//                           description={dialogText.defaultDelete.description}
//                           actionLabel={dialogText.defaultDelete.actionLabel}
//                           onClick={() => handleRemove(v.logSeq.toString())}
//                         >
//                           <IconButton icon="Trash2" />
//                         </CheckDialog>
//                       </div>
//                     )}
//                 </div>

//                 <div className="flex justify-between">
//                   <span className="text-sm">{v.createUserName}</span>
//                   <span className="text-[var(--description-light)] text-xs">
//                     {format(v.logWorkDt, "yyyy-MM-dd HH:mm:ss")}
//                   </span>
//                 </div>

//                 <div className="flex gap-4">
//                   <span className="text-sm text-[var(--description-light)] whitespace-nowrap">
//                     담당자
//                   </span>
//                   <div className="flex gap-2 flex-wrap">
//                     {v.users.map((v, i) => (
//                       <span
//                         key={i}
//                         className="px-4 py-0.5 rounded-xl text-sm bg-blue-500 text-white "
//                       >
//                         {v.managerName}
//                       </span>
//                     ))}
//                   </div>
//                 </div>

//                 <div className="flex flex-col gap-2">
//                   <span className="text-sm text-[var(--description-light)] whitespace-nowrap">
//                     내용
//                   </span>
//                   <span>{v.logContents}</span>
//                 </div>
//                 <DialogCarousel pathList={v.attaches.map((a) => a.path)} />
//               </CustomCard>
//             ))
//           ) : (
//             <span className="text-sm text-[var(--description-light)]">
//               처리내용을 등록해주세요.
//             </span>
//           )}
//         </div>
//       ) : (
//         <BaseSkeleton />
//       )}
//       {canWorkerEdit && <ReplyAddForm />}
//     </div>
//   );
// };

export default Page;

const RequestDetailSkeleton = () => {
  return (
    <div className="flex flex-col gap-4 flex-1 min-h-0">
      <BaseSkeleton className="h-24" />
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 flex-1 min-h-0">
        <div className="flex flex-col gap-3">
          <BaseSkeleton className="h-8" />
          {Array.from({ length: 3 }, (_, i) => (
            <BaseSkeleton key={i} className="h-28" />
          ))}
        </div>
        <div className="flex flex-col gap-3">
          <BaseSkeleton className="h-8" />
          <BaseSkeleton className="flex-1 min-h-0" />
        </div>
      </div>
    </div>
  );
};
// const RequestDetailSkeleton = () => {
//   return (
//     <div className="flex flex-col xl:flex-row gap-12 overflow-hidden">
//       <div className="flex-1 flex flex-col gap-6">
//         <BaseSkeleton className="h-8" />
//         {Array.from({ length: 3 }, (_, i) => (
//           <div key={i} className="flex flex-col gap-1">
//             <BaseSkeleton className="h-5 w-15" />
//             <BaseSkeleton className="h-5" />
//           </div>
//         ))}
//         <div className="flex gap-4 overflow-hidden">
//           {Array.from({ length: 3 }, (_, i) => (
//             <BaseSkeleton key={i} className="h-32 w-48" />
//           ))}
//         </div>
//       </div>
//       <div className="flex-1 flex flex-col gap-6">
//         <BaseSkeleton className="h-8" />
//         {Array.from({ length: 3 }, (_, i) => (
//           <BaseSkeleton className="h-50" key={i} />
//         ))}
//       </div>
//     </div>
//   );
// };
