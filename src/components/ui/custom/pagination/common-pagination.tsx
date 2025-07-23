"use client";

import Pagination from "@/components/ui/custom/pagination/pagination";
import ViewSelect from "@/components/ui/custom/pagination/view-select";
import { usePagination } from "@/hooks/filter/usePagination";
import React from "react";

const CommonPagination = () => {
  const { pageFilter, handlePage, handleView } = usePagination();
  return (
    <div className="flex justify-between">
      <Pagination
        activePage={parseInt(pageFilter.pageNumber)}
        totalItemCount={50}
        viewSize={parseInt(pageFilter.pageSize)}
        onChange={(page) => handlePage(page)}
        pageRangeDisplayed={5}
      />
      <ViewSelect
        value={pageFilter.pageSize}
        onChange={(view) => handleView(view)}
      />
    </div>
  );
};

export default CommonPagination;
