import BaseSkeleton from "@/components/common/base-skeleton";
import CommonPagination from "@/components/ui/custom/pagination/common-pagination";
import { useTaskHistoryStore } from "@/store/normal/task/task-history-sotre";
import React from "react";

const TaskHistoryPagination = () => {
  const { taskHistoryList } = useTaskHistoryStore();

  if (taskHistoryList.type === "loading") {
    return <BaseSkeleton className="h-9" />;
  }

  if (taskHistoryList.type === "error") {
    return <BaseSkeleton className="h-9" />;
  }

  return (
    <CommonPagination totalCount={taskHistoryList.payload.meta.totalCount} />
  );
};

export default TaskHistoryPagination;
