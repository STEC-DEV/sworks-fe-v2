"use client";

import React, { useEffect } from "react";
import WorkplacePagination from "./components/workplace-pagination";
import WorkplaceCard from "./components/workplace-card";
import { useWorkplaceListStore } from "@/store/admin/workplace/workplace-list-store";
import WorkplaceFilter from "./components/workplace-filter";
import { useSearchParams } from "next/navigation";

const ClientPage = () => {
  const searchParams = useSearchParams();
  const { workplaceList, getWorkplaceList } = useWorkplaceListStore();
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
        {workplaceList.type === "data"
          ? workplaceList.data.map((w, i) => <WorkplaceCard key={i} item={w} />)
          : null}
      </div>
    </>
  );
};

export default ClientPage;
