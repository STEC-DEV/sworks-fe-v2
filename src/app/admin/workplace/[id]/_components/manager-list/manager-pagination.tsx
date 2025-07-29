import IconButton from "@/components/common/icon-button";
import CommonPagination from "@/components/ui/custom/pagination/common-pagination";
import { useWorkplaceDetailStore } from "@/store/admin/workplace/workplace-detail-store";
import React from "react";

const ManagerPagination = () => {
  const { managers } = useWorkplaceDetailStore();
  return (
    <>
      {managers.type === "data" ? (
        <div className="flex gap-4">
          <CommonPagination totalCount={managers.meta.totalCount} />
          <IconButton icon="SquarePen" />
        </div>
      ) : null}
    </>
  );
};

export default ManagerPagination;
