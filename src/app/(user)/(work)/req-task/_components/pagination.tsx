import IconButton from "@/components/common/icon-button";
import RequestAddForm from "@/components/form/normal/request/add";
import BaseDialog from "@/components/ui/custom/base-dialog";
import CommonPagination from "@/components/ui/custom/pagination/common-pagination";
import React, { useState } from "react";

const ReqPagination = () => {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <div className="flex gap-4">
      <CommonPagination totalCount={50} />
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
