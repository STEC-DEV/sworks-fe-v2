"use client";
import BaseSkeleton from "@/components/common/base-skeleton";

import CommonPagination from "@/components/ui/custom/pagination/common-pagination";
import { useChecklistStore } from "@/store/admin/checklist/checklist-store";
import { useUIStore } from "@/store/common/ui-store";

import React from "react";

const ChecklistPagination = () => {
  const { commonChecklist, loadingKeys } = useChecklistStore();
  const { isLoading, hasError } = useUIStore();

  if (isLoading(loadingKeys.LIST) || !commonChecklist)
    return <BaseSkeleton className="h-9" />;
  if (hasError(loadingKeys.LIST)) return <div>에러발생</div>;

  return <CommonPagination totalCount={commonChecklist.meta.totalCount} />;
};

export default ChecklistPagination;
