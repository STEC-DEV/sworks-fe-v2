"use client";

import BaseSkeleton from "@/components/common/base-skeleton";
import IconButton from "@/components/common/icon-button";
import AppTitle from "@/components/common/label/title";
import BaseDialog from "@/components/ui/custom/base-dialog";
import { useDecodeParam } from "@/hooks/params";
import { cn } from "@/lib/utils";
import { useEquipmentHistoryDetailStore } from "@/store/normal/equipment/history/detail-store";
import { useEquipmentHistoryMainStore } from "@/store/normal/equipment/history/list-store";
import { format } from "date-fns";
import React, { useEffect } from "react";

const Page = () => {
  const { rawValue } = useDecodeParam("history-id");
  const { historyDetail, getHistoryDetail } = useEquipmentHistoryDetailStore();

  useEffect(() => {
    if (rawValue) getHistoryDetail(rawValue);
  }, []);

  return (
    <div className="w-150">
      <div className="flex justify-between">
        <AppTitle title="관리이력 상세" />
        <IconButton icon="SquarePen" />
      </div>
      {historyDetail ? (
        <div className="h-full">
          <KeyValueItem
            label={"점검일자"}
            value={format(historyDetail?.detailDt, "yyyy-MM=dd")}
          />
          <KeyValueItem label={"점검내용"} value={historyDetail?.contents} />
          <KeyValueItem label={"비고"} value={historyDetail?.remark ?? ""} />
        </div>
      ) : (
        <BaseSkeleton className="h-200" />
      )}
    </div>
  );
};

interface KeyValueItemProps {
  label: string;
  value: string;
  mainStyle?: string;
  labelStyle?: string;
  valueStyle?: string;
}

export const KeyValueItem = ({
  label,
  value,
  mainStyle,
  labelStyle,
  valueStyle,
}: KeyValueItemProps) => {
  return (
    <div className={cn("flex flex-col gap-1", mainStyle)}>
      <span
        className={cn("text-xs text-[var(--description-light)]", labelStyle)}
      >
        {label}
      </span>
      <span
        className={cn(
          "text-xs font-semibold text-[var(--description-dark)]",
          valueStyle
        )}
      >
        {value}
      </span>
    </div>
  );
};

export default Page;
