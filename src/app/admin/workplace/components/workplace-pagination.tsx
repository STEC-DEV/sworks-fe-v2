"use client";
import BaseSkeleton from "@/components/common/base-skeleton";
import Button from "@/components/common/button";
import IconButton from "@/components/common/icon-button";
import CommonPagination from "@/components/ui/custom/pagination/common-pagination";
import { usePermission } from "@/hooks/usePermission";
import { useWorkplaceListStore } from "@/store/admin/workplace/workplace-list-store";
import { useUIStore } from "@/store/common/ui-store";
import { PlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";

import React from "react";

const WorkplacePagination = () => {
  const { canEdit } = usePermission();
  const { isLoading, hasError } = useUIStore();
  const { workplaceList, loadingKeys } = useWorkplaceListStore();
  const router = useRouter();

  if (isLoading(loadingKeys.LIST) || !workplaceList?.meta)
    return <BaseSkeleton className="h-9" />;
  if (hasError(loadingKeys.LIST)) return <div>에러발생</div>;
  return (
    <CommonPagination totalCount={workplaceList.meta.totalCount}>
      {canEdit && (
        <Button
          label="사업장 생성"
          icon={<PlusIcon />}
          onClick={() => router.push("workplace/add")}
        />
      )}
    </CommonPagination>
  );
};

export default WorkplacePagination;

// if (workplaceList.type === "loading") return <BaseSkeleton className="h-9" />;
// if (workplaceList.type === "error") return <BaseSkeleton className="h-9" />;
// return (
//   <div className="flex gap-4">
//     <CommonPagination totalCount={workplaceList.payload.meta.totalCount} />
//     {canEdit && (
//       <IconButton
//         icon={"Plus"}
//         onClick={() => router.push("workplace/add")}
//       />
//     )}
//   </div>
// );
