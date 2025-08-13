"use client";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdminListStore } from "@/store/admin/admin/admin-list-store";
import { useSearchParams } from "next/navigation";
import React, { useEffect } from "react";
import AdminCard from "./user-card";

const AdminList = () => {
  const { adminList, getAdminList } = useAdminListStore();
  const searchParams = useSearchParams();
  useEffect(() => {
    getAdminList(new URLSearchParams(searchParams));
  }, []);

  useEffect(() => {
    getAdminList(new URLSearchParams(searchParams));
  }, [searchParams]);

  return (
    <>
      {adminList.type === "data" ? (
        <div className="flex flex-col gap-2 flex-1">
          {adminList.data.map((a, i) => (
            <AdminCard key={i} item={a} link />
          ))}
        </div>
      ) : (
        <Skeleton className="w-full flex-1 bg-[var(--skeleton)] rounded-[4px]" />
      )}
    </>
  );
};

export default AdminList;
