"use client";
import BaseSkeleton from "@/components/common/base-skeleton";
import IconButton from "@/components/common/icon-button";
import QrAddForm from "@/components/form/normal/qr/add";
import BaseDialog from "@/components/ui/custom/base-dialog";
import CommonPagination from "@/components/ui/custom/pagination/common-pagination";
import { useUIStore } from "@/store/common/ui-store";
import { useQrStore } from "@/store/normal/qr/qr-store";
import { useSearchParams } from "next/navigation";

import React, { useState } from "react";

const QrPagination = () => {
  const { postAddQr, qrList, getQrList, loadingKeys } = useQrStore();
  const { isLoading, hasError } = useUIStore();
  const [open, setOpen] = useState<boolean>(false);
  const searchParams = useSearchParams();
  const handleSubmit = async (values: any) => {
    await postAddQr(values);
    await getQrList(new URLSearchParams(searchParams));
    setOpen(false);
  };

  if (isLoading(loadingKeys.LIST) || !qrList)
    return <BaseSkeleton className="h-9" />;
  if (hasError(loadingKeys.LIST)) return <div>에러 발생</div>;

  return (
    <div className="flex gap-4 items-center">
      <CommonPagination totalCount={qrList.meta.totalCount}>
        <BaseDialog
          triggerChildren={<IconButton icon={"Plus"} />}
          title="위치QR 생성"
          open={open}
          setOpen={setOpen}
        >
          <QrAddForm onSubmit={handleSubmit} />
        </BaseDialog>
      </CommonPagination>
    </div>
  );
};

export default QrPagination;
