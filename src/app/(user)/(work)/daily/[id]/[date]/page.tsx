"use client";
import BaseSkeleton from "@/components/common/base-skeleton";
import CustomCard from "@/components/common/card";
import CheckDialog from "@/components/common/check-dialog";

import AppTitle from "@/components/common/label/title";

import EmptyBox from "@/components/ui/custom/empty";
import DialogCarousel from "@/components/ui/custom/image/size-carousel";
import { useDecodeParam } from "@/hooks/params";
import { useUIStore } from "@/store/common/ui-store";
import { useDailyTaskDetailStore } from "@/store/normal/task/detail-daily";
import { Log, Worker } from "@/types/normal/task/detail-daily";
import { format } from "date-fns";

import React, { useCallback, useEffect, useState } from "react";
import { dialogText } from "../../../../../../../public/text";
import BaseDialog from "@/components/ui/custom/base-dialog";
import IconButton from "@/components/common/icon-button";
import { usePermission } from "@/hooks/usePermission";
import { useAuthStore } from "@/store/auth/auth-store";
import LogEdit from "@/components/form/normal/task/log-edit";
import { useTaskDetailStore } from "@/store/normal/task/detail-task";
import DailyTaskLayout from "../../_components/detail/dailytask_layout";
import {
  NormalizedLog,
  PanelItem,
  StatItem,
} from "../../_components/detail/types";

const Page = () => {
  const { rawValue: id } = useDecodeParam("id");
  const { rawValue: date } = useDecodeParam("date");
  const {
    dailyTask: data,
    getDailyTask,
    putCoverTaskComplete,
    patchUpdateLogs,
    loadingKeys,
  } = useDailyTaskDetailStore();
  const { isLoading, hasError } = useUIStore();
  const { loginProfile } = useAuthStore();
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [selectWorker, setSelectWorker] = useState<Worker | null>(null);

  useEffect(() => {
    if (!id || !date) return;
    getDailyTask(id, date);
  }, [id, date, getDailyTask]);

  // dailyTask 변경 시 selectWorker 동기화
  useEffect(() => {
    if (!data || !selectWorker) return;

    const updatedWorker = data.users.find(
      (u) => u.userSeq === selectWorker.userSeq,
    );

    if (updatedWorker) {
      setSelectWorker(updatedWorker);
    }
  }, [data]);

  const handleCoverTaskComplete = useCallback(async () => {
    if (!selectedId || !data) return;
    await putCoverTaskComplete(selectedId, data.taskSeq);
    await getDailyTask(id, date);
  }, [selectedId, data, id, date]);

  if (isLoading(loadingKeys.INFO) || !data) {
    return <BaseSkeleton />;
  }

  if (hasError(loadingKeys.INFO)) return <div> 에러발생</div>;

  const statItem: StatItem[] = [
    {
      label: "전체",
      value: data.users.length,
      unit: "명",
      color: "primary",
      showBar: false,
    },
    {
      label: "완료",
      value: data.users.filter((v) => data.totalCount === v.logs.length).length,
      unit: "명",
      color: "green",
      showBar: false,
    },
    {
      label: "진행률",
      value: Math.round(
        (data.users.filter((v) => data.totalCount === v.logs.length).length /
          data.users.length) *
          100,
      ),
      unit: "%",
      color: "primary",
      showBar: true,
    },
  ];

  const panelItems: PanelItem[] = data.users.map((v) => ({
    id: v.userSeq,
    label: v.userName,
    isDone: data.totalCount === v.logs.length,
    current: v.logs.length,
    total: data.totalCount,
  }));

  const selectedPanelItem = panelItems.find((v) => v.id === selectedId) || null;
  const logs = data.users.find((v) => v.userSeq === selectedId)?.logs;
  const selectedLogs: NormalizedLog[] =
    logs?.map((v) => ({
      logSeq: v.logSeq,
      date: v.workDt,
      issue: v.issue ?? null,
      attachPaths: v.attach.map((v) => v.images),
    })) ?? [];

  const handleEditLog = async (
    log: NormalizedLog,
    editData: Record<string, any>,
  ) => {
    console.log("직전 전달", editData);
    await patchUpdateLogs(log.logSeq, editData);
    await getDailyTask(id, date);
  };

  return (
    <DailyTaskLayout
      title={data.taskTitle}
      statItems={statItem}
      //좌측패널
      panelLabel="근무자"
      panelTotalLabel={`${data.users.length} 명`}
      panelItems={panelItems}
      selectedId={selectedId}
      onSelect={(item) => setSelectedId(item.id)}
      //우측패널
      selectedItem={selectedPanelItem}
      logs={selectedLogs}
      //수정
      onEdit={
        loginProfile?.role === "현장 관리자" ||
        loginProfile?.userSeq === selectWorker?.userSeq
          ? (log, editData) => handleEditLog(log, editData)
          : undefined // undefined면 버튼 미표시
      }
      extraAction={
        loginProfile?.role === "현장 관리자" &&
        selectedPanelItem &&
        !selectedPanelItem.isDone ? (
          <CheckButton
            name={selectedPanelItem.label}
            onClick={handleCoverTaskComplete}
          />
        ) : undefined
      }
    />
  );
};

export default Page;

//  const handleSelectWorker = (data: Worker) => {
//     setSelectWorker(data);
//   };
// const handleCoverTaskComplete = useCallback(async () => {
//   if (!selectWorker || !data) return;

//   await putCoverTaskComplete(selectWorker.userSeq, data.taskSeq);
//   await getDailyTask(id, date);
// }, [selectWorker, data, id, date]);
// <div className="flex flex-col gap-6 flex-1 min-h-0">
//       {/* 헤더 + stat — 로딩 중엔 스켈레톤 */}
//       {isLoading(loadingKeys.INFO) || !dailyTask ? (
//         <div className="flex flex-col gap-6">
//           <BaseSkeleton className="h-7" />
//           <div className="grid grid-cols-3 gap-3">
//             {Array.from({ length: 3 }, (_, i) => (
//               <BaseSkeleton className="h-16" key={i} />
//             ))}
//           </div>
//         </div>
//       ) : (
//         <div className="flex flex-col gap-6">
//           <div className="flex items-center justify-between">
//             <AppTitle title={dailyTask.taskTitle} isPrev />
//           </div>

//           {/* stat 3개 */}
//           <div className="grid grid-cols-3 gap-5">
//             <CustomCard className="p-4 gap-1 justify-center">
//               <span className="text-xs text-description">전체 근무자</span>
//               <div className="text-2xl font-bold text-primary">
//                 {dailyTask.users.length}
//                 <span className="text-xs text-description font-normal ml-1">
//                   명
//                 </span>
//               </div>
//             </CustomCard>
//             <CustomCard className="p-4 gap-1 justify-center">
//               <span className="text-xs text-description">완료</span>
//               <div className="text-2xl font-bold text-green-600">
//                 {
//                   dailyTask.users.filter(
//                     (u) => u.logs.length >= dailyTask.totalCount,
//                   ).length
//                 }
//                 <span className="text-xs text-description font-normal ml-1">
//                   명
//                 </span>
//               </div>
//             </CustomCard>
//             <CustomCard className="p-4 gap-1">
//               <span className="text-xs text-description">전체 진행률</span>
//               <div className="text-2xl font-bold text-primary">
//                 {dailyTask.users.length === 0
//                   ? 0
//                   : Math.round(
//                       (dailyTask.users.filter(
//                         (u) => u.logs.length >= dailyTask.totalCount,
//                       ).length /
//                         dailyTask.users.length) *
//                         100,
//                     )}
//                 <span className="text-xs text-description font-normal ml-1">
//                   %
//                 </span>
//               </div>
//               <div className="h-1 rounded-full bg-border mt-1">
//                 <div
//                   className="h-full rounded-full bg-primary transition-all duration-500"
//                   style={{
//                     width: `${
//                       dailyTask.users.length === 0
//                         ? 0
//                         : Math.round(
//                             (dailyTask.users.filter(
//                               (u) => u.logs.length >= dailyTask.totalCount,
//                             ).length /
//                               dailyTask.users.length) *
//                               100,
//                           )
//                     }%`,
//                   }}
//                 />
//               </div>
//             </CustomCard>
//           </div>
//         </div>
//       )}

//       {/* 마스터-디테일 패널 */}
//       <div className="flex flex-1 min-h-0 rounded-DEFAULT overflow-hidden ">
//         {/* 좌측 근무자 패널 */}
//         <div className="w-[320px] flex-shrink-0 border  border-border flex flex-col overflow-hidden rounded-DEFAULT shadow-sm">
//           <div className="px-4 py-2.5 bg-background border-b border-border flex items-center justify-between">
//             <span className="text-xs font-bold text-description">근무자</span>
//             <span className="text-xs text-description-light">
//               {dailyTask?.users.length ?? 0}명
//             </span>
//           </div>
//           <div className="flex-1 overflow-y-auto bg-surface">
//             {isLoading(loadingKeys.INFO) || !dailyTask ? (
//               <div className="flex flex-col gap-2 p-3">
//                 {Array.from({ length: 4 }, (_, i) => (
//                   <BaseSkeleton className="h-14" key={i} />
//                 ))}
//               </div>
//             ) : dailyTask.users.length > 0 ? (
//               dailyTask.users.map((v, i) => (
//                 <WorkerBox
//                   key={i}
//                   data={v}
//                   totalCount={dailyTask.totalCount}
//                   isSelect={
//                     selectWorker ? v.userSeq === selectWorker.userSeq : false
//                   }
//                   onClick={handleSelectWorker}
//                 />
//               ))
//             ) : (
//               <EmptyBox message="근무자 없음" />
//             )}
//           </div>
//         </div>

//         {/* 우측 상세 뷰 */}
//         <div className="flex-1 flex flex-col bg-background overflow-y-auto px-6 gap-4">
//           {!selectWorker || !dailyTask ? (
//             <div className="flex-1 flex items-center justify-center">
//               <EmptyBox
//                 message="근무자를 선택해주세요"
//                 subMessage="선택된 근무자가 없어요"
//               />
//             </div>
//           ) : (
//             <>
//               {/* 선택된 근무자 카드 */}
//               <CustomCard className="flex-row items-center justify-between px-6">
//                 <div className="flex items-center gap-3">
//                   <div className="flex flex-col gap-0.5">
//                     <span className="text-sm font-bold text-foreground">
//                       {selectWorker.userName}
//                     </span>
//                     <span className="text-xs text-description-light">
//                       {selectWorker.logs.length}/{dailyTask.totalCount} 완료
//                     </span>
//                   </div>
//                 </div>
//                 <span
//                   className={`text-[10px] font-bold px-2 py-1 rounded-md border
//           ${
//             selectWorker.logs.length >= dailyTask.totalCount
//               ? "bg-green-50 text-green-600 border-green-200"
//               : "bg-orange-50 text-orange-500 border-orange-200"
//           }`}
//                 >
//                   {selectWorker.logs.length >= dailyTask.totalCount
//                     ? "완료"
//                     : "미완료"}
//                 </span>
//               </CustomCard>

//               {/* 업무 완료 버튼 */}
//               {loginProfile?.role === "현장 관리자" &&
//                 selectWorker.logs.length < dailyTask.totalCount && (
//                   <CheckButton
//                     name={selectWorker.userName}
//                     onClick={handleCoverTaskComplete}
//                   />
//                 )}

//               {/* 이력 */}
//               {selectWorker.logs.length > 0 ? (
//                 <CustomCard className="gap-0 py-0 divide-y divide-border">
//                   <div className="px-4 py-3 bg-background">
//                     <span className="text-xs font-bold text-description">
//                       업무이력
//                     </span>
//                   </div>
//                   <div className="px-4 py-4 flex flex-col gap-0">
//                     {/* 타임라인 세로선 */}
//                     <div className="relative ml-3 flex flex-col gap-0">
//                       {selectWorker.logs.map((v, i) => (
//                         <div key={i} className="relative pl-6 pb-6 last:pb-0">
//                           {/* 세로선 — 점 아래부터 다음 점까지만 */}
//                           {i < selectWorker.logs.length - 1 && (
//                             <div className="absolute left-[5px] top-4 bottom-0 w-0.5 bg-border" />
//                           )}
//                           {/* 점 */}
//                           <div className="absolute left-0 top-1.5 w-3 h-3 rounded-full bg-primary border-2 border-white shadow-sm" />
//                           {/* 로그 박스 + 하단 여백 구분 */}
//                           <div className="mb-2 last:mb-0">
//                             <LogBox worker={selectWorker} data={v} />
//                           </div>
//                           {/* 구분선 — LogBox와 다음 항목 사이 */}
//                           {i < selectWorker.logs.length - 1 && (
//                             <div className="border-b border-border mt-2 mr-0" />
//                           )}
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 </CustomCard>
//               ) : (
//                 <EmptyBox message="업무이력 없음" />
//               )}
//             </>
//           )}
//         </div>
//       </div>
//     </div>

const WorkerBox = ({
  data,
  totalCount,
  isSelect,
  onClick,
}: {
  data: Worker;
  totalCount: number;
  isSelect: boolean;
  onClick: (data: Worker) => void;
}) => {
  const isDone = data.logs.length >= totalCount;
  const initial = data.userName.charAt(0);
  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 border-b border-border cursor-pointer transition-colors
        ${isSelect ? "bg-primary-background border-l-2 border-l-primary" : "hover:bg-background"}`}
      onClick={() => onClick(data)}
    >
      {/* <div
        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0
        ${isDone ? "bg-primary" : "bg-warning"}`}
      >
        {initial}
      </div> */}
      <div className="flex-1 min-w-0">
        <div
          className={`text-xs font-semibold truncate ${isSelect ? "text-primary" : "text-foreground"}`}
        >
          {data.userName}
        </div>
      </div>
      <div className="flex flex-col items-end gap-1">
        <span
          className={`text-[10px] font-bold px-2 py-0.5 rounded-md border
          ${
            isDone
              ? "bg-green-50 text-green-600 border-green-200"
              : "bg-orange-50 text-orange-500 border-orange-200"
          }`}
        >
          {isDone ? "완료" : "미완료"}
        </span>
        <span className="text-[10px] text-description-light">
          {data.logs.length}/{totalCount}
        </span>
      </div>
    </div>
  );
};

const LogBox = ({ worker, data }: { worker: Worker; data: Log }) => {
  const [open, setOpen] = useState<boolean>(false);
  const { loginProfile } = useAuthStore();
  const { patchUpdateLogs, getDailyTask } = useDailyTaskDetailStore();
  const { rawValue: id } = useDecodeParam("id");
  const { rawValue: date } = useDecodeParam("date");

  const handleSubmitLog = async (editData: Record<string, any>) => {
    if (!id || !date) return;
    await patchUpdateLogs(data.logSeq, editData);
    setOpen(false);
    await getDailyTask(id, date);
  };

  return (
    <CustomCard className="gap-4 border-none shadow-none" size={"sm"}>
      <div className="flex items-center justify-between">
        <span className="text-xs text-description">
          {format(data.workDt, "yyyy-MM-dd HH:mm:ss")}
        </span>
        {(worker.userSeq === loginProfile?.userSeq ||
          loginProfile?.role === "현장 관리자") && (
          <BaseDialog
            title="업무이력 수정"
            triggerChildren={<IconButton icon="SquarePen" />}
            open={open}
            setOpen={setOpen}
          >
            <LogEdit log={data} onSubmit={handleSubmitLog} />
          </BaseDialog>
        )}
      </div>

      <span className="text-sm">{data.issue ?? "업무를 수행하였습니다."}</span>
      {data.attach.length > 0 && (
        <DialogCarousel
          pathList={data.attach
            .map((a) => a.images)
            .filter((image): image is string => image !== undefined)}
        />
      )}
    </CustomCard>
  );
};

const CheckButton = ({
  name,
  onClick,
}: {
  name: string;
  onClick: () => void;
}) => {
  return (
    <CheckDialog
      buttonColor="bg-amber-500 hover:bg-amber-600"
      title={dialogText.taskCoverAdd.title}
      description={`${name}${dialogText.taskCoverAdd.description}`}
      actionLabel={dialogText.taskCoverAdd.actionLabel}
      onClick={onClick}
    >
      <CustomCard
        size={"sm"}
        className="border-amber-500 bg-amber-50 cursor-pointer hover:bg-amber-100"
      >
        <div className="text-sm text-center text-amber-500">업무 완료</div>
      </CustomCard>
    </CheckDialog>
  );
};

// 페이지
/**
 *
 * const getInfo = () => {
    if (isLoading(loadingKeys.INFO) || !dailyTask)
      return (
        <>
          <BaseSkeleton className="h-7" />
          <div className="flex flex-col gap-4">
            {Array.from({ length: 4 }, (_, i) => (
              <BaseSkeleton className="h-13.5" key={i} />
            ))}
          </div>
        </>
      );
    if (hasError(loadingKeys.INFO)) return <div>에러 발생</div>;
    return (
      <>
        <AppTitle title={dailyTask.taskTitle} isPrev />
        {dailyTask.users.length > 0 ? (
          <div className="flex flex-col gap-4">
            {dailyTask.users.map((v, i) => (
              <WorkerBox
                key={i}
                data={v}
                totalCount={dailyTask.totalCount}
                isSelect={
                  selectWorker ? v.userSeq === selectWorker?.userSeq : false
                }
                onClick={handleSelectWorker}
              />
            ))}
          </div>
        ) : (
          <EmptyBox message="근무자 없음" />
        )}
      </>
    );
  };
 * 
 *  
 *return 
<div className="flex flex-col xl:flex-row gap-12">
      <div className="flex-1 flex flex-col gap-6">{getInfo()}</div>
      <div className="flex-1 flex flex-col gap-6">
        <AppTitle title="업무이력" isBorder />
        {!selectWorker || !dailyTask ? (
          <EmptyBox message="근무자를 선택해주세요" />
        ) : (
          <>
            
            {loginProfile?.role === "현장 관리자" &&
              selectWorker.logs.length < dailyTask.totalCount && (
                <CheckButton
                  name={selectWorker.userName}
                  onClick={handleCoverTaskComplete}
                />
              )}

            
            {selectWorker.logs.length > 0 ? (
              selectWorker.logs.map((v, i) => (
                <LogBox worker={selectWorker} key={i} data={v} />
              ))
            ) : (
              <EmptyBox message="업무이력 없음" />
            )}
          </>
        )}
      </div>
    </div>
 * 
 */

/**
     * worker
     *  // <CustomCard
    //   variant={"list"}
    //   className={`flex-row justify-between cursor-pointer ${
    //     isSelect ? "bg-blue-50 border-blue-500" : null
    //   }`}
    //   onClick={() => onClick(data)}
    // >
    //   <span className="text-sm">{data.userName}</span>
    //   <span className="text-blue-500 text-sm">{`${
    //     data.logs.length
    //   }/${totalCount.toString()}`}</span>
    // </CustomCard>
     */
