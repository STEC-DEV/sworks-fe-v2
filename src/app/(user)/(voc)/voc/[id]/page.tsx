"use client";

import BaseSkeleton from "@/components/common/base-skeleton";
import CustomCard from "@/components/common/card";
import CheckDialog from "@/components/common/check-dialog";
import IconButton from "@/components/common/icon-button";
import AppTitle from "@/components/common/label/title";
import ReplyAddForm from "@/components/form/normal/voc/reply-add";
import BaseDialog from "@/components/ui/custom/base-dialog";
import { useVocDetailStore } from "@/store/normal/voc/detail-store";
import { notFound, useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import dialogText from "../../../../../../public/dialog-text.json";
import { format } from "date-fns";
import { ProcessBadge } from "../_components/item";
import { AlarmClockIcon, CheckCircleIcon, RotateCwIcon } from "lucide-react";
import DialogCarousel from "@/components/ui/custom/image/size-carousel";
import TypeEditForm from "@/components/form/normal/voc/type-edit";
import ReplyEditForm from "@/components/form/normal/voc/reply-edit";
import { KeyValueItem } from "@/components/ui/custom/key-value";
import { useUIStore } from "@/store/common/ui-store";
import { useDecodeParam } from "@/hooks/params";
import EmptyBox from "@/components/ui/custom/empty";

const VocProcessBadge = ({ value }: { value: number }) => {
  switch (value) {
    case 0:
      return (
        <ProcessBadge
          label="미처리"
          icon={AlarmClockIcon}
          style="bg-gray-400 w-fit px-2"
        />
      );
    case 1:
      return (
        <ProcessBadge
          label="처리중"
          icon={RotateCwIcon}
          style="bg-green-500 w-fit px-2"
        />
      );
    case 2:
      return (
        <ProcessBadge
          label="처리완료"
          icon={CheckCircleIcon}
          style="bg-blue-500 w-fit px-2"
        />
      );
    default:
      return null;
  }
};

const Page = () => {
  const [open, setOpen] = useState<boolean>(false);
  const { id } = useParams();
  const { vocDetail, getVocDetail, loadingKeys } = useVocDetailStore();
  const { isLoading, hasError } = useUIStore();

  useEffect(() => {
    if (!id) return;
    getVocDetail(id.toString()).catch((err: Error) => {
      if (err.message === "NOT_FOUND") return notFound();
    });
  }, [id, getVocDetail]);

  if (isLoading(loadingKeys.INFO) || !vocDetail) return <VocDetailSkeleton />;
  if (hasError(loadingKeys.INFO)) return <div>에러 발생</div>;

  return (
    <div className="flex flex-col gap-6 flex-1 min-h-0">
      {/* 민원 원문 카드 */}
      <VocCard data={vocDetail} open={open} setOpen={setOpen} />

      {/* 2열 — 답변 히스토리 + 등록 폼 */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 flex-1 min-h-0">
        <ReplyTimeline data={vocDetail} />
        <ReplyPanel />
      </div>
    </div>
  );
};

export default Page;

/* ─────────────────────────────────────────
   민원 원문 카드
───────────────────────────────────────── */
const VocCard = ({
  data,
  open,
  setOpen,
}: {
  data: VocDetail;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const latestStatus =
    data.replys.length > 0 ? data.replys[data.replys.length - 1].status : null;

  return (
    <CustomCard className="gap-0 py-0 divide-y divide-border flex-shrink-0">
      {/* 메타바 */}
      <div className="flex items-center justify-between px-5 py-3 bg-gradient-to-r from-primary-hover to-primary">
        <div className="flex flex-col gap-1 flex-wrap">
          <div className="flex gap-3 items-center">
            {latestStatus !== null && VocProcessBadge({ value: latestStatus })}
            <div className="w-0.25 h-5 bg-border-strong" />
            <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-primary-background text-primary border border-border-strong">
              {data.logs.serviceTypeName}
            </span>
            <div className="w-0.25 h-5 bg-border-strong" />
            <span className="text-xs text-description-light">
              민원인{" "}
              <strong className="text-sm text-white">
                &nbsp;&nbsp;{data.logs.createUser || "내용없음"}
              </strong>
            </span>
            {data.logs.phone && (
              <>
                <div className="w-0.25 h-5 bg-border-strong" />
                <span className="text-xs text-description-light">
                  📞 <strong className="text-white">{data.logs.phone}</strong>
                </span>
              </>
            )}
          </div>
          <h1 className="text-base font-bold text-white tracking-tight">
            {data.logs.title}
          </h1>
        </div>
        {/* 우측 버튼 */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <BaseDialog
            title="담당 유형 수정"
            triggerChildren={
              <IconButton
                icon="SquarePen"
                bgClassName="!rounded-DEFAULT border bg-white/10 border-white/20 shadow-sm hover:bg-white/30"
                className="text-white"
              />
            }
            open={open}
            setOpen={setOpen}
          >
            <TypeEditForm setOpen={setOpen} />
          </BaseDialog>
        </div>
      </div>

      {/* 내용 + 이미지 */}
      <div className="px-5 py-4 flex flex-col gap-3">
        <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
          {data.logs.content}
        </p>
        {data.logs.attaches.length > 0 && (
          <DialogCarousel pathList={data.logs.attaches.map((d) => d.path)} />
        )}
      </div>
    </CustomCard>
  );
};

/* ─────────────────────────────────────────
   좌측 — 답변 히스토리 (노션 코멘트)
───────────────────────────────────────── */
const ReplyTimeline = ({ data }: { data: VocDetail }) => {
  const [openDialogs, setOpenDialogs] = useState<Record<number, boolean>>({});
  const { rawValue: id } = useDecodeParam("id");
  const { getVocDetail, deleteReply } = useVocDetailStore();

  const createSetOpen =
    (seq: number) => (value: boolean | ((prev: boolean) => boolean)) => {
      setOpenDialogs((prev) => ({
        ...prev,
        [seq]: typeof value === "function" ? value(prev[seq] || false) : value,
      }));
    };

  const onDelete = async (seq: number) => {
    if (!id) return;
    await deleteReply(seq);
    await getVocDetail(id);
  };

  return (
    <CustomCard className="gap-0 py-0 divide-y divide-border flex flex-col min-h-0 h-fit">
      <div className="flex items-center justify-between px-4 py-3 bg-background flex-shrink-0">
        <span className="text-sm font-bold text-description">
          답변 히스토리
        </span>
        <span className="text-xs text-description-light">
          {data.replys.length}건
        </span>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6 ">
        {data.replys.length > 0 ? (
          <div className="flex flex-col gap-6 divide-y divide-border">
            {data.replys.map((r) => (
              <div key={r.replySeq} className="flex gap-3 pb-6 last:pb-0">
                {/* 아바타 */}
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-xs font-bold text-primary-foreground flex-shrink-0 mt-0.5">
                  {r.createUser?.charAt(0) ?? "?"}
                </div>
                {/* 본문 */}
                <div className="flex-1 flex flex-col gap-1.5 min-w-0">
                  {/* 헤더 */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-bold text-foreground">
                      {r.createUser}
                    </span>
                    {VocProcessBadge({ value: r.status })}
                    <span className="text-xs text-description-light ml-auto">
                      {format(r.createDt, "yyyy-MM-dd HH:mm:ss")}
                    </span>
                    <BaseDialog
                      title="답변 수정"
                      open={openDialogs[r.replySeq] || false}
                      setOpen={createSetOpen(r.replySeq)}
                      triggerChildren={
                        <IconButton
                          icon="SquarePen"
                          size={14}
                          bgClassName="w-7 h-7 p-1 !rounded-DEFAULT border border-border-strong shadow-sm"
                        />
                      }
                    >
                      <ReplyEditForm
                        data={r}
                        onClose={() => createSetOpen(r.replySeq)(false)}
                      />
                    </BaseDialog>
                    <CheckDialog
                      title={dialogText.replyItemDelete.title}
                      description={dialogText.replyItemDelete.description}
                      actionLabel={dialogText.replyItemDelete.actionLabel}
                      onClick={() => onDelete(r.replySeq)}
                    >
                      <IconButton
                        icon="Trash2"
                        size={14}
                        bgClassName="w-7 h-7 p-1 !rounded-DEFAULT border border-border-strong shadow-sm hover:border-destructive hover:bg-red-50"
                        className="group-hover:text-destructive"
                      />
                    </CheckDialog>
                  </div>
                  {/* 내용 박스 */}
                  <div className="rounded-xl border border-border bg-background overflow-hidden">
                    <div className="flex flex-col gap-1 px-3 py-2.5">
                      <span className="text-xs text-description-light">
                        내용
                      </span>
                      <span className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                        {r.content}
                      </span>
                    </div>
                    {r.attaches.length > 0 && (
                      <div className="px-3 py-2.5 border-t border-border">
                        <DialogCarousel
                          pathList={r.attaches.map((d) => d.path)}
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
            <EmptyBox message="등록된 답변이 없습니다." />
          </div>
        )}
      </div>
    </CustomCard>
  );
};

/* ─────────────────────────────────────────
   우측 — 답변 등록 폼
───────────────────────────────────────── */
const ReplyPanel = () => (
  <CustomCard className="gap-0 py-0 divide-y divide-border flex flex-col min-h-0 h-fit">
    <div className="px-4 py-3 bg-background flex-shrink-0">
      <span className="text-sm font-bold text-description">답변 등록</span>
    </div>
    <div className="flex-1 overflow-y-auto p-4">
      <ReplyAddForm />
    </div>
  </CustomCard>
);

/* ─────────────────────────────────────────
   스켈레톤
───────────────────────────────────────── */
const VocDetailSkeleton = () => (
  <div className="flex flex-col gap-4 flex-1 min-h-0">
    <BaseSkeleton className="h-24" />
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 flex-1 min-h-0">
      <div className="flex flex-col gap-3">
        <BaseSkeleton className="h-8" />
        {Array.from({ length: 3 }, (_, i) => (
          <BaseSkeleton key={i} className="h-24" />
        ))}
      </div>
      <div className="flex flex-col gap-3">
        <BaseSkeleton className="h-8" />
        <BaseSkeleton className="flex-1 min-h-0" />
      </div>
    </div>
  </div>
);

// const Page = () => {
//   const [open, setOpen] = useState<boolean>(false);
//   const { id } = useParams();
//   const { vocDetail, getVocDetail, loadingKeys } = useVocDetailStore();
//   const { isLoading, hasError } = useUIStore();
//   useEffect(() => {
//     if (!id) return;
//     getVocDetail(id.toString()).catch((err: Error) => {
//       if (err.message === "NOT_FOUND") return notFound();
//     });
//   }, [id, getVocDetail]);

//   const getInfo = () => {
//     if (isLoading(loadingKeys.INFO) || !vocDetail) return <VocInfoSkeleton />;
//     if (hasError(loadingKeys.INFO)) return <div>에러발생</div>;
//     return (
//       <div className="flex-1  flex flex-col gap-6 min-w-0">
//         <AppTitle title={vocDetail?.logs.title} isBorder />
//         <div className="flex justify-between items-center">
//           <KeyValueItem
//             label="유형"
//             value={vocDetail.logs.serviceTypeName}
//             valueStyle="text-md text-blue-500 font-normal"
//           />
//           <BaseDialog
//             title="담당 유형"
//             triggerChildren={<IconButton icon="SquarePen" size={16} />}
//             open={open}
//             setOpen={setOpen}
//           >
//             <TypeEditForm setOpen={setOpen} />
//           </BaseDialog>
//         </div>
//         <KeyValueItem
//           label="민원인"
//           value={vocDetail.logs.createUser || "내용없음"}
//           valueStyle="text-md font-normal"
//         />
//         <KeyValueItem
//           label="전화번호"
//           value={vocDetail.logs.phone || "내용없음"}
//           valueStyle="text-md font-normal"
//         />
//         <KeyValueItem
//           label="내용"
//           value={vocDetail.logs.content}
//           valueStyle="text-md font-normal"
//         />
//         <div>
//           <DialogCarousel
//             pathList={vocDetail.logs.attaches.map((d) => d.path)}
//           />
//         </div>
//       </div>
//     );
//   };

//   const getReply = () => {
//     if (isLoading(loadingKeys.INFO) || !vocDetail)
//       return Array.from({ length: 3 }, (_, i) => (
//         <BaseSkeleton key={i} className="h-28.5" />
//       ));
//     if (hasError(loadingKeys.INFO)) return <div>에러 발생</div>;
//     return (
//       <>
//         {vocDetail.replys.length > 0 ? (
//           vocDetail.replys.map((r, i) => <ReplyBox key={i} data={r} />)
//         ) : (
//           <>
//             <span className="text-sm text-[var(--description-light)]">
//               등록된 답변이 존재하지않습니다.
//             </span>
//           </>
//         )}
//         <ReplyAddForm />
//       </>
//     );
//   };

//   return (
//     <div className="flex flex-col gap-6  xl:flex-row xl:gap-12">
//       <div className="flex-1  flex flex-col gap-6 min-w-0">{getInfo()}</div>
//       <div className="flex-1  flex flex-col gap-6 min-w-0 ">
//         <AppTitle title="민원 답변" isBorder />
//         <div className="flex flex-col gap-6">{getReply()}</div>
//       </div>
//     </div>
//   );
// };

// const ReplyBox = ({ data }: { data: VocReply }) => {
//   const [open, setOpen] = useState<boolean>(false);
//   const { rawValue: id } = useDecodeParam("id");
//   const { getVocDetail, deleteReply } = useVocDetailStore();

//   const process = () => {
//     switch (data.status) {
//       case 0:
//         return (
//           <ProcessBadge
//             label="미처리"
//             icon={AlarmClockIcon}
//             style="bg-gray-400 w-fit px-2"
//           />
//         );
//       case 1:
//         return (
//           <ProcessBadge
//             label="처리중"
//             icon={RotateCwIcon}
//             style="bg-green-500 w-fit px-2"
//           />
//         );
//       case 2:
//         return (
//           <ProcessBadge
//             label="처리완료"
//             icon={CheckCircleIcon}
//             style="bg-blue-500 w-fit px-2"
//           />
//         );
//     }
//   };

//   const onDelete = async () => {
//     if (!id) return;
//     await deleteReply(data.replySeq);
//     await getVocDetail(id);
//   };
//   return (
//     <CustomCard className="gap-2 px-0" size={"sm"}>
//       <div className="flex justify-between items-center px-4">
//         <div className="space-x-2">
//           <span className="text-xs text-[var(--description-light)]">
//             {format(data.createDt, "yyyy-MM-dd HH:mm:ss")}
//           </span>
//           <span className="text-xs text-[var(--description-light)]">
//             {data.createUser}
//           </span>
//         </div>

//         <div className="flex gap-2 justify-end ">
//           <BaseDialog
//             title="답변 수정"
//             open={open}
//             setOpen={setOpen}
//             triggerChildren={<IconButton icon="SquarePen" size={16} />}
//           >
//             <ReplyEditForm data={data} onClose={() => setOpen(false)} />
//           </BaseDialog>
//           <CheckDialog
//             title={dialogText.replyItemDelete.title}
//             description={dialogText.replyItemDelete.description}
//             actionLabel={dialogText.replyItemDelete.actionLabel}
//             onClick={onDelete}
//           >
//             <IconButton icon="Trash2" size={16} />
//           </CheckDialog>
//         </div>
//       </div>
//       <div className="px-4">{process()}</div>

//       <div className="text-sm px-4">{data.content}</div>
//       <div className="px-4">
//         <DialogCarousel pathList={data.attaches.map((d) => d.path)} />
//       </div>
//     </CustomCard>
//   );
// };

// const VocInfoSkeleton = () => {
//   return (
//     <>
//       <BaseSkeleton className="h-7 " />
//       {Array.from({ length: 3 }, (_, i) => (
//         <div key={i} className="flex flex-col gap-1">
//           <BaseSkeleton className="w-20 h-4" />
//           <BaseSkeleton className="w-full h-6" />
//         </div>
//       ))}
//       <div className="flex flex-col gap-1">
//         <BaseSkeleton className="w-20 h-4" />
//         <BaseSkeleton className="w-full h-30" />
//       </div>
//       <div className="flex flex-col gap-1 ">
//         <BaseSkeleton className="w-20 h-4" />
//         <div className=" flex gap-4 overflow-hidden">
//           {Array.from({ length: 2 }, (_, i) => (
//             <BaseSkeleton key={i} className="w-48 h-32" />
//           ))}
//         </div>
//       </div>
//     </>
//   );
// };
