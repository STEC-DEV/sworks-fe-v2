"use client";
import CommonFilter, {
  FilterConfig,
} from "@/components/ui/custom/filter.tsx/common-filter";
import { useBasicStore } from "@/store/basic-store";
import {
  convertKeyValueArrayToRecord,
  convertSelectOptionType,
} from "@/utils/convert";
import { ReceiptTextIcon, RotateCcwIcon } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
const EMPTY_FILTERS: FilterConfig[] = [];

const TaskFilter = ({ viewMode }: { viewMode: "TASK" | "WORKER" }) => {
  const { basicCode } = useBasicStore();

  const filterConfig = useMemo<FilterConfig[]>(() => {
    if (!basicCode || !basicCode.contractCodes) return EMPTY_FILTERS;

    const data = convertSelectOptionType(basicCode.contractCodes);
    const convertData = convertKeyValueArrayToRecord(data);

    return [
      {
        key: "serviceTypeSeq",
        placeholder: "유형",
        icon: ReceiptTextIcon,
        data: convertData,
      },
      {
        key: "completeYn",
        placeholder: "처리상태",
        icon: RotateCcwIcon,
        data: {
          미완료: 0,
          완료: 1,
        },
      },
    ];
  }, [basicCode?.contractCodes]);

  // 항상 동일한 구조 반환
  return (
    <div key={"daily-filter"}>
      <CommonFilter
        filters={viewMode === "TASK" ? filterConfig : EMPTY_FILTERS}
      />
    </div>
  );
};
export default TaskFilter;
