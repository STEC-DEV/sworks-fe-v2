"use client";
import BaseSkeleton from "@/components/common/base-skeleton";

import { useTaskStore } from "@/store/normal/task/task-store";
import React, { useState } from "react";
import { taskCol } from "./columns";
import BaseTable from "@/components/common/base-table";
import { useRouter } from "next/navigation";
import { useUIStore } from "@/store/common/ui-store";

interface TaskListProps {
  // selectedTasks: Task[];
  onSelectionChange: (tasks: Task[]) => void;
}

const TaskList = ({ onSelectionChange }: TaskListProps) => {
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
      enableRowSelection={true} // 이걸 true로 해야 선택 기능 동작
      getRowId={(row) => row.taskSeq.toString()}
      onSelectionChange={onSelectionChange}
    />
  );
};

export default TaskList;
