"use client";
import BaseSkeleton from "@/components/common/base-skeleton";
import IconButton from "@/components/common/icon-button";
import CommonPagination from "@/components/ui/custom/pagination/common-pagination";
import { useEquipmentMainStore } from "@/store/normal/equipment/equip-main-store";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const EquipmentPagination = () => {
  const router = useRouter();
  const { equipmentList } = useEquipmentMainStore();

  //데이터 에러, 로딩인경우
  if (equipmentList.type === "loading") {
    return <BaseSkeleton className="h-9" />;
  }
  if (equipmentList.type === "error") {
    return <BaseSkeleton className="h-9" />;
  }

  return (
    <>
      <div className="flex gap-4">
        <CommonPagination totalCount={equipmentList.payload.meta.totalCount} />
        <IconButton icon="Plus" onClick={() => router.push("equipment/add")} />
      </div>
    </>
  );
};

export default EquipmentPagination;
