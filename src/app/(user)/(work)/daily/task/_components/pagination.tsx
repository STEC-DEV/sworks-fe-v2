import BaseSkeleton from "@/components/common/base-skeleton";
import CheckDialog from "@/components/common/check-dialog";
import IconButton from "@/components/common/icon-button";
import CommonPagination from "@/components/ui/custom/pagination/common-pagination";
import { useUIStore } from "@/store/common/ui-store";
import { useTaskStore } from "@/store/normal/task/task-store";
import Link from "next/link";
import React from "react";
import { dialogText } from "../../../../../../../public/text";
import Button from "@/components/common/button";
import { PlusIcon } from "lucide-react";

interface TaskPaginationProps {
  onDelete: () => void;
}

const TaskPagination = ({ onDelete }: TaskPaginationProps) => {
  const { taskList, loadingKeys } = useTaskStore();
  const { isLoading, hasError } = useUIStore();

  if (isLoading(loadingKeys.LIST) || !taskList)
    return <BaseSkeleton className="h-9" />;
  if (hasError(loadingKeys.LIST)) return <div>에러발생</div>;

  return (
    <CommonPagination totalCount={taskList.meta.totalCount}>
      <Link href={"/daily/task/add"} className="flex items-center">
        <Button label="업무 생성" icon={<PlusIcon />} size={"sm"} />
      </Link>
      <CheckDialog
        title={dialogText.defaultDelete.title}
        description={dialogText.defaultDelete.description}
        actionLabel={dialogText.defaultDelete.actionLabel}
        onClick={onDelete}
      >
        <IconButton
          icon="Trash2"
          bgClassName="border border-border-strong shadow-sm bg-surface !rounded-DEFAULT hover:border-destructive hover:bg-red-50"
          className="text-destructive"
        />
      </CheckDialog>
    </CommonPagination>
  );
};

export default TaskPagination;
