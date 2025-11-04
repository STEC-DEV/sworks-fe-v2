"use client";
import BaseSkeleton from "@/components/common/base-skeleton";
import IconButton from "@/components/common/icon-button";
import CommonPagination from "@/components/ui/custom/pagination/common-pagination";
import { useUserMainStore } from "@/store/normal/user/main-store";
import { useRouter } from "next/navigation";
import React from "react";

const UserPagination = () => {
  const { userList } = useUserMainStore();
  const router = useRouter();

  if (userList.type === "loading") return <BaseSkeleton className="h-9" />;
  if (userList.type === "error") return <BaseSkeleton className="h-9" />;

  return (
    <div className="flex gap-4">
      <CommonPagination totalCount={userList.payload.meta.totalCount} />
      <IconButton
        icon={"Plus"}
        onClick={() => router.push("/workplace/add-user")}
      />
    </div>
  );
};

export default UserPagination;
