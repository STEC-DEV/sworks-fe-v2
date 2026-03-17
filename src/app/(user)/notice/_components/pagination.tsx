import BaseSkeleton from "@/components/common/base-skeleton";
import Button from "@/components/common/button";
import IconButton from "@/components/common/icon-button";
import CommonPagination from "@/components/ui/custom/pagination/common-pagination";
import { usePermission } from "@/hooks/usePermission";
import { useUIStore } from "@/store/common/ui-store";
import { useNoticeStore } from "@/store/normal/notice/notice-store";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

const NoticePagination = () => {
  const router = useRouter();
  const { noticeList, loadingKeys } = useNoticeStore();
  const { isLoading, hasError } = useUIStore();
  const { canWorkerEdit } = usePermission();
  if (isLoading(loadingKeys.LIST) || !noticeList)
    return <BaseSkeleton className="h-9" />;
  if (hasError(loadingKeys.LIST)) return <div>에러 발생</div>;
  return (
    <CommonPagination totalCount={noticeList.meta.totalCount}>
      {canWorkerEdit && (
        <Button
          size={"sm"}
          label="새 일정"
          icon={<Plus size={16} />}
          onClick={() => router.push(`/notice/add`)}
        />
        //  <IconButton icon="Plus" onClick={() => router.push(`/notice/add`)} />
      )}
    </CommonPagination>
  );
};

export default NoticePagination;
