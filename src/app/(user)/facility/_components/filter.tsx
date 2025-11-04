"use client";
import CommonFilter, {
  FilterConfig,
} from "@/components/ui/custom/filter.tsx/common-filter";
import { useDecodeParam } from "@/hooks/params";
import { useBasicStore } from "@/store/basic-store";
import {
  convertKeyValueArrayToRecord,
  convertSelectOptionType,
} from "@/utils/convert";
import { ReceiptText } from "lucide-react";
import React, { useEffect, useState } from "react";

const FacilityFilter = () => {
  const { basicCode } = useBasicStore();
  const { decodeValue } = useDecodeParam("type");
  const [filterConfig, setFilterConfig] = useState<FilterConfig[]>([
    {
      key: "searchFacilityType",
      placeholder: "유형",
      data: {},
      icon: ReceiptText,
    },
  ]);

  useEffect(() => {
    if (!decodeValue) return;

    switch (decodeValue) {
      case "R&M":
        if (!basicCode.rnmCodes) break;
        const data1 = convertSelectOptionType(basicCode.rnmCodes);
        const convertData1 = convertKeyValueArrayToRecord(data1);
        setFilterConfig((prev) =>
          prev.map((item) =>
            item.key === "searchFacilityType"
              ? { ...item, data: convertData1 }
              : item
          )
        );
        break;
      case "M&O":
        if (!basicCode.mnoCodes) break;
        const data2 = convertSelectOptionType(basicCode.mnoCodes);
        const convertData2 = convertKeyValueArrayToRecord(data2);
        setFilterConfig((prev) =>
          prev.map((item) =>
            item.key === "searchFacilityType"
              ? { ...item, data: convertData2 }
              : item
          )
        );
        break;
      case "MRO":
        if (!basicCode.mroCodes) break;
        const data3 = convertSelectOptionType(basicCode.mroCodes);
        const convertData3 = convertKeyValueArrayToRecord(data3);
        setFilterConfig((prev) =>
          prev.map((item) =>
            item.key === "searchFacilityType"
              ? { ...item, data: convertData3 }
              : item
          )
        );
        break;
    }
  }, [decodeValue, basicCode]);

  return (
    <CommonFilter filters={filterConfig} startName="fromDt" endName="endDt" />
  );
};

export default FacilityFilter;
