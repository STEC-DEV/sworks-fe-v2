"use client";
import BaseSkeleton from "@/components/common/base-skeleton";

import { useTaskStore } from "@/store/normal/task/task-store";
import React from "react";
import { taskCol } from "./columns";
import BaseTable from "@/components/common/base-table";
import { useRouter } from "next/navigation";
import { useUIStore } from "@/store/common/ui-store";

const TaskList = () => {
  const router = useRouter();
  const { taskList, loadingKeys } = useTaskStore();
  const { isLoading, hasError } = useUIStore();

  if (isLoading(loadingKeys.LIST) || !taskList)
    return <BaseSkeleton className="flex-1" />;
  if (hasError(loadingKeys.LIST)) return <div>에러발생</div>;

  return (
    <BaseTable
      columns={taskCol}
      data={taskList.data}
      onRowClick={(data) => router.push(`/daily/task/${data.taskSeq}`)}
    />
  );
};

export default TaskList;
