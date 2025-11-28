"use client";

import React, { useEffect } from "react";
import WorkplacePagination from "./components/workplace-pagination";

import { useWorkplaceListStore } from "@/store/admin/workplace/workplace-list-store";
import WorkplaceFilter from "./components/workplace-filter";
import { useRouter, useSearchParams } from "next/navigation";
import BaseSkeleton from "@/components/common/base-skeleton";

import { workplaceColumns } from "./components/workplace-colums";
import BaseTable from "../../../components/common/base-table";
import { useUIStore } from "@/store/common/ui-store";

const ClientPage = () => {
  const searchParams = useSearchParams();
  const { isLoading, hasError } = useUIStore();
  const { workplaceList, getWorkplaceList, loadingKeys } =
    useWorkplaceListStore();
  const router = useRouter();
  useEffect(() => {
    getWorkplaceList();
  }, []);
  useEffect(() => {
    getWorkplaceList();
  }, [searchParams]);

  const getList = () => {
    const loadingKey = loadingKeys.LIST;
    if (isLoading(loadingKey) || !workplaceList)
      return <BaseSkeleton className="h-full" />;
    if (hasError(loadingKey)) return <div>에러발생</div>;

    return (
      <BaseTable
        columns={workplaceColumns}
        data={workplaceList.data}
        onRowClick={(data) => {
          router.push(`/admin/workplace/${data.siteSeq}`);
        }}
      />
    );
  };

  return (
    <>
      <WorkplaceFilter />
      <WorkplacePagination />
      <div className="flex flex-col gap-2 h-full">{getList()}</div>
    </>
  );
};

export default ClientPage;

// const getList = () => {
//   if (workplaceList.type === "loading") return <BaseSkeleton />;
//   if (workplaceList.type === "error") return <BaseSkeleton />;
//   // return workplaceList.payload.data.map((w, i) => (
//   //   <WorkplaceCardWrapper key={i} item={w} />
//   // ));
//   return (
//     <BaseTable
//       columns={workplaceColumns}
//       data={workplaceList.payload.data}
//       onRowClick={(data) => {
//         router.push(`/admin/workplace/${data.siteSeq}`);
//       }}
//     />
//   );
// };
