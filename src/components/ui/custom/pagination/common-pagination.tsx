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
    <div className="flex-1 w-full flex  gap-4 justify-end h-fit">
      <Pagination
        activePage={parseInt(pageFilter.pageNumber)}
        totalItemCount={totalCount}
        viewSize={parseInt(pageFilter.pageSize)}
        onChange={(page) => handlePage(page)}
        pageRangeDisplayed={5}
      />
      <div className="flex justify-between md:gap-2">
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
