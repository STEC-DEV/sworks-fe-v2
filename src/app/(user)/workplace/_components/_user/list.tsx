"use client";
import BaseSkeleton from "@/components/common/base-skeleton";
import BaseTable from "@/components/common/base-table";
import CustomCard from "@/components/common/card";
import EmptyBox from "@/components/ui/custom/empty";
import { useUserMainStore } from "@/store/normal/user/main-store";
import { useRouter, useSearchParams } from "next/navigation";
import React, { Suspense, useCallback, useEffect } from "react";
import { userColumns } from "./user-column";
import { useUIStore } from "@/store/common/ui-store";
import { UserListItem } from "@/types/normal/user/list";

const UserList = () => {
  const router = useRouter();
  const { userList, getUserList, loadingKeys } = useUserMainStore();
  const { isLoading, hasError } = useUIStore();
  const searchParams = useSearchParams();

  const fetchData = useCallback(() => {
    if (!searchParams) return;
    getUserList(new URLSearchParams(searchParams));
  }, [searchParams]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (isLoading(loadingKeys.LIST) || !userList)
    return <BaseSkeleton className="flex-1" />;
  if (hasError(loadingKeys.LIST)) return <div>에러 발생</div>;

  return (
    <BaseTable
      padding="py-3"
      columns={userColumns}
      data={userList.data}
      onRowClick={(data) => router.push(`/workplace/user/${data.userSeq}`)}
    />
  );
};

const UserListCard = ({ data }: { data: UserListItem }) => {
  return (
    <CustomCard
      className="flex-row px-4 py-2  items-center hover:border-blue-500 hover:bg-blue-50"
      variant={"list"}
    >
      <div className="flex flex-col  min-w-20">
        <span className="text-sm">{data.userName}</span>
        <span className="text-xs text-[var(--description-light)]">
          {data.role}
        </span>
      </div>
      <div className="flex-1">
        <span className="text-xs text-[var(--description-dark)]">
          {data.phone}
        </span>
      </div>

      {data.serviceTypes?.map((v, i) => (
        <span key={i} className="text-sm text-blue-500">
          {v.userServiceTypeName}
        </span>
      ))}
      <span></span>
    </CustomCard>
  );
};

export default UserList;
