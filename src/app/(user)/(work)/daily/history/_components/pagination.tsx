import BaseSkeleton from "@/components/common/base-skeleton";
import CommonPagination from "@/components/ui/custom/pagination/common-pagination";
import { useUIStore } from "@/store/common/ui-store";
import { useTaskHistoryStore } from "@/store/normal/task/task-history-store";
import React from "react";

const TaskHistoryPagination = () => {
  const { taskHistoryList, loadingKeys } = useTaskHistoryStore();
  const { isLoading, hasError } = useUIStore();

  if (isLoading(loadingKeys.LIST) || !taskHistoryList)
    return <BaseSkeleton className="h-9" />;
  if (hasError(loadingKeys.LIST)) return <div>에러발생</div>;

  return <CommonPagination totalCount={taskHistoryList.meta.totalCount} />;
};

export default TaskHistoryPagination;
