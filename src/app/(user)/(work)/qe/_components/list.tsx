import BaseSkeleton from "@/components/common/base-skeleton";
import BaseTable from "@/components/common/base-table";
import { useUIStore } from "@/store/common/ui-store";
import { useQeStore } from "@/store/normal/qe/qe-store";
import React from "react";
import { qeCol } from "./columns";
import { useRouter } from "next/navigation";

const QeList = () => {
  const router = useRouter();
  const { qeList, loadingKeys } = useQeStore();
  const { isLoading, hasError } = useUIStore();

  if (isLoading(loadingKeys.LIST) || !qeList)
    return <BaseSkeleton className="flex-1" />;
  if (hasError(loadingKeys.LIST)) return <div>에러 발생</div>;

  return (
    <BaseTable
      columns={qeCol}
      data={qeList.data}
      onRowClick={(data) => {
        router.push(`/qe/${data.logSeq}`);
      }}
    />
  );
};

export default QeList;
