"use client";

import Pagination from "@/components/ui/custom/pagination/pagination";
import ViewSelect from "@/components/ui/custom/pagination/view-select";
import { usePagination } from "@/hooks/filter/usePagination";
import React from "react";

interface CommonPaginationProps {
  totalCount: number;
  children?: React.ReactNode;
}

const CommonPagination = ({ totalCount, children }: CommonPaginationProps) => {
  const { pageFilter, handlePage, handleView } = usePagination();
  return (
    <div className="w-full flex flex-col gap-4 md:flex-row md:justify-between">
      <Pagination
        activePage={parseInt(pageFilter.pageNumber)}
        totalItemCount={totalCount}
        viewSize={parseInt(pageFilter.pageSize)}
        onChange={(page) => handlePage(page)}
        pageRangeDisplayed={5}
      />
      <div className="flex justify-between items-center md:gap-2">
        <ViewSelect
          value={pageFilter.pageSize}
          onChange={(view) => handleView(view)}
        />
        {children}
      </div>
    </div>
  );
};

export default CommonPagination;
