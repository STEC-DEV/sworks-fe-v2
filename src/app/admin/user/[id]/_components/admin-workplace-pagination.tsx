"use client";
import IconButton from "@/components/common/icon-button";
import CommonPagination from "@/components/ui/custom/pagination/common-pagination";
import { useAdminDetailStore } from "@/store/admin/admin/admin-detail";
import React from "react";

const AdminWorkplacePagination = () => {
  const { adminWorkplaceList } = useAdminDetailStore();

  return (
    <>
      {adminWorkplaceList.type === "data" ? (
        <div className="flex gap-4">
          <CommonPagination totalCount={adminWorkplaceList.meta.totalCount} />
          <IconButton icon={"SquarePen"} />
        </div>
      ) : null}
    </>
  );
};

export default AdminWorkplacePagination;
