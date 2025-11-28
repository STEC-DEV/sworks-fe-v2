import BaseSkeleton from "@/components/common/base-skeleton";
import { useVocStore } from "@/store/normal/voc/voc-store";
import React from "react";
import BaseTable from "@/components/common/base-table";
import { vocListCol } from "./voc-columns";
import { useUIStore } from "@/store/common/ui-store";
import { useRouter } from "next/navigation";

const VocList = () => {
  const { vocList, loadingKeys } = useVocStore();
  const { isLoading, hasError } = useUIStore();
  const router = useRouter();

  if (isLoading(loadingKeys.LIST) || !vocList)
    return <BaseSkeleton className="flex-1" />;
  if (hasError(loadingKeys.LIST)) return <div>에러 발생</div>;

  return (
    <BaseTable
      columns={vocListCol}
      data={vocList.data}
      onRowClick={(data) => router.push(`/voc/${data.logSeq}`)}
    />
  );
};

export default VocList;
