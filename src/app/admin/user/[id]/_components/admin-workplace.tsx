"use client";

import React, { useEffect } from "react";
import AdminWorkplaceFilter from "./filter";
import AdminWorkplacePagination from "./admin-workplace-pagination";
import AppTitle from "@/components/common/label/title";
import { useAdminDetailStore } from "@/store/admin/admin/admin-detail";
import { useRouter, useSearchParams } from "next/navigation";

import BaseSkeleton from "@/components/common/base-skeleton";

import { workplaceColumns } from "@/app/admin/workplace/components/workplace-colums";
import BaseTable from "@/components/common/base-table";
import { useDecodeParam } from "@/hooks/params";
import { useUIStore } from "@/store/common/ui-store";

const AdminWorkplaceList = () => {
  const router = useRouter();
  const { adminWorkplaceList, getAdminWorkplaceList, loadingKeys } =
    useAdminDetailStore();
  const { isLoading, hasError } = useUIStore();
  const searchParams = useSearchParams();
  const { rawValue: id } = useDecodeParam("id");

  useEffect(() => {
    getAdminWorkplaceList(new URLSearchParams(searchParams), id);
  }, [searchParams, id]);

  const dataList = () => {
    if (isLoading(loadingKeys.WORKPLACE) || !adminWorkplaceList) {
      return <BaseSkeleton />;
    }
    if (hasError(loadingKeys.WORKPLACE)) {
      return <div>에러 발생</div>;
    }

    return (
      <BaseTable
        columns={workplaceColumns}
        data={adminWorkplaceList.data}
        onRowClick={(data) => router.push(`/admin/workplace/${data.siteSeq}`)}
      />
    );
  };

  return (
    <div className="w-full flex flex-col gap-4">
      <AppTitle title="담당 사업장" />
      <AdminWorkplaceFilter />
      <AdminWorkplacePagination />
      {dataList()}
    </div>
  );
};

export default AdminWorkplaceList;
