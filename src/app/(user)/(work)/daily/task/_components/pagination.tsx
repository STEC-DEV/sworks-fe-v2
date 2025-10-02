import IconButton from "@/components/common/icon-button";
import CommonPagination from "@/components/ui/custom/pagination/common-pagination";
import React from "react";

const TaskPagination = () => {
  return (
    <div className="flex gap-4 items-center">
      <CommonPagination totalCount={20} />
      <div>
        <IconButton icon="Plus" />
      </div>
    </div>
  );
};

export default TaskPagination;
