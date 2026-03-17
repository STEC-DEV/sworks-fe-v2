"use client";
import BaseSkeleton from "@/components/common/base-skeleton";
import Button from "@/components/common/button";
import IconButton from "@/components/common/icon-button";
import CommonPagination from "@/components/ui/custom/pagination/common-pagination";
import { usePermission } from "@/hooks/usePermission";
import { useAdminListStore } from "@/store/admin/admin/admin-list-store";
import { useUIStore } from "@/store/common/ui-store";
import { PlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";

import React from "react";

const AdminPagination = () => {
  const { canEdit } = usePermission();
  const { adminList, loadingKeys } = useAdminListStore();
  const { isLoading, hasError } = useUIStore();
  const router = useRouter();

  if (isLoading(loadingKeys.LIST) || !adminList)
    return <BaseSkeleton className="h-9" />;
  if (hasError(loadingKeys.LIST)) return <div>에러 발생</div>;
  return (
    <CommonPagination totalCount={adminList.meta.totalCount}>
      {canEdit && (
        <Button
          label="관리자 생성"
          icon={<PlusIcon />}
          onClick={() => router.push("user/add")}
        />
      )}
    </CommonPagination>
  );
};

export default AdminPagination;
