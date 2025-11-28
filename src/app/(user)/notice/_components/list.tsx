import BaseSkeleton from "@/components/common/base-skeleton";
import BaseTable from "@/components/common/base-table";
import { useUIStore } from "@/store/common/ui-store";
import { useNoticeStore } from "@/store/normal/notice/notice-store";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { noticeCol } from "./columns";

const NoticeList = () => {
  const router = useRouter();
  const { noticeList, loadingKeys } = useNoticeStore();
  const { isLoading, hasError } = useUIStore();

  if (isLoading(loadingKeys.LIST) || !noticeList)
    return <BaseSkeleton className="flex-1" />;
  if (hasError(loadingKeys.LIST)) return <div>에러 발생</div>;

  return (
    <BaseTable
      columns={noticeCol}
      data={noticeList.data}
      onRowClick={(data) => {
        router.push(`/notice/${data.noticeSeq}`);
      }}
    />
  );
};

export default NoticeList;
