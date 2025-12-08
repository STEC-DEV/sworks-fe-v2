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

const Page = () => {
  const { rawValue: id } = useDecodeParam("id");
  const { rawValue: date } = useDecodeParam("date");
  const { dailyTask, getDailyTask, putCoverTaskComplete, loadingKeys } =
    useDailyTaskDetailStore();
  const { isLoading, hasError } = useUIStore();
  const { loginProfile } = useAuthStore();
  const [selectWorker, setSelectWorker] = useState<Worker | null>(null);

  useEffect(() => {
    if (!id || !date) return;
    getDailyTask(id, date);
  }, [id, date, getDailyTask]);

  const handleSelectWorker = (data: Worker) => {
    setSelectWorker(data);
  };

  // dailyTask 변경 시 selectWorker 동기화
  useEffect(() => {
    if (!dailyTask || !selectWorker) return;

    const updatedWorker = dailyTask.users.find(
      (u) => u.userSeq === selectWorker.userSeq
    );

    if (updatedWorker) {
      setSelectWorker(updatedWorker);
    }
  }, [dailyTask]);

  const handleCoverTaskComplete = useCallback(async () => {
    if (!selectWorker || !dailyTask) return;

    await putCoverTaskComplete(selectWorker.userSeq, dailyTask.taskSeq);
    await getDailyTask(id, date);
  }, [selectWorker, dailyTask, id, date]);

  const getInfo = () => {
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
        <AppTitle title={dailyTask.taskTitle} isBorder />{" "}
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

  return (
    <div className="flex flex-col xl:flex-row gap-12">
      <div className="flex-1 flex flex-col gap-6">{getInfo()}</div>
      <div className="flex-1 flex flex-col gap-6">
        <AppTitle title="업무이력" isBorder />
        {!selectWorker || !dailyTask ? (
          <EmptyBox message="근무자를 선택해주세요" />
        ) : (
          <>
            {/* totalCount와 logs.length가 다르면 CheckButton 표시 */}
            {loginProfile?.role === "현장 관리자" &&
              selectWorker.logs.length < dailyTask.totalCount && (
                <CheckButton
                  name={selectWorker.userName}
                  onClick={handleCoverTaskComplete}
                />
              )}

            {/* logs가 있으면 표시, 없으면 EmptyBox */}
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
    <CustomCard className="gap-4" size={"sm"}>
      <div className="flex items-center justify-between">
        <span className="text-xs text-[var(--description-light)]">
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
