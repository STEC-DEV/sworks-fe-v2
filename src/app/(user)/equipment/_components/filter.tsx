"use client";
import CommonFilter, {
  FilterConfig,
} from "@/components/ui/custom/filter.tsx/common-filter";
import { useBasicStore } from "@/store/basic-store";
import {
  convertKeyValueArrayToRecord,
  convertSelectOptionType,
} from "@/utils/convert";
import { ReceiptTextIcon } from "lucide-react";
import React, { useEffect, useState } from "react";

const EquipmentFilter = () => {
  const { basicCode } = useBasicStore();
  const [filterConfig, setFilterConfig] = useState<FilterConfig[]>([]);

  useEffect(() => {
    if (!basicCode || !basicCode.contractCodes) return;

    const data = convertSelectOptionType(basicCode.contractCodes);
    const convertData = convertKeyValueArrayToRecord(data);

    // prev 사용하지 않고 직접 설정
    setFilterConfig([
      {
        key: "serviceTypeSeq",
        placeholder: "유형",
        icon: ReceiptTextIcon,
        data: convertData,
      },
    ]);
  }, [basicCode]);

  return <CommonFilter filters={filterConfig} />;
};

export default EquipmentFilter;
