import CommonFilter, {
  FilterConfig,
} from "@/components/ui/custom/filter.tsx/common-filter";
import { useVocStore } from "@/store/normal/voc/voc-store";
import {
  convertKeyValueArrayToRecord,
  convertSelectOptionType,
} from "@/utils/convert";
import { ReceiptText, RotateCcwIcon } from "lucide-react";
import React, { useEffect, useState } from "react";

const VocFilter = () => {
  const { userPermission, getUserPermission } = useVocStore();
  const [filterConfig, setFilterConfig] = useState<FilterConfig[]>([
    {
      key: "division",
      placeholder: "구분",
      data: { 모바일: "0", 수기입력: "1" },
      icon: ReceiptText,
    },
    {
      key: "serviceTypeSeq",
      placeholder: "유형",
      data: {},
      icon: ReceiptText,
    },
    {
      key: "status",
      placeholder: "처리상태",
      data: { 미처리: "0", 처리중: "1", 처리완료: "2" },
      icon: RotateCcwIcon,
    },
  ]);

  useEffect(() => {
    getUserPermission();
  }, [getUserPermission]);

  useEffect(() => {
    if (!userPermission) return;
    const data = convertSelectOptionType(userPermission);
    const convertData = convertKeyValueArrayToRecord(data);
    setFilterConfig((prev) =>
      prev.map((item) =>
        item.key === "serviceTypeSeq" ? { ...item, data: convertData } : item
      )
    );
  }, [userPermission]);

  return (
    <>
      <CommonFilter filters={filterConfig} />
    </>
  );
};

export default VocFilter;
