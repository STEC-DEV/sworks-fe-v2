"use client";

import { ChecklistAccordion } from "@/app/admin/checklist/[id]/_components/chk-accordion";
import BaseTable from "@/components/common/base-table";
import Button from "@/components/common/button";
import CustomCard from "@/components/common/card";
import IconButton from "@/components/common/icon-button";
import Input from "@/components/common/input";
import AppTitle from "@/components/common/label/title";
import TaskInfoEditForm from "@/components/form/normal/task/info-edit";
import BaseDialog from "@/components/ui/custom/base-dialog";

import { KeyValueItem } from "@/components/ui/custom/key-value";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useDecodeParam } from "@/hooks/params";
import { useTaskDetailStore } from "@/store/normal/task/detail-task";

import { format } from "date-fns";
import React, { useEffect, useState } from "react";
import { WorkerColumns } from "./_components/worker-columns";
import { useUIStore } from "@/store/common/ui-store";
import BaseSkeleton from "@/components/common/base-skeleton";

const Page = () => {
  const { taskDetail, getTaskDetail, patchUpdateTaskDetail, loadingKeys } =
    useTaskDetailStore();
  const { isLoading, hasError } = useUIStore();
  const { rawValue } = useDecodeParam("id");

  const [infoEditOpen, setInfoEditOpen] = useState<boolean>(false);
  const [workerEditOpen, setWorkerEditOpen] = useState<boolean>(false);

  useEffect(() => {
    if (!rawValue) return;
    getTaskDetail(rawValue);
  }, [rawValue]);

  const duration = () => {
    if (!taskDetail) return;
    let value = "";

    switch (taskDetail.termType) {
      case 0:
        value = "매일";
        break;
      case 1:
        value = format(taskDetail.startDt, "yyyy/MM/dd");
        break;
      case 2:
        value = taskDetail.endDt
          ? `${format(taskDetail.startDt, "yyyy/MM/dd")} ~ ${format(
              taskDetail.endDt,
              "yyyy/MM/dd"
            )}`
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
    if (!rawValue) return;
    await patchUpdateTaskDetail(values);
    setInfoEditOpen(false);
    await getTaskDetail(rawValue);
  };

  if (isLoading(loadingKeys.DETAIL) || !taskDetail)
    return <TaskDetailSkeleton />;
  if (hasError(loadingKeys.DETAIL)) return <div>에러 발생</div>;
  return (
    <div className="flex flex-col gap-12 xl:flex-row xl:gap-12 ">
      <div className="flex-1  flex flex-col gap-12">
        <div className="flex flex-col gap-6">
          <div className="flex justify-between items-center pb-4 border-b-2 border-border">
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
          </div>
        </div>
        <div className="flex flex-col gap-6">
          <div className="flex justify-between items-center pb-4 border-b-2 border-border">
            <AppTitle title={"체크리스트"} />
            <IconButton icon="SquarePen" />
          </div>
          <div className="flex flex-col gap-4">
            {taskDetail.mains.map((c, i) => (
              <ChecklistAccordion key={i} data={c} />
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-6">
        <div className="flex justify-between items-center pb-4 border-b-2 border-border">
          <AppTitle title={"근무자"} />
          <BaseDialog
            triggerChildren={<IconButton icon={"SquarePen"} size={16} />}
            title="근무자 수정"
            open={workerEditOpen}
            setOpen={setWorkerEditOpen}
          >
            <WorkerEditContents
              serviceType={taskDetail.serviceTypeSeq}
              onClose={() => setWorkerEditOpen(false)}
            />
          </BaseDialog>
        </div>
        <BaseTable columns={WorkerColumns} data={taskDetail.users} />
      </div>
    </div>
  );
};

const WorkerEditContents = ({
  onClose,
}: {
  serviceType: number;
  onClose: () => void;
}) => {
  const [search, setSearch] = useState<string>("");
  const [selectedWorker, setSelectedWorker] = useState<number[]>([]);
  const { rawValue } = useDecodeParam("id");
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
    if (!rawValue) return;
    getTaskUserList(rawValue);
  }, [rawValue, getTaskUserList]);

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
    onClose();
    await getTaskDetail(taskDetail.taskSeq.toString());
  };

  return (
    <div className="w-full flex flex-col gap-6 ">
      <div className="px-6">
        <Input
          className="w-full"
          placeholder="근무자명"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full px-6">
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
                <span className="text-sm text-blue-500">
                  {v.serviceTypeName}
                </span>
              </CustomCard>
            ))}
          </div>
        </ScrollArea>
      </div>

      <div className="shrink-0 px-6">
        <Button label="저장" onClick={handleSubmit} />
      </div>
    </div>
  );
};

export default Page;

const TaskDetailSkeleton = () => {
  return (
    <div className="flex flex-col gap-6 xl:flex-row xl:gap-12 overflow-hidden ">
      <div className="flex-1 flex flex-col gap-6">
        <BaseSkeleton className="h-8" />
        <div className="flex flex-col gap-4">
          {Array.from({ length: 3 }, (_, i) => (
            <div key={i} className="flex flex-col gap-1">
              <BaseSkeleton className="w-15 h-5" />
              <BaseSkeleton className="h-5" />
            </div>
          ))}
        </div>
        <BaseSkeleton className="h-8" />
        <div className="flex flex-col gap-4 overflow-hidden ">
          {Array.from({ length: 8 }, (_, i) => (
            <BaseSkeleton className="h-13" key={i} />
          ))}
        </div>
      </div>
      <div className="flex-1 flex flex-col gap-6">
        <BaseSkeleton className="h-8" />
        <BaseSkeleton className="flex-1" />
      </div>
    </div>
  );
};

// const Worker = ({ data }: { data: Worker }) => {
//   return (
//     <CustomCard
//       variant={"list"}
//       size={"sm"}
//       className="flex-row justify-between items-center"
//     >
//       <div className="flex gap-6">
//         <span className="text-sm">{data.userName}</span>
//         <span className="text-sm">{data.phone}</span>
//       </div>
//       <span className="text-sm text-blue-500">{data.serviceTypeName}</span>
//     </CustomCard>
//   );
// };
