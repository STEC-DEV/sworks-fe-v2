"use client";
import IconButton from "@/components/common/icon-button";
import CommonPagination from "@/components/ui/custom/pagination/common-pagination";
import { useDecodeParam } from "@/hooks/params";
import { useRouter } from "next/navigation";
import React from "react";

const FacilityPagination = () => {
  const router = useRouter();
  const { decodeValue } = useDecodeParam("type");
  return (
    <div className="flex gap-4">
      <CommonPagination totalCount={20} />
      <IconButton
        icon="Plus"
        onClick={() => router.push(`${decodeValue.toLowerCase()}/add`)}
      />
    </div>
  );
};

export default FacilityPagination;
