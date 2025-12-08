"use client";
import CommonFilter, {
  FilterConfig,
} from "@/components/ui/custom/filter.tsx/common-filter";

import {
  ContractServiceType,
  DivType,
  SiteServiceType,
} from "@/types/admin/workplace/workplace-filter";

import { Building2, ReceiptText, Table2 } from "lucide-react";
import { useMemo } from "react";

const QeFilter = () => {
  const filterConfig: FilterConfig[] = useMemo(
    () => [
      {
        key: "serviceTypeSeq",
        placeholder: "계약유형",
        data: ContractServiceType,
        icon: ReceiptText,
      },
      {
        key: "divTypeSeq",
        placeholder: "관리부문",
        data: DivType,
        icon: Table2,
      },
      {
        key: "typeCodeSeq",
        placeholder: "관리유형",
        data: SiteServiceType,
        icon: Building2,
      },
    ],
    []
  ); // 빈 의존성 배열로 한 번만 생성

  return <CommonFilter filters={filterConfig} search={false} />;
};

export default QeFilter;
