"use client";
import BaseSkeleton from "@/components/common/base-skeleton";
import IconButton from "@/components/common/icon-button";
import QrAddForm from "@/components/form/normal/qr/add";
import BaseDialog from "@/components/ui/custom/base-dialog";
import CommonPagination from "@/components/ui/custom/pagination/common-pagination";
import { useQrStore } from "@/store/normal/qr/qr-store";
import { useSearchParams } from "next/navigation";

import React, { useState } from "react";

const QrPagination = () => {
  const { postAddQr, qrList, getQrList } = useQrStore();
  const [open, setOpen] = useState<boolean>(false);
  const searchParams = useSearchParams();
  const handleSubmit = async (values: any) => {
    const res = await postAddQr(values);
    await getQrList(new URLSearchParams(searchParams));
    setOpen(false);
  };

  if (qrList.type === "loading") return <BaseSkeleton className="h-10" />;
  if (qrList.type === "error") return;

  return (
    <div className="flex gap-4 items-center">
      <CommonPagination totalCount={qrList.payload.meta.totalCount} />
      <BaseDialog
        triggerChildren={<IconButton icon={"Plus"} />}
        title="위치QR 생성"
        open={open}
        setOpen={setOpen}
      >
        <QrAddForm onSubmit={handleSubmit} />
      </BaseDialog>
    </div>
  );
};

export default QrPagination;
