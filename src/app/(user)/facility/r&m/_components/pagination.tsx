"use client";
import IconButton from "@/components/common/icon-button";
import CommonPagination from "@/components/ui/custom/pagination/common-pagination";
import { useRouter } from "next/navigation";
import React from "react";

const RnmPagination = () => {
  const router = useRouter();
  return (
    <>
      <div className="flex gap-4">
        <CommonPagination totalCount={20} />
        <IconButton icon="Plus" onClick={() => router.push("r&m/add")} />
      </div>
    </>
  );
};

export default RnmPagination;
