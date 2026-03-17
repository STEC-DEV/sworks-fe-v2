"use client";
import BaseSkeleton from "@/components/common/base-skeleton";
import Button from "@/components/common/button";
import IconButton from "@/components/common/icon-button";
import CommonPagination from "@/components/ui/custom/pagination/common-pagination";
import { useDecodeParam } from "@/hooks/params";
import { usePermission } from "@/hooks/usePermission";
import { useUIStore } from "@/store/common/ui-store";
import { useFacilityMainStore } from "@/store/normal/facility/facility-main-store";
import { PlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

const FacilityPagination = () => {
  const router = useRouter();
  const { decodeValue } = useDecodeParam("type");
  const { facilityList, loadingKeys } = useFacilityMainStore();
  const { isLoading, hasError } = useUIStore();
  const { canWorkerEdit } = usePermission();

  if (isLoading(loadingKeys.LIST) || !facilityList) {
    return <BaseSkeleton className="h-9" />;
  }
  if (hasError(loadingKeys.LIST)) {
    return <div>에러 발생</div>;
  }

  return (
    <CommonPagination totalCount={facilityList.meta.totalCount}>
      {canWorkerEdit && (
        <Button
          label={decodeValue + " 생성"}
          size={"sm"}
          onClick={() => router.push(`${decodeValue.toLowerCase()}/add`)}
          icon={<PlusIcon size={20} />}
        />
      )}
    </CommonPagination>
  );
};
{
  /* <IconButton
          icon="Plus"
          onClick={() => router.push(`${decodeValue.toLowerCase()}/add`)}
        /> */
}

export default FacilityPagination;
