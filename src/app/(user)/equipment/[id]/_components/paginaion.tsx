import BaseSkeleton from "@/components/common/base-skeleton";
import IconButton from "@/components/common/icon-button";
import CommonPagination from "@/components/ui/custom/pagination/common-pagination";
import { useDecodeParam } from "@/hooks/params";
import { useUIStore } from "@/store/common/ui-store";
import { useEquipmentHistoryMainStore } from "@/store/normal/equipment/history/list-store";
import { useRouter } from "next/navigation";
import React from "react";

const HistoryPagination = () => {
  const router = useRouter();
  const { historyList, loadingKeys } = useEquipmentHistoryMainStore();
  const { isLoading, hasError } = useUIStore();
  const { rawValue: id } = useDecodeParam("id");

  if (isLoading(loadingKeys.LIST) || !historyList)
    return <BaseSkeleton className="h-9" />;
  if (hasError(loadingKeys.LIST)) return <div>에러 발생</div>;
  return (
    <CommonPagination totalCount={20}>
      <IconButton icon="Plus" onClick={() => router.push(`${id}/add`)} />
    </CommonPagination>
  );
};

export default HistoryPagination;
