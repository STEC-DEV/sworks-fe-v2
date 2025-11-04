"use client";

import BaseSkeleton from "@/components/common/base-skeleton";
import IconButton from "@/components/common/icon-button";
import AppTitle from "@/components/common/label/title";
import HistoryEdit from "@/components/form/normal/equipment/history-edit";
import BaseDialog from "@/components/ui/custom/base-dialog";
import { useDecodeParam } from "@/hooks/params";
import { cn } from "@/lib/utils";
import { useEquipmentHistoryDetailStore } from "@/store/normal/equipment/history/detail-store";
import { useEquipmentHistoryMainStore } from "@/store/normal/equipment/history/list-store";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const Page = () => {
  const [open, setOpen] = useState<boolean>(false);
  const router = useRouter();
  const { rawValue: id } = useDecodeParam("id");
  const { rawValue } = useDecodeParam("history-id");
  const { historyDetail, getHistoryDetail } = useEquipmentHistoryDetailStore();

  useEffect(() => {
    if (rawValue) getHistoryDetail(rawValue);
  }, [rawValue]);

  return (
    <div className="flex gap-2 w-150 ">
      <div>
        <IconButton
          className="stroke-1"
          icon="ChevronLeft"
          size={36}
          onClick={() => router.replace(`/equipment/${id}`)}
        />
      </div>

      <div className="flex-1 base-flex-col gap-6">
        <div className="flex justify-between">
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
        {historyDetail ? (
          <div className="base-flex-col gap-4">
            <KeyValueItem
              labelStyle="text-sm"
              valueStyle="text-md font-normal"
              label={"점검일자"}
              value={format(historyDetail?.detailDt, "yyyy-MM-dd")}
            />
            <KeyValueItem
              labelStyle="text-sm"
              valueStyle="text-md font-normal"
              label={"비고"}
              value={historyDetail?.remark ?? ""}
            />
            <KeyValueItem
              labelStyle="text-sm"
              valueStyle="text-md font-normal"
              label={"점검내용"}
              value={historyDetail?.contents}
            />
          </div>
        ) : (
          <BaseSkeleton className="h-200" />
        )}
      </div>
    </div>
  );
};

interface KeyValueItemProps {
  label: string;
  value: string;
  mainStyle?: string;
  labelStyle?: string;
  valueStyle?: string;
  isHorizontal?: boolean;
}

export const KeyValueItem = ({
  label,
  value,
  mainStyle,
  labelStyle,
  valueStyle,
  isHorizontal = false,
}: KeyValueItemProps) => {
  return (
    <div
      className={cn(
        `flex flex-col gap-1 ${
          isHorizontal ? "flex-row justify-between items-center" : ""
        }`,
        mainStyle
      )}
    >
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
