"use client";
import BaseSkeleton from "@/components/common/base-skeleton";
import Button from "@/components/common/button";
import IconButton from "@/components/common/icon-button";
import CommonPagination from "@/components/ui/custom/pagination/common-pagination";
import { usePermission } from "@/hooks/usePermission";
import { useUIStore } from "@/store/common/ui-store";
import { useEquipmentMainStore } from "@/store/normal/equipment/equip-main-store";
import { PlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const EquipmentPagination = () => {
  const router = useRouter();
  const { equipmentList, loadingKeys } = useEquipmentMainStore();
  const { isLoading, hasError } = useUIStore();
  const { canWorkerEdit } = usePermission();
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
          {canWorkerEdit && (
            <Button
              label="장비 생성"
              icon={<PlusIcon size={20} />}
              size={"sm"}
              onClick={() => router.push("equipment/add")}
            />
          )}
        </CommonPagination>
      </div>
    </>
  );
};

export default EquipmentPagination;
