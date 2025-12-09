import BaseSkeleton from "@/components/common/base-skeleton";
import IconButton from "@/components/common/icon-button";
import RequestAddForm from "@/components/form/normal/request/add";
import BaseDialog from "@/components/ui/custom/base-dialog";
import CommonPagination from "@/components/ui/custom/pagination/common-pagination";
import { usePermission } from "@/hooks/usePermission";
import { useAuthStore } from "@/store/auth/auth-store";
import { useUIStore } from "@/store/common/ui-store";
import { useRequestTaskStore } from "@/store/normal/req/main";
import React, { useState } from "react";

const ReqPagination = () => {
  const [open, setOpen] = useState<boolean>(false);
  const { reqTaskList, loadingKeys } = useRequestTaskStore();
  const { isLoading, hasError } = useUIStore();
  const { canWorkerEdit } = usePermission();
  const { loginProfile } = useAuthStore();

  if (isLoading(loadingKeys.LIST) || !reqTaskList)
    return <BaseSkeleton className="h-9" />;
  if (hasError(loadingKeys.LIST)) return <div>에러 발생</div>;

  return (
    <CommonPagination totalCount={reqTaskList.meta.totalCount}>
      {(canWorkerEdit || loginProfile?.role === "계약 담당자") && (
        <BaseDialog
          title="업무요청"
          open={open}
          setOpen={setOpen}
          triggerChildren={<IconButton icon="Plus" />}
        >
          <RequestAddForm onClose={() => setOpen(false)} />
        </BaseDialog>
      )}
    </CommonPagination>
  );
};

export default ReqPagination;
