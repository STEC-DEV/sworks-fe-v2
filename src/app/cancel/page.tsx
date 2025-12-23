"use client";
import BaseTable from "@/components/common/base-table";
import AppTitle from "@/components/common/label/title";
import CommonFilter from "@/components/ui/custom/filter.tsx/common-filter";
import CommonPagination from "@/components/ui/custom/pagination/common-pagination";
import { AdminListItem } from "@/types/admin/admin/user-list";
import { Response } from "@/types/common/response";
import { ListData } from "@/types/list-type";
import { UserListItem } from "@/types/normal/user/list";
import { paramsCheck } from "@/utils/param";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { userColumns as adminColumns } from "../admin/user/components/user-columns";
import { userColumns } from "../(user)/workplace/_components/_user/user-column";

const Page = () => {
  const [userType, setUserType] = useState<"ADMIN" | "USER">("ADMIN");
  const searchParams = useSearchParams();
  const [adminList, setAdminList] = useState<ListData<AdminListItem> | null>(
    null
  );
  const [userList, setUserList] = useState<ListData<UserListItem> | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  useEffect(() => {
    const checkParams = paramsCheck(new URLSearchParams(searchParams));

    const fetchAdmins = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/adminuser/w/adminlistsample?${checkParams}`,
          {
            method: "GET",
          }
        );
        const data: Response<ListData<AdminListItem>> = await res.json();
        setAdminList(data.data);
        console.log("관리자");
        console.log(data);
      } catch (err) {
        console.error(err);
      }
    };

    const fetchUsers = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/user/w/userlistsample?${checkParams}`,
          { method: "GET" }
        );
        const data: Response<ListData<UserListItem>> = await res.json();
        setUserList(data.data);
        console.log("사용자");

        console.log(data);
      } catch (err) {
        console.error(err);
      }
    };
    switch (userType) {
      case "ADMIN":
        fetchAdmins();
        break;
      case "USER":
        fetchUsers();
        break;
    }
  }, [userType, searchParams]);

  const onTypeChange = (type: "ADMIN" | "USER") => {
    setUserType(type);
    router.push(pathname);
  };

  return (
    <div className="flex justify-center w-full h-full ">
      <div className="flex flex-col gap-6 w-full px-6 xl:w-[60vw] xl:px-0 py-6 ">
        <div className="flex items-center justify-between">
          <AppTitle title="사용자 관리" />
          <div className="flex items-center">
            <div
              className={`px-4 py-1 text-sm rounded-[4px] ${
                userType === "ADMIN"
                  ? "bg-blue-500 text-white"
                  : "text-[var(--description-light)]"
              } duration-150 cursor-pointer`}
              onClick={() => onTypeChange("ADMIN")}
            >
              시스템
            </div>
            <div
              className={`px-4 py-1 text-sm rounded-[4px] ${
                userType === "USER"
                  ? "bg-blue-500 text-white"
                  : "text-[var(--description-light)]"
              }  duration-150 cursor-pointer`}
              onClick={() => onTypeChange("USER")}
            >
              사업장
            </div>
          </div>
        </div>

        <CommonFilter />
        <CommonPagination
          totalCount={
            userType === "ADMIN"
              ? adminList?.meta?.totalCount ?? 0
              : userList?.meta?.totalCount ?? 0
          }
        />
        {userType === "ADMIN" ? (
          <BaseTable
            columns={adminColumns}
            data={adminList?.data ?? []}
            onRowClick={(data) => router.push(`/cancel/admin/${data.userSeq}`)}
          />
        ) : (
          <BaseTable
            columns={userColumns}
            data={userList?.data ?? []}
            onRowClick={(data) => router.push(`/cancel/user/${data.userSeq}`)}
          />
        )}
      </div>
    </div>
  );
};

export default Page;
