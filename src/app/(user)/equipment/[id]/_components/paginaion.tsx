import BaseSkeleton from "@/components/common/base-skeleton";
import IconButton from "@/components/common/icon-button";
import CommonPagination from "@/components/ui/custom/pagination/common-pagination";
import { useDecodeParam } from "@/hooks/params";
import { useEquipmentHistoryMainStore } from "@/store/normal/equipment/history/list-store";
import { useRouter } from "next/navigation";
import React from "react";

const HistoryPagination = () => {
  const router = useRouter();
  const { historyList } = useEquipmentHistoryMainStore();
  const { rawValue: id } = useDecodeParam("id");
  return (
    <>
      {historyList.type === "data" ? (
        <div className="flex gap-4">
          <CommonPagination totalCount={20} />
          <IconButton icon="Plus" onClick={() => router.push(`${id}/add`)} />
        </div>
      ) : (
        <BaseSkeleton className="h-10" />
      )}
    </>
  );
};

export default HistoryPagination;
