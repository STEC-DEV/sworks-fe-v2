"use client";
import React, { useEffect } from "react";
import ChecklistFilter from "./_components/checklist-filter";
import { useChecklistStore } from "@/store/admin/checklist/checklist-store";
import ChecklistPagination from "./_components/checklist-pagination";
import DataTable from "@/components/common/data-table";
import { checklistCol } from "./_components/table-columns";
import BaseSkeleton from "@/components/common/base-skeleton";
import { useRouter, useSearchParams } from "next/navigation";

const ClientPage = () => {
  const searchParams = useSearchParams();
  const { commonChecklist, getCommonChecklist } = useChecklistStore();
  const router = useRouter();

  useEffect(() => {
    getCommonChecklist();
  }, []);

  useEffect(() => {
    getCommonChecklist();
  }, [searchParams]);
  return (
    <>
      <ChecklistFilter />
      <ChecklistPagination />
      {commonChecklist.type === "data" ? (
        <DataTable
          columns={checklistCol}
          data={commonChecklist.data}
          idName={"chkSeq"}
          baseUrl={"checklist"}
          emptyMessage=""
        />
      ) : (
        <BaseSkeleton className="w-full h-full" />
      )}
    </>
  );
};

export default ClientPage;
