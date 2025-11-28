"use client";
import BaseSkeleton from "@/components/common/base-skeleton";
import CustomCard from "@/components/common/card";
import CheckDialog from "@/components/common/check-dialog";
import IconButton from "@/components/common/icon-button";

import QrEditForm, { QREditFormType } from "@/components/form/normal/qr/edit";
import BaseDialog from "@/components/ui/custom/base-dialog";
import { useQrStore } from "@/store/normal/qr/qr-store";
import { downloadQRCodeSVG } from "@/utils/qr";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { dialogText } from "../../../../../../public/text";
import EmptyBox from "@/components/ui/custom/empty";
import { useUIStore } from "@/store/common/ui-store";

const QrList = () => {
  const { qrList, getQrList, loadingKeys } = useQrStore();
  const { isLoading, hasError } = useUIStore();
  const searchParams = useSearchParams();

  useEffect(() => {
    getQrList(new URLSearchParams(searchParams));
  }, [searchParams, getQrList]);

  if (isLoading(loadingKeys.LIST) || !qrList)
    return (
      <div className="grid grid-cols-5 gap-x-4 gap-y-6">
        {Array.from({ length: 25 }, (_, i) => (
          <BaseSkeleton className="h-24" key={i} />
        ))}
      </div>
    );
  if (hasError(loadingKeys.LIST)) return <div>에러 발생</div>;

  return qrList.data.length > 0 ? (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-x-4 gap-y-6">
      {qrList.data.map((v, i) => (
        <QrItemBox key={i} data={v} />
      ))}
    </div>
  ) : (
    <EmptyBox />
  );
};

const QrItemBox = ({ data }: { data: QRListItem }) => {
  const [open, setOpen] = useState<boolean>(false);
  const searchParams = useSearchParams();
  const { getQrList, patchUpdateQr, deleteQr } = useQrStore();

  const handleSubmit = async (values: QREditFormType) => {
    await patchUpdateQr(values);
    await getQrList(new URLSearchParams(searchParams));
    setOpen(false);
  };

  const handleQRDownload = async () => {
    const baseUrl = "http://123.2.156.229:3000/complain/add";
    const params = new URLSearchParams({
      vocSeq: data.vocSeq.toString(),
    });
    await downloadQRCodeSVG(
      `${baseUrl}?${params.toString()}`,
      `${data.name}_QR`
    );
  };

  const handleDelete = async () => {
    await deleteQr(data.vocSeq.toString());
    await getQrList(new URLSearchParams(searchParams));
  };

  return (
    <CustomCard size={"sm"} className="gap-2 pl-4 ">
      <div className="flex justify-between items-center">
        <span className="text-xs text-blue-500">{data.serviceTypeName}</span>
        <div className="flex gap-2 items-center">
          <BaseDialog
            triggerChildren={<IconButton icon="SquarePen" />}
            title={`${data.name} QR 수정`}
            open={open}
            setOpen={setOpen}
          >
            <QrEditForm data={data} onSubmit={handleSubmit} />
          </BaseDialog>
          <CheckDialog
            title={dialogText.defaultDelete.title}
            description={dialogText.defaultDelete.description}
            actionLabel={dialogText.defaultDelete.actionLabel}
            onClick={handleDelete}
          >
            <IconButton icon="Trash2" />
          </CheckDialog>
        </div>
      </div>
      <div className="flex justify-between items-center">
        <div className="flex flex-col gap-1">
          <span className="text-md  ">{data.name}</span>
          {data.comments ? (
            <span className="text-xs text-[var(--description-dark)]">
              {data.comments}
            </span>
          ) : null}
        </div>
        <IconButton
          bgClassName="hover:bg-blue-50 "
          icon="QrCode"
          size={24}
          onClick={handleQRDownload}
        />
      </div>
    </CustomCard>
  );
};

export default QrList;
