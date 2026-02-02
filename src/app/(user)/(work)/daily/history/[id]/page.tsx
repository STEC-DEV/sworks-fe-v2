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

const Page = () => {
  const { taskHistoryDetail, getTaskHistoryDetail, loadingKeys } =
    useTaskHistoryStore();
  const { isLoading, hasError } = useUIStore();
  const { rawValue } = useDecodeParam("id");
  const [selectWorker, setSelectWorker] = useState<TaskHistoryWorker | null>(
    null,
  );
  useEffect(() => {
    if (!rawValue) return;
    getTaskHistoryDetail(rawValue);
  }, [rawValue, getTaskHistoryDetail]);

  const handleSelect = (data: TaskHistoryWorker) => {
    setSelectWorker((prev) => (prev?.userSeq === data.userSeq ? null : data));
  };

  if (isLoading(loadingKeys.DETAIL) || !taskHistoryDetail)
    return <TaskHistoryDetailSkeleton />;
  if (hasError(loadingKeys.DETAIL)) return <div> 에러발생</div>;

  return (
    <PrevLayout>
      <div className="w-full flex-1  flex flex-col  xl:flex-row gap-12">
        <div className="xl:flex-1 flex flex-col gap-6">
          <div className="flex gap-2 items-end pb-4 border-b-2 border-border">
            <AppTitle title={taskHistoryDetail.title} />
            <span className="text-md font-medium text-blue-500">
              {taskHistoryDetail.serviceTypeName}
            </span>
          </div>
          {taskHistoryDetail.users?.length > 0 ? (
            <div className="flex flex-col gap-4">
              {taskHistoryDetail.users.map((user, i) => (
                <CustomCard
                  key={i}
                  variant="list"
                  className={cn(
                    "flex-row justify-between cursor-pointer items-center",
                    selectWorker?.userSeq === user.userSeq &&
                      "bg-blue-50 border-blue-500",
                  )}
                  onClick={() => handleSelect(user)}
                >
                  <span className="text-sm">{user.userName}</span>
                  <span className="text-blue-500 text-sm">
                    {user.logs.length}/{taskHistoryDetail.repeat}
                  </span>
                </CustomCard>
              ))}
            </div>
          ) : (
            <EmptyBox message="담당자가 존재하지않습니다." />
          )}
          {/* <ScrollArea className="max-h-80 xl:flex-1 overflow-hidden"></ScrollArea> */}
        </div>
        <div className="xl:flex-1 clear-start flex flex-col gap-6 overflow-hidden">
          <AppTitle title="업무이력" isBorder />
          {selectWorker ? (
            selectWorker.logs.length > 0 ? (
              selectWorker.logs.map((v, i) => {
                return (
                  <CustomCard key={i} size={"sm"}>
                    <span className="text-xs text-[var(--description-light)] relative">
                      {format(v.userWorkDt, "yyyy-MM-dd HH:mm:ss")}
                    </span>
                    <span className="text-sm">
                      {v.issue || "업무를 수행햐였습니다."}
                    </span>

                    {v.attaches.length > 0 && (
                      <DialogCarousel
                        pathList={v.attaches
                          .map((a) => a.logPath)
                          .filter((path): path is string => path !== undefined)}
                      />
                    )}
                  </CustomCard>
                );
              })
            ) : (
              <EmptyBox message="업무이력이 존재하지않습니다." />
            )
          ) : (
            <EmptyBox message="근무자를 선택해주세요." />
          )}
        </div>
      </div>
    </PrevLayout>
  );
};

export default Page;

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
