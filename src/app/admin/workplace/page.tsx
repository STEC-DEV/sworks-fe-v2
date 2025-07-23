"use client";
import { mockWorkplaceList } from "@/types/admin/workplace/workplace-list";
import React, { useEffect } from "react";
import WorkplaceCard from "./components/workplace-card";
import AppTitle from "@/components/common/label/title";
import WorkplaceFilter from "./components/workplace-filter";
import WorkplacePagination from "./components/workplace-pagination";
import { useWorkplaceListStore } from "@/store/admin/workplace/workplace-list-store";

const Page = () => {
  const { getWorkplaceList } = useWorkplaceListStore();
  useEffect(() => {
    getWorkplaceList();
  }, []);
  return (
    <>
      <AppTitle title="사업장" />
      <WorkplaceFilter />
      <WorkplacePagination />
      <div className="flex flex-col gap-2">
        {mockWorkplaceList.map((w, i) => (
          <WorkplaceCard key={i} item={w} />
        ))}
      </div>
    </>
  );
};

export default Page;
