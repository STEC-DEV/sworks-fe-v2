"use client";
import IconButton from "@/components/common/icon-button";
import CommonPagination from "@/components/ui/custom/pagination/common-pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdminListStore } from "@/store/admin/admin/admin-list-store";
import { useRouter } from "next/navigation";

import React from "react";

const AdminPagination = () => {
  const { adminList } = useAdminListStore();
  const router = useRouter();
  return (
    <>
      {adminList.type === "data" ? (
        <div className="flex gap-4">
          <CommonPagination totalCount={adminList.meta.totalCount} />
          <IconButton icon={"Plus"} onClick={() => router.push("user/add")} />
        </div>
      ) : (
        <Skeleton className="w-full h-10 bg-[var(--skeleton)] rounded-[4px]" />
      )}
    </>
  );
};

export default AdminPagination;
