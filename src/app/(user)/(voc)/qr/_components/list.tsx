"use client";
import BaseSkeleton from "@/components/common/base-skeleton";
import CustomCard from "@/components/common/card";
import IconButton from "@/components/common/icon-button";

import QrEditForm, { QREditFormType } from "@/components/form/normal/qr/edit";
import BaseDialog from "@/components/ui/custom/base-dialog";
import LoadingOverlay from "@/components/ui/custom/overlay/loading";
import { useQrStore } from "@/store/normal/qr/qr-store";
import { downloadQRCodeSVG } from "@/utils/qr";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const QrList = () => {
  const { qrList, getQrList } = useQrStore();
  const searchParams = useSearchParams();

  useEffect(() => {
    getQrList(new URLSearchParams(searchParams));
  }, []);

  useEffect(() => {
    getQrList(new URLSearchParams(searchParams));
  }, [searchParams]);

  if (qrList.type === "loading") return <BaseSkeleton />;
  if (qrList.type === "error") return;

  return (
    <div className="grid grid-cols-5 gap-x-4 gap-y-6">
      {qrList.payload.data.map((v, i) => (
        <QrItemBox key={i} data={v} />
      ))}
    </div>
  );
};

const QrItemBox = ({ data }: { data: QRListItem }) => {
  const [open, setOpen] = useState<boolean>(false);
  const searchParams = useSearchParams();
  const { getQrList, patchUpdateQr } = useQrStore();

  const handleSubmit = async (values: QREditFormType) => {
    const res = await patchUpdateQr(values);
    await getQrList(new URLSearchParams(searchParams));
    setOpen(false);
  };

  const handleQRDownload = async () => {
    const baseUrl = "http://123.2.156.229:3000/voc/add";
    const params = new URLSearchParams({
      vocSeq: data.vocSeq.toString(),
    });
    await downloadQRCodeSVG(
      `${baseUrl}?${params.toString()}`,
      `${data.name}_QR`
    );
  };

  return (
    <CustomCard size={"sm"} className="gap-2 ">
      <div className="flex justify-between items-center">
        <span className="text-xs text-blue-500">{data.serviceTypeName}</span>
        <BaseDialog
          triggerChildren={<IconButton icon="SquarePen" />}
          title={`${data.name} QR 수정`}
          open={open}
          setOpen={setOpen}
        >
          <QrEditForm data={data} onSubmit={handleSubmit} />
        </BaseDialog>
        {/* <div className="flex gap-2 items-center">
          
        </div> */}
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

// const qrList: QRListItem[] = [
//   {
//     vocSeq: 1,
//     name: "고객만족 설문 QR",
//     comments: "설문조사 참여를 위한 QR 코드",
//   },
//   {
//     vocSeq: 2,
//     name: "안전교육 이수 QR",
//     comments: "사내 안전 교육 완료 확인용",
//   },
//   {
//     vocSeq: 3,
//     name: "출입등록 QR",
//     comments: "외부 방문객 출입 등록용",
//   },
//   {
//     vocSeq: 4,
//     name: "A동 회의실 예약 QR",
//     comments: "회의실 예약 현황 확인",
//   },
//   {
//     vocSeq: 5,
//     name: "시설 점검 요청 QR",
//     comments: "고장 접수 및 점검 요청용",
//   },
// ];
