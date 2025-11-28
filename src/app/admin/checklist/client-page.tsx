"use client";
import React, { useEffect } from "react";
import ChecklistFilter from "./_components/checklist-filter";
import { useChecklistStore } from "@/store/admin/checklist/checklist-store";
import ChecklistPagination from "./_components/checklist-pagination";

import { checklistCol } from "./_components/table-columns";
import BaseSkeleton from "@/components/common/base-skeleton";
import { useRouter, useSearchParams } from "next/navigation";
import BaseTable from "@/components/common/base-table";
import { useUIStore } from "@/store/common/ui-store";

const ClientPage = () => {
  const searchParams = useSearchParams();
  const { commonChecklist, getCommonChecklist, loadingKeys } =
    useChecklistStore();
  const { isLoading, hasError } = useUIStore();

  const router = useRouter();

  useEffect(() => {
    getCommonChecklist();
  }, [searchParams]);

  const getList = () => {
    if (isLoading(loadingKeys.LIST) || !commonChecklist)
      return <BaseSkeleton />;
    if (hasError(loadingKeys.LIST)) return <div>에러 발생</div>;

    return (
      <BaseTable
        columns={checklistCol}
        data={commonChecklist.data}
        onRowClick={(data) => {
          router.push(`/admin/checklist/${data.chkSeq}`);
        }}
      />
    );
  };

  return (
    <>
      <ChecklistFilter />
      <ChecklistPagination />
      {getList()}
    </>
  );
};

export default ClientPage;
