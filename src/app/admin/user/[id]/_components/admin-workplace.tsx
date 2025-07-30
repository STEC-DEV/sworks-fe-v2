"use client";
import WorkplacePagination from "@/app/admin/workplace/components/workplace-pagination";
import React, { useEffect } from "react";
import AdminWorkplaceFilter from "./filter";
import AdminWorkplacePagination from "./admin-workplace-pagination";
import AppTitle from "@/components/common/label/title";
import { useAdminDetailStore } from "@/store/admin/admin/admin-detail";
import { useParams, useSearchParams } from "next/navigation";
import WorkplaceCard from "@/app/admin/workplace/components/workplace-card";

const AdminWorkplaceList = () => {
  const { adminWorkplaceList, getAdminWorkplaceList } = useAdminDetailStore();
  const searchParams = useSearchParams();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    getAdminWorkplaceList(new URLSearchParams(searchParams), id);
  }, []);

  useEffect(() => {
    getAdminWorkplaceList(new URLSearchParams(searchParams), id);
  }, [searchParams]);

  return (
    <div className="w-full flex flex-col gap-6">
      <AppTitle title="담당 사업장" />
      <AdminWorkplaceFilter />
      <AdminWorkplacePagination />
      <div className="flex flex-col gap-2">
        {adminWorkplaceList.type === "data"
          ? adminWorkplaceList.data.map((w, i) => (
              <WorkplaceCard key={i} item={w} />
            ))
          : null}
      </div>
    </div>
  );
};

export default AdminWorkplaceList;
