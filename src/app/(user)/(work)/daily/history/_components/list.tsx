import BaseSkeleton from "@/components/common/base-skeleton";
import DataTable from "@/components/common/data-table";
import { useTaskHistoryStore } from "@/store/normal/task/task-history-store";
import React from "react";
import { taskHistoryCol } from "./columns";
import BaseTable from "@/components/common/base-table";
import { useRouter } from "next/navigation";
import { useUIStore } from "@/store/common/ui-store";

const TaskHistoryList = () => {
  const { taskHistoryList, loadingKeys } = useTaskHistoryStore();
  const { isLoading, hasError } = useUIStore();
  const router = useRouter();

  if (isLoading(loadingKeys.LIST) || !taskHistoryList)
    return <BaseSkeleton className="flex-1" />;
  if (hasError(loadingKeys.LIST)) return <div>에러발생</div>;

  return (
    <BaseTable
      columns={taskHistoryCol}
      data={taskHistoryList.data}
      onRowClick={(data) => router.push(`/daily/history/${data.historySeq}`)}
    />
  );
};

export default TaskHistoryList;
