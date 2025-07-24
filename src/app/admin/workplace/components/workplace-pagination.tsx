"use client";
import IconButton from "@/components/common/icon-button";
import CommonPagination from "@/components/ui/custom/pagination/common-pagination";
import { useRouter } from "next/navigation";

import React from "react";

const WorkplacePagination = () => {
  const router = useRouter();
  return (
    <div className="flex gap-4">
      <CommonPagination />
      <IconButton icon={"Plus"} onClick={() => router.push("workplace/add")} />
    </div>
  );
};

export default WorkplacePagination;
