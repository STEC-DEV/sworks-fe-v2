"use client";
import CommonFilter, {
  FilterConfig,
} from "@/components/ui/custom/filter.tsx/common-filter";
import { useBasicStore } from "@/store/basic-store";
import {
  convertKeyValueArrayToRecord,
  convertSelectOptionType,
} from "@/utils/convert";
import { ReceiptTextIcon, Users2 } from "lucide-react";
import React, { useEffect, useState } from "react";

const UserFilter = () => {
  const { basicCode } = useBasicStore();
  const [filterConfig, setFilterConfig] = useState<FilterConfig[]>([]);

  useEffect(() => {
    if (!basicCode || !basicCode.contractCodes || !basicCode.userCodes) return;
    const contractData = convertSelectOptionType(basicCode.contractCodes);
    const convertContractData = convertKeyValueArrayToRecord(contractData);
    const permissionData = convertSelectOptionType(basicCode.userCodes);
    const convertPermissionData = convertKeyValueArrayToRecord(permissionData);

    setFilterConfig((prev) => [
      ...prev,
      {
        key: "contractTypeSeq",
        placeholder: "유형",
        icon: ReceiptTextIcon,
        data: convertContractData, // 중괄호 제거
      },
      {
        key: "role",
        placeholder: "권한",
        icon: Users2,
        data: convertPermissionData, // 중괄호 제거
      },
    ]);
  }, [basicCode]);

  return <CommonFilter filters={filterConfig} />;
};

export default UserFilter;
