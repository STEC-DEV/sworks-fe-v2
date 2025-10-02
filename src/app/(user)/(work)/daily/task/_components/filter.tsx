import IconButton from "@/components/common/icon-button";
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

const TaskFilter = () => {
  const { basicCode } = useBasicStore();
  const [filterConfig, setFilterConfig] = useState<FilterConfig[]>([]);

  useEffect(() => {
    handleFilterConfig();
  }, [basicCode]);

  const handleFilterConfig = () => {
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
  };

  return <CommonFilter filters={filterConfig} />;
};

export default TaskFilter;
