"use client";
import IconButton from "@/components/common/icon-button";
import CommonPagination from "@/components/ui/custom/pagination/common-pagination";
import { useWorkplaceListStore } from "@/store/admin/workplace/workplace-list-store";
import { useRouter } from "next/navigation";

import React from "react";

const WorkplacePagination = () => {
  const { workplaceList } = useWorkplaceListStore();
  const router = useRouter();
  return (
    <>
      {workplaceList.type === "data" ? (
        <div className="flex gap-4">
          <CommonPagination totalCount={workplaceList.meta.totalCount} />
          <IconButton
            icon={"Plus"}
            onClick={() => router.push("workplace/add")}
          />
        </div>
      ) : null}
    </>
  );
};

export default WorkplacePagination;
