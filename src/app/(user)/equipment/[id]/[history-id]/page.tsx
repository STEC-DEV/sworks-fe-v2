"use client";

import BaseSkeleton from "@/components/common/base-skeleton";
import IconButton from "@/components/common/icon-button";
import AppTitle from "@/components/common/label/title";
import HistoryEdit from "@/components/form/normal/equipment/history-edit";
import BaseDialog from "@/components/ui/custom/base-dialog";
import { KeyValueItem } from "@/components/ui/custom/key-value";
import { useDecodeParam } from "@/hooks/params";
import { useUIStore } from "@/store/common/ui-store";
import { useEquipmentHistoryDetailStore } from "@/store/normal/equipment/history/detail-store";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const Page = () => {
  const [open, setOpen] = useState<boolean>(false);
  const router = useRouter();
  const { rawValue: id } = useDecodeParam("id");
  const { rawValue } = useDecodeParam("history-id");
  const { historyDetail, getHistoryDetail, loadingKeys } =
    useEquipmentHistoryDetailStore();
  const { isLoading, hasError } = useUIStore();

  useEffect(() => {
    if (rawValue) getHistoryDetail(rawValue);
  }, [rawValue]);

  const getData = () => {
    if (isLoading(loadingKeys.INFO) || !historyDetail)
      return (
        <div className="flex flex-col gap-4">
          {Array.from({ length: 3 }, (_, i) => (
            <div className="flex flex-col gap-1" key={i}>
              <BaseSkeleton className="w-15 h-5" />
              <BaseSkeleton className="h-6" />
            </div>
          ))}
        </div>
      );
    if (hasError(loadingKeys.INFO)) return <div>에러 발생</div>;
    return (
      <div className="base-flex-col gap-4">
        <KeyValueItem
          labelStyle="text-sm"
          valueStyle="text-md font-normal"
          label={"점검일자"}
          value={format(historyDetail.detailDt, "yyyy-MM-dd")}
        />
        <KeyValueItem
          labelStyle="text-sm"
          valueStyle="text-md font-normal"
          label={"비고"}
          value={historyDetail.remark ?? ""}
        />
        <KeyValueItem
          labelStyle="text-sm"
          valueStyle="text-md font-normal"
          label={"점검내용"}
          value={historyDetail.contents}
        />
      </div>
    );
  };

  return (
    <div className="flex gap-2 xl:w-150 ">
      {/* <div>
        <IconButton
          className="stroke-1"
          icon="ChevronLeft"
          size={36}
          onClick={() => router.replace(`/equipment/${id}`)}
        />
      </div> */}

      <div className="flex-1 base-flex-col gap-6">
        <div className="flex justify-between pb-4 border-b-2 border-border">
          <AppTitle title="관리이력 상세" />
          <BaseDialog
            title="수정"
            triggerChildren={<IconButton icon="SquarePen" />}
            open={open}
            setOpen={setOpen}
          >
            <HistoryEdit setOpen={setOpen} />
          </BaseDialog>
        </div>
        {getData()}
      </div>
    </div>
  );
};

export default Page;
