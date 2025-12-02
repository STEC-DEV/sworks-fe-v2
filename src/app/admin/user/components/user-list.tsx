"use client";

import { useAdminListStore } from "@/store/admin/admin/admin-list-store";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect } from "react";

import BaseSkeleton from "@/components/common/base-skeleton";
import BaseTable from "@/components/common/base-table";
import { userColumns } from "./user-columns";
import { useUIStore } from "@/store/common/ui-store";

const AdminList = () => {
  const { adminList, getAdminList, loadingKeys } = useAdminListStore();
  const { isLoading, hasError } = useUIStore();
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    getAdminList(new URLSearchParams(searchParams));
  }, [searchParams]);

  if (isLoading(loadingKeys.LIST) || !adminList) return <BaseSkeleton />;
  if (hasError(loadingKeys.LIST)) return <div>에러 발생</div>;

  return (
    <BaseTable
      padding="py-3"
      columns={userColumns}
      data={adminList.data}
      onRowClick={(data) => router.push(`/admin/user/${data.userSeq}`)}
    />
  );
};

export default AdminList;
