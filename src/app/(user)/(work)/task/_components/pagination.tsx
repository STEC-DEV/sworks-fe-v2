import BaseSkeleton from "@/components/common/base-skeleton";
import IconButton from "@/components/common/icon-button";
import CommonPagination from "@/components/ui/custom/pagination/common-pagination";
import { useUIStore } from "@/store/common/ui-store";
import { useTaskStore } from "@/store/normal/task/task-store";
import Link from "next/link";
import React from "react";

const TaskPagination = () => {
  const { taskList, loadingKeys } = useTaskStore();
  const { isLoading, hasError } = useUIStore();

  if (isLoading(loadingKeys.LIST) || !taskList)
    return <BaseSkeleton className="h-9" />;
  if (hasError(loadingKeys.LIST)) return <div>에러발생</div>;

  return (
    <CommonPagination totalCount={taskList.meta.totalCount}>
      <Link href={"/task/add"}>
        <IconButton icon="Plus" />
      </Link>
    </CommonPagination>
  );
};

export default TaskPagination;
