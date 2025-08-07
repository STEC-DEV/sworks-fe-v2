"use client";
import CommonFilter, {
  FilterConfig,
} from "@/components/ui/custom/filter.tsx/common-filter";
import {
  ContractServiceType,
  SiteServiceType,
} from "@/types/admin/workplace/workplace-filter";
import { Building2, ReceiptText } from "lucide-react";
import React from "react";
const filterConfig: FilterConfig[] = [
  {
    key: "contractServiceType",
    placeholder: "업무유형",
    data: ContractServiceType,
    icon: ReceiptText,
  },
  {
    key: "siteServiceType",
    placeholder: "관리부문",
    data: SiteServiceType,
    icon: Building2,
  },
  {
    key: "siteServiceType",
    placeholder: "관리부문",
    data: SiteServiceType,
    icon: Building2,
  },
];

const ChecklistFilter = () => {
  return <CommonFilter filters={filterConfig} />;
};

export default ChecklistFilter;
