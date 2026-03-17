"use client";
import BaseSkeleton from "@/components/common/base-skeleton";
import CustomCard from "@/components/common/card";
import AppTitle from "@/components/common/label/title";
import PrevLayout from "@/components/layout/prev-layout";
import EmptyBox from "@/components/ui/custom/empty";
import DialogCarousel from "@/components/ui/custom/image/size-carousel";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useDecodeParam } from "@/hooks/params";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/store/common/ui-store";
import { useTaskHistoryStore } from "@/store/normal/task/task-history-store";
import { TaskHistoryWorker } from "@/types/normal/task/task-history-detail";

import { format } from "date-fns";
import React, { useEffect, useState } from "react";
import DailyTaskLayout from "../../_components/detail/dailytask_layout";
import {
  NormalizedLog,
  PanelItem,
  StatItem,
} from "../../_components/detail/types";

const Page = () => {
  const {
    taskHistoryDetail: data,
    getTaskHistoryDetail,
    loadingKeys,
  } = useTaskHistoryStore();
  const { isLoading, hasError } = useUIStore();
  const { rawValue } = useDecodeParam("id");

  const [selectedId, setSelectedId] = useState<number | null>(null);

  useEffect(() => {
    if (!rawValue) return;
    getTaskHistoryDetail(rawValue);
  }, [rawValue, getTaskHistoryDetail]);

  if (isLoading(loadingKeys.DETAIL) || !data)
    return <TaskHistoryDetailSkeleton />;
  if (hasError(loadingKeys.DETAIL)) return <div> 에러발생</div>;

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
      value: data.users.filter((v) => data.repeat === v.logs.length).length,
      unit: "명",
      color: "green",
      showBar: false,
    },
    {
      label: "진행률",
      value: Math.round(
        (data.users.filter((v) => data.repeat === v.logs.length).length /
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
    isDone: data.repeat === v.logs.length,
    current: v.logs.length,
    total: data.repeat,
  }));

  const selectedPanelItem = panelItems.find((v) => v.id === selectedId) || null;
  const logs = data.users.find((v) => v.userSeq === selectedId)?.logs;
  const selectedLogs: NormalizedLog[] =
    logs?.map((v) => ({
      logSeq: v.logSeq,
      date: v.userWorkDt,
      issue: v.issue,
      attachPaths: v.attaches.map((v) => v.logPath),
    })) ?? [];

  return (
    <DailyTaskLayout
      title={data.title}
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
    />
  );
};

export default Page;

// const [selectWorker, setSelectWorker] = useState<TaskHistoryWorker | null>(
//   null,
// );
// const handleSelect = (item: TaskHistoryWorker) => {
//   setSelectWorker((prev) => (prev?.userSeq === item.userSeq ? null : item));
// };
// <PrevLayout>
//   <div className="w-full flex-1  flex flex-col  xl:flex-row gap-12">
//     <div className="xl:flex-1 flex flex-col gap-6">
//       <div className="flex gap-2 items-end pb-4 border-b-2 border-border">
//         <AppTitle title={taskHistoryDetail.title} />
//         <span className="text-md font-medium text-blue-500">
//           {taskHistoryDetail.serviceTypeName}
//         </span>
//       </div>
//       {taskHistoryDetail.users?.length > 0 ? (
//         <div className="flex flex-col gap-4">
//           {taskHistoryDetail.users.map((user, i) => (
//             <CustomCard
//               key={i}
//               variant="list"
//               className={cn(
//                 "flex-row justify-between cursor-pointer items-center",
//                 selectWorker?.userSeq === user.userSeq &&
//                   "bg-blue-50 border-blue-500",
//               )}
//               onClick={() => handleSelect(user)}
//             >
//               <span className="text-sm">{user.userName}</span>
//               <span className="text-blue-500 text-sm">
//                 {user.logs.length}/{taskHistoryDetail.repeat}
//               </span>
//             </CustomCard>
//           ))}
//         </div>
//       ) : (
//         <EmptyBox message="담당자가 존재하지않습니다." />
//       )}
//       {/* <ScrollArea className="max-h-80 xl:flex-1 overflow-hidden"></ScrollArea> */}
//     </div>
//     <div className="xl:flex-1 clear-start flex flex-col gap-6 overflow-hidden">
//       <AppTitle title="업무이력" isBorder />
//       {selectWorker ? (
//         selectWorker.logs.length > 0 ? (
//           selectWorker.logs.map((v, i) => {
//             return (
//               <CustomCard key={i} size={"sm"}>
//                 <span className="text-xs text-[var(--description-light)] relative">
//                   {format(v.userWorkDt, "yyyy-MM-dd HH:mm:ss")}
//                 </span>
//                 <span className="text-sm">
//                   {v.issue || "업무를 수행햐였습니다."}
//                 </span>

//                 {v.attaches.length > 0 && (
//                   <DialogCarousel
//                     pathList={v.attaches
//                       .map((a) => a.logPath)
//                       .filter((path): path is string => path !== undefined)}
//                   />
//                 )}
//               </CustomCard>
//             );
//           })
//         ) : (
//           <EmptyBox message="업무이력이 존재하지않습니다." />
//         )
//       ) : (
//         <EmptyBox message="근무자를 선택해주세요." />
//       )}
//     </div>
//   </div>
// </PrevLayout>

const TaskHistoryDetailSkeleton = () => {
  return (
    <div className="flex flex-col xl:flex-row gap-12 overflow-hidden">
      <div className="flex flex-col gap-6 flex-1">
        <BaseSkeleton className="h-7" />
        <div className="flex flex-col gap-4">
          {Array.from({ length: 12 }, (_, i) => (
            <BaseSkeleton key={i} className="h-13.5" />
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-6 flex-1">
        <BaseSkeleton className="h-7" />
        {Array.from({ length: 3 }, (_, i) => (
          <BaseSkeleton key={i} className="h-40" />
        ))}
      </div>
    </div>
  );
};
