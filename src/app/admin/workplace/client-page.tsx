"use client";

import React, { useEffect } from "react";
import WorkplacePagination from "./components/workplace-pagination";
import { mockWorkplaceList } from "@/types/admin/workplace/workplace-list";
import WorkplaceCard from "./components/workplace-card";
import { useWorkplaceListStore } from "@/store/admin/workplace/workplace-list-store";
import WorkplaceFilter from "./components/workplace-filter";
import { useSearchParams } from "next/navigation";

const ClientPage = () => {
  const searchParams = useSearchParams();
  const { getWorkplaceList } = useWorkplaceListStore();
  useEffect(() => {
    getWorkplaceList();
  }, []);
  useEffect(() => {
    getWorkplaceList();
  }, [searchParams]);

  return (
    <>
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

export default ClientPage;
