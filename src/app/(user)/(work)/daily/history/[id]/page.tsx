"use client";
import BaseSkeleton from "@/components/common/base-skeleton";
import CustomCard from "@/components/common/card";
import AppTitle from "@/components/common/label/title";
import DialogCarousel from "@/components/ui/custom/image/size-carousel";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useDecodeParam } from "@/hooks/params";
import { useTaskHistoryStore } from "@/store/normal/task/task-history-sotre";
import { TaskHistoryWorker } from "@/types/normal/task/task-history-detail";
import { ScrollAreaScrollbar } from "@radix-ui/react-scroll-area";
import { format, formatISO } from "date-fns";
import React, { useEffect, useState } from "react";

const Page = () => {
  const { taskHistoryDetail, getTaskHistoryDetail } = useTaskHistoryStore();
  const { rawValue } = useDecodeParam("id");
  const [selectWorker, setSelectWorker] = useState<TaskHistoryWorker | null>(
    null
  );
  useEffect(() => {
    if (!rawValue) return;
    getTaskHistoryDetail(rawValue);
  }, [rawValue]);

  const handleSelect = (data: TaskHistoryWorker) => {
    setSelectWorker((prev) => (prev?.userSeq === data.userSeq ? null : data));
  };

  return (
    <div className="flex flex-col xl:flex-row gap-12">
      {taskHistoryDetail ? (
        <div className="flex-1 flex flex-col gap-6">
          <AppTitle title={taskHistoryDetail.title} />
          <div className="space-y-4">
            {taskHistoryDetail.users.map((user, i) => (
              <CustomCard
                key={i}
                variant={"list"}
                className={`flex-row justify-between cursor-pointer items-center  ${
                  selectWorker?.userSeq === user.userSeq
                    ? "bg-blue-50 border-blue-500"
                    : null
                }`}
                onClick={() => handleSelect(user)}
              >
                <span>{user.userName}</span>
                <span className="text-blue-500 text-sm">{`${user.logs.length}/${taskHistoryDetail.repeat}`}</span>
              </CustomCard>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <BaseSkeleton className="h-9" />
          <div className="mt-6 flex flex-col gap-4">
            <BaseSkeleton className="w-[54px]" />
            <BaseSkeleton className="w-[54px]" />
            <BaseSkeleton className="w-[54px]" />
          </div>
        </div>
      )}
      <div className="flex-1 clear-start flex flex-col gap-6 overflow-hidden">
        <AppTitle title="업무이력" />
        {selectWorker ? (
          selectWorker.logs.length > 0 ? (
            selectWorker.logs.map((v, i) => {
              return (
                <CustomCard key={i} size={"sm"}>
                  <span className="text-xs text-[var(--description-light)] relative">
                    {format(v.userWorkDt, "yyyy-MM-dd HH:mm:ss")}
                  </span>
                  <span className="text-sm">{v.issue}</span>

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
            <div>
              <span className="text-sm text-[var(--description-dark)]">
                업무이력이 존재하지 않습니다.
              </span>
            </div>
          )
        ) : null}
      </div>
    </div>
  );
};

export default Page;
