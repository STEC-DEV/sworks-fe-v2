"use client";
import BaseSkeleton from "@/components/common/base-skeleton";
import CustomCard from "@/components/common/card";
import { useUserMainStore } from "@/store/normal/user/main-store";
import { useSearchParams } from "next/navigation";
import React, { useCallback, useEffect } from "react";

const UserList = () => {
  const { userList, getUserList } = useUserMainStore();
  const searchParams = useSearchParams();

  const fetchData = useCallback(() => {
    if (!searchParams) return;
    getUserList(new URLSearchParams(searchParams));
  }, [searchParams]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <>
      {userList.type === "data" ? (
        <div className="flex flex-col gap-2">
          {userList.data.map((v, i) => (
            <UserListCard key={i} data={v} />
          ))}
        </div>
      ) : (
        <BaseSkeleton className="h-200" />
      )}
    </>
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
