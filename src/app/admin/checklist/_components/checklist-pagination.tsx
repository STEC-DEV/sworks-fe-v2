"use client";
import IconButton from "@/components/common/icon-button";
import CommonPagination from "@/components/ui/custom/pagination/common-pagination";
import { useChecklistStore } from "@/store/admin/checklist/checklist-store";

import { useRouter } from "next/navigation";

import React from "react";

const ChecklistPagination = () => {
  const { commonChecklist } = useChecklistStore();

  return (
    <>
      {commonChecklist.type === "data" ? (
        <div className="flex gap-4">
          <CommonPagination totalCount={commonChecklist.meta.totalCount} />
        </div>
      ) : null}
    </>
  );
};

export default ChecklistPagination;
