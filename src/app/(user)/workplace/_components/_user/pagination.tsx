"use client";
import BaseSkeleton from "@/components/common/base-skeleton";
import IconButton from "@/components/common/icon-button";
import CommonPagination from "@/components/ui/custom/pagination/common-pagination";
import { usePermission } from "@/hooks/usePermission";
import { useUIStore } from "@/store/common/ui-store";
import { useUserMainStore } from "@/store/normal/user/main-store";
import { useRouter } from "next/navigation";
import React from "react";

const UserPagination = () => {
  const { userList, loadingKeys } = useUserMainStore();
  const { isLoading, hasError } = useUIStore();
  const { canWorkerEdit } = usePermission();
  const router = useRouter();

  if (isLoading(loadingKeys.LIST) || !userList)
    return <BaseSkeleton className="h-9" />;
  if (hasError(loadingKeys.LIST)) return <div>에러발생</div>;

  return (
    <div className="flex gap-4">
      <CommonPagination totalCount={userList.meta.totalCount}>
        {canWorkerEdit && (
          <IconButton
            icon={"Plus"}
            onClick={() => router.push("/workplace/add-user")}
          />
        )}
      </CommonPagination>
    </div>
  );
};

export default UserPagination;
