import BaseSkeleton from "@/components/common/base-skeleton";
import IconButton from "@/components/common/icon-button";
import CommonPagination from "@/components/ui/custom/pagination/common-pagination";
import { useUIStore } from "@/store/common/ui-store";
import { useNoticeStore } from "@/store/normal/notice/notice-store";
import { useRouter } from "next/navigation";
import React from "react";

const NoticePagination = () => {
  const router = useRouter();
  const { noticeList, loadingKeys } = useNoticeStore();
  const { isLoading, hasError } = useUIStore();
  if (isLoading(loadingKeys.LIST) || !noticeList)
    return <BaseSkeleton className="h-9" />;
  if (hasError(loadingKeys.LIST)) return <div>에러 발생</div>;
  return (
    <CommonPagination totalCount={noticeList.meta.totalCount}>
      <IconButton icon="Plus" onClick={() => router.push(`/notice/add`)} />
    </CommonPagination>
  );
};

export default NoticePagination;
