"use client";
import BaseSkeleton from "@/components/common/base-skeleton";
import IconButton from "@/components/common/icon-button";
import CommonPagination from "@/components/ui/custom/pagination/common-pagination";
import { useUIStore } from "@/store/common/ui-store";
import { useEquipmentMainStore } from "@/store/normal/equipment/equip-main-store";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const EquipmentPagination = () => {
  const router = useRouter();
  const { equipmentList, loadingKeys } = useEquipmentMainStore();
  const { isLoading, hasError } = useUIStore();
  //데이터 에러, 로딩인경우
  if (isLoading(loadingKeys.LIST) || !equipmentList) {
    return <BaseSkeleton className="h-9" />;
  }
  if (hasError(loadingKeys.LIST)) {
    return <div>에러 발생</div>;
  }

  return (
    <>
      <div className="flex gap-4 items-center">
        <CommonPagination totalCount={equipmentList.meta.totalCount}>
          <IconButton
            icon="Plus"
            onClick={() => router.push("equipment/add")}
          />
        </CommonPagination>
      </div>
    </>
  );
};

export default EquipmentPagination;
