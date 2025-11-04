"use client";
import BaseSkeleton from "@/components/common/base-skeleton";
import CustomCard from "@/components/common/card";
import IconButton from "@/components/common/icon-button";
import AppTitle from "@/components/common/label/title";
import BaseDialog from "@/components/ui/custom/base-dialog";
import EmptyBox from "@/components/ui/custom/empty";
import DialogCarousel from "@/components/ui/custom/image/size-carousel";
import { useDecodeParam } from "@/hooks/params";
import { useDailyTaskDetailStore } from "@/store/normal/task/detail-daily";
import { Log, Worker } from "@/types/normal/task/detail-daily";
import { format } from "date-fns";

import React, { useEffect, useState } from "react";

const Page = () => {
  const { rawValue: id } = useDecodeParam("id");
  const { rawValue: date } = useDecodeParam("date");
  const { dailyTask, getDailyTask } = useDailyTaskDetailStore();
  const [selectWorker, setSelectWorker] = useState<Worker | null>(null);

  useEffect(() => {
    if (!id || !date) return;
    getDailyTask(id, date);
  }, [id, date]);

  useEffect(() => {}, [selectWorker]);

  const handleSelectWorker = (data: Worker) => {
    setSelectWorker(data);
  };

  return (
    <div className="flex flex-col xl:flex-row gap-12">
      {dailyTask ? (
        <div className="flex-1 flex flex-col gap-6">
          <AppTitle title={dailyTask.taskTitle} />
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
        </div>
      ) : (
        <BaseSkeleton />
      )}
      <div className="flex-1 flex flex-col gap-6">
        <AppTitle title="업무이력" />
        {selectWorker && selectWorker?.logs.length > 0 ? (
          selectWorker.logs.map((v, i) => {
            return <LogBox key={i} data={v} />;
          })
        ) : (
          <EmptyBox message="업무이력 없음" />
        )}
      </div>
    </div>
  );
};

export default Page;

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
  return (
    <CustomCard
      variant={"list"}
      className={`flex-row justify-between cursor-pointer ${
        isSelect ? "bg-blue-50 border-blue-500" : null
      }`}
      onClick={() => onClick(data)}
    >
      <span className="text-sm">{data.userName}</span>
      <span className="text-blue-500 text-sm">{`${
        data.logs.length
      }/${totalCount.toString()}`}</span>
    </CustomCard>
  );
};

const LogBox = ({ data }: { data: Log }) => {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <CustomCard className="" size={"sm"}>
      <div className="flex items-center justify-between">
        <span className="text-xs text-[var(--description-light)]">
          {format(data.workDt, "yyyy-MM-dd HH:mm:ss")}
        </span>
        {/* <BaseDialog
          title="업무이력 수정"
          triggerChildren={<IconButton icon="SquarePen" />}
          open={open}
          setOpen={setOpen}
        >
          <div></div>
        </BaseDialog> */}
      </div>

      <span className="text-sm">{data.issue}</span>
      <DialogCarousel
        pathList={data.attach
          .map((a, j) => a.images)
          .filter((image): image is string => image !== undefined)}
      />
    </CustomCard>
  );
};
