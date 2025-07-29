"use client";

import React, { useEffect } from "react";
import ManagerFilter from "./manager-filter";
import ManagerPagination from "./manager-pagination";
import { useWorkplaceDetailStore } from "@/store/admin/workplace/workplace-detail-store";
import UserCard from "@/app/admin/user/components/user-card";
import { Skeleton } from "@/components/ui/skeleton";

const ManagerList = () => {
  const { managers, getManagers } = useWorkplaceDetailStore();
  useEffect(() => {
    getManagers();
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <span className="text-sm">담당 관리자</span>
      </div>
      {managers.type === "data" ? (
        <>
          <ManagerFilter />
          <ManagerPagination />
          <div className="flex flex-col gap-2">
            {managers.data.map((w, i) => (
              <UserCard key={i} item={w} />
            ))}
          </div>
        </>
      ) : (
        <div className="flex flex-col gap-6 w-full h-full">
          <Skeleton className="w-full h-12 rounded-[4px] bg-[var(--background)]" />
          <Skeleton className="w-full h-12 rounded-[4px] bg-[var(--background)]" />
          <Skeleton className="w-full h-32 rounded-[4px] bg-[var(--background)]" />
        </div>
      )}
    </div>
  );
};

export default ManagerList;
