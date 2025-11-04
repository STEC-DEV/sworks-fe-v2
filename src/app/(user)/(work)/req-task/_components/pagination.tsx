import BaseSkeleton from "@/components/common/base-skeleton";
import IconButton from "@/components/common/icon-button";
import RequestAddForm from "@/components/form/normal/request/add";
import BaseDialog from "@/components/ui/custom/base-dialog";
import CommonPagination from "@/components/ui/custom/pagination/common-pagination";
import { useRequestTaskStore } from "@/store/normal/req/main";
import React, { useState } from "react";

const ReqPagination = () => {
  const [open, setOpen] = useState<boolean>(false);
  const { reqTaskList } = useRequestTaskStore();

  if (reqTaskList.type === "loading") return <BaseSkeleton />;
  if (reqTaskList.type === "error") return <BaseSkeleton />;

  return (
    <div className="flex gap-4">
      <CommonPagination totalCount={reqTaskList.payload.meta.totalCount} />
      <BaseDialog
        title="업무요청"
        open={open}
        setOpen={setOpen}
        triggerChildren={<IconButton icon="Plus" />}
      >
        <RequestAddForm onClose={() => setOpen(false)} />
      </BaseDialog>
    </div>
  );
};

export default ReqPagination;
