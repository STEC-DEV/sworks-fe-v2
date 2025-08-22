"use client";
import BaseSkeleton from "@/components/common/base-skeleton";
import IconButton from "@/components/common/icon-button";
import CommonPagination from "@/components/ui/custom/pagination/common-pagination";
import { useEquipmentMainStore } from "@/store/normal/equipment/equip-main-store";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const EquipmentPagination = () => {
  const router = useRouter();
  const { equipmentList } = useEquipmentMainStore.getState();

  useEffect(() => {
    console.log(equipmentList);
  }, [equipmentList]);

  return (
    <>
      {equipmentList.type === "data" ? (
        <div className="flex gap-4">
          <CommonPagination totalCount={equipmentList.meta.totalCount} />
          <IconButton
            icon="Plus"
            onClick={() => router.push("equipment/add")}
          />
        </div>
      ) : (
        <BaseSkeleton className="w-full h-10" />
      )}
    </>
  );
};

export default EquipmentPagination;
