"use client";

import React, { useEffect } from "react";
import ManagerFilter from "./manager-filter";
import ManagerPagination from "./manager-pagination";

import AppTitle from "@/components/common/label/title";
import { useRouter, useSearchParams } from "next/navigation";

import BaseTable from "@/components/common/base-table";
import { userColumns } from "@/app/admin/user/components/user-columns";
import BaseSkeleton from "@/components/common/base-skeleton";
import { useWorkplaceManagerStore } from "@/store/admin/workplace/manager-store";
import { useUIStore } from "@/store/common/ui-store";
import { useDecodeParam } from "@/hooks/params";

const ManagerList = () => {
  const router = useRouter();
  const { managers, getManagers, loadingKeys } = useWorkplaceManagerStore();
  const { rawValue: id } = useDecodeParam("id");
  const { isLoading, hasError } = useUIStore();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!id && !searchParams) return;
    getManagers(id, new URLSearchParams(searchParams));
  }, [searchParams, id]);

  const getList = () => {
    if (isLoading(loadingKeys.MANAGER) || !managers) return <BaseSkeleton />;
    if (hasError(loadingKeys.MANAGER)) return <div>에러 발생</div>;

    return (
      <BaseTable
        padding="py-3"
        columns={userColumns}
        data={managers.data}
        onRowClick={(data) => router.push(`/admin/user/${data.userSeq}`)}
      />
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <AppTitle title="담당 관리자" />
      <ManagerFilter />
      <ManagerPagination />
      {getList()}
    </div>
  );
};

export default ManagerList;
