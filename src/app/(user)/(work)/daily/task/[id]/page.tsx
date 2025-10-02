"use client";
import { KeyValueItem } from "@/app/(user)/equipment/[id]/[history-id]/page";
import UserList from "@/app/(user)/workplace/_components/_user/list";
import { ChecklistAccordion } from "@/app/admin/checklist/[id]/_components/chk-accordion";
import BaseSkeleton from "@/components/common/base-skeleton";
import Button from "@/components/common/button";
import CustomCard from "@/components/common/card";
import IconButton from "@/components/common/icon-button";
import Input from "@/components/common/input";
import AppTitle from "@/components/common/label/title";
import TaskInfoEditForm from "@/components/form/normal/task/info-edit";
import BaseDialog from "@/components/ui/custom/base-dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useDecodeParam } from "@/hooks/params";
import { useTaskDetailStore } from "@/store/normal/task/detail-task";

import { format } from "date-fns";
import React, { useEffect, useState } from "react";

const Page = () => {
  const { taskDetail, getTaskDetail, patchUpdateTaskDetail } =
    useTaskDetailStore();
  const { rawValue } = useDecodeParam("id");
  const [infoEditOpen, setInfoEditOpen] = useState<boolean>(false);
  const [workerEditOpen, setWorkerEditOpen] = useState<boolean>(false);

  useEffect(() => {
    if (!rawValue) return;
    getTaskDetail(rawValue);
  }, [rawValue]);

  const duration = () => {
    if (!taskDetail) return;
    var value = "";

    switch (taskDetail.termType) {
      case 0:
        value = "매일";
        break;
      case 1:
        value = format(taskDetail.startDt, "yyyy/MM/dd");
        break;
      case 2:
        taskDetail.endDt
          ? (value = `${format(taskDetail.startDt, "yyyy/MM/dd")} ~ ${format(
              taskDetail.endDt,
              "yyyy/MM/dd"
            )}`)
          : "";
        break;
    }

    return (
      <KeyValueItem
        label="기간"
        value={value}
        labelStyle="text-sm"
        valueStyle="text-sm font-normal"
      />
    );
  };

  const handleUpdate = async (values: Record<string, any>) => {
    await patchUpdateTaskDetail(values);
    await getTaskDetail(rawValue);
    setInfoEditOpen(false);
  };
  return (
    <div className="flex flex-col gap-6 xl:flex-row xl:gap-12">
      {/* 정보 */}
      <div className="flex-1 flex flex-col gap-6">
        {taskDetail ? (
          <>
            <div className="flex justify-between items-center">
              <AppTitle title={taskDetail.title} />
              <BaseDialog
                title="업무정보 수정"
                open={infoEditOpen}
                setOpen={setInfoEditOpen}
                triggerChildren={<IconButton icon="SquarePen" />}
              >
                <TaskInfoEditForm onSubmit={handleUpdate} />
              </BaseDialog>
            </div>
            <div className="flex flex-col gap-4">
              <KeyValueItem
                label="업무유형"
                labelStyle="text-sm"
                value={taskDetail?.serviceTypeName}
                valueStyle="text-blue-500 text-sm font-normal"
              />
              <KeyValueItem
                label="반복횟수"
                value={`${taskDetail?.repeats.toString()}회`}
                labelStyle="text-sm"
                valueStyle="text-sm font-normal"
              />
              {duration()}
              <div className="flex justify-between items-center">
                <AppTitle title={"체크리스트"} />
                <IconButton icon="SquarePen" />
              </div>
              {taskDetail.mains.map((c, i) => (
                <ChecklistAccordion key={i} data={c} />
              ))}
            </div>
          </>
        ) : null}
      </div>
      {/* 근무자 */}
      {taskDetail ? (
        <div className="flex-1 flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <AppTitle title={"근무자"} />
            <BaseDialog
              triggerChildren={<IconButton icon={"SquarePen"} size={16} />}
              title="근무자 수정"
              open={workerEditOpen}
              setOpen={setWorkerEditOpen}
            >
              <WorkerEditContents
                serviceType={taskDetail?.serviceTypeSeq}
                onClose={() => setWorkerEditOpen(false)}
              />
            </BaseDialog>
          </div>

          <div className="flex flex-col gap-2">
            {taskDetail?.users.map((u, i) => (
              <Worker key={i} data={u} />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
};

const Worker = ({ data }: { data: Worker }) => {
  return (
    <CustomCard
      variant={"list"}
      size={"sm"}
      className="flex-row justify-between items-center"
    >
      <div className="flex gap-6">
        <span className="text-sm">{data.userName}</span>
        <span className="text-sm">{data.phone}</span>
      </div>
      <span className="text-sm text-blue-500">{data.serviceTypeName}</span>
    </CustomCard>
  );
};

const WorkerEditContents = ({
  serviceType,
  onClose,
}: {
  serviceType: number;
  onClose: () => void;
}) => {
  const [search, setSearch] = useState<string>("");
  const [selectedWorker, setSelectedWorker] = useState<number[]>([]);
  const {
    taskDetail,
    classificationTaskWorker,
    getTaskUserList,
    getTaskDetail,
    putUpdateTaskWorker,
  } = useTaskDetailStore();

  useEffect(() => {
    if (!taskDetail) return;
    setSelectedWorker(taskDetail.users.map((u) => u.userSeq));
  }, [taskDetail]);

  useEffect(() => {
    getTaskUserList(serviceType.toString());
  }, [serviceType]);

  const handleCheck = async (item: ClassificationTaskWorker) => {
    setSelectedWorker((prev) => {
      const data = prev.includes(item.userSeq)
        ? prev.filter((user) => user !== item.userSeq)
        : [...prev, item.userSeq];

      return data;
    });
  };

  const handleSubmit = async () => {
    if (!taskDetail) return;
    await putUpdateTaskWorker(selectedWorker);
    await getTaskDetail(taskDetail.taskSeq.toString());
    onClose();
  };

  return (
    <div className="flex flex-col gap-6 px-6 xl:h-[80vh]">
      <Input
        className="w-full"
        placeholder="근무자명"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <ScrollArea className="flex-1">
        <div className="h-full flex flex-col gap-2">
          {classificationTaskWorker?.map((v, i) => (
            <CustomCard
              key={i}
              variant={"list"}
              className={`flex-row justify-between ${
                selectedWorker.includes(v.userSeq)
                  ? "bg-blue-50 border-blue-500"
                  : null
              }`}
              onClick={() => handleCheck(v)}
            >
              <span className="text-sm">{v.userName}</span>
              <span className="text-sm text-blue-500">{v.serviceTypeName}</span>
            </CustomCard>
          ))}
        </div>
      </ScrollArea>
      <Button label="저장" onClick={handleSubmit} />
    </div>
  );
};

export default Page;
