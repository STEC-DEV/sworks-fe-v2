import BaseSkeleton from "@/components/common/base-skeleton";
import IconButton from "@/components/common/icon-button";
import CommonPagination from "@/components/ui/custom/pagination/common-pagination";
import { useTaskStore } from "@/store/normal/task/task-store";
import Link from "next/link";
import React from "react";

const TaskPagination = () => {
  const { taskList } = useTaskStore();

  if (taskList.type === "loading") {
    return <BaseSkeleton className="h-9" />;
  }

  if (taskList.type === "error") {
    return <BaseSkeleton className="h-9" />;
  }

  return (
    <div className="flex gap-4 items-center">
      <CommonPagination totalCount={taskList.payload.meta.totalCount} />
      <div>
        <Link href={"/daily/task/add"}>
          <IconButton icon="Plus" />
        </Link>
      </div>
    </div>
  );
};

export default TaskPagination;
