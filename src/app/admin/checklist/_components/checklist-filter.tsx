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
import React from "react";
const filterConfig: FilterConfig[] = [
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
];

const ChecklistFilter = () => {
  return <CommonFilter filters={filterConfig} search={false} />;
};

export default ChecklistFilter;
