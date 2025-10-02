import BaseSkeleton from "@/components/common/base-skeleton";
import DataTable from "@/components/common/data-table";
import { useTaskStore } from "@/store/normal/task/task-store";
import React from "react";
import { taskCol } from "./columns";

const TaskList = () => {
  const { taskList } = useTaskStore();

  if (taskList.type === "loading") return <BaseSkeleton />;
  if (taskList.type === "error") return;

  return (
    <DataTable
      columns={taskCol}
      data={taskList.payload.data}
      idName="taskSeq"
      baseUrl="task"
    />
  );
};

export default TaskList;
