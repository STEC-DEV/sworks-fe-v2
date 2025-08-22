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

  return (
    <>
      {userList.type === "data" ? (
        <div className="flex gap-4">
          <CommonPagination totalCount={userList.meta.totalCount} />
          <IconButton
            icon={"Plus"}
            onClick={() => router.push("/workplace/add-user")}
          />
        </div>
      ) : (
        <BaseSkeleton className="h-10" />
      )}
    </>
  );
};

export default UserPagination;
