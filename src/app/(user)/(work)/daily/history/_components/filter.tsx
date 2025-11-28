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

const TaskHistoryFilter = () => {
  const { basicCode } = useBasicStore();
  const [filterConfig, setFilterConfig] = useState<FilterConfig[]>([]);

  useEffect(() => {
    if (!basicCode || !basicCode.contractCodes) return;
    const data = convertSelectOptionType(basicCode.contractCodes);
    const convertData = convertKeyValueArrayToRecord(data);

    setFilterConfig((prev) => [
      ...prev,
      {
        key: "serviceTypeSeq",
        placeholder: "유형",
        icon: ReceiptTextIcon,
        data: convertData, // 중괄호 제거
      },
    ]);
  }, [basicCode]);

  return <CommonFilter filters={filterConfig} />;
};

export default TaskHistoryFilter;
