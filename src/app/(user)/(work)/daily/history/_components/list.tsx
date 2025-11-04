import BaseSkeleton from "@/components/common/base-skeleton";
import DataTable from "@/components/common/data-table";
import { useTaskHistoryStore } from "@/store/normal/task/task-history-sotre";
import React from "react";
import { taskHistoryCol } from "./columns";

const TaskHistoryList = () => {
  const { taskHistoryList } = useTaskHistoryStore();

  if (taskHistoryList.type === "loading")
    return <BaseSkeleton className="h-9" />;
  if (taskHistoryList.type === "error") return;

  return (
    <DataTable
      columns={taskHistoryCol}
      data={taskHistoryList.payload.data}
      idName="historySeq"
      baseUrl="history"
    />
  );
};

export default TaskHistoryList;
