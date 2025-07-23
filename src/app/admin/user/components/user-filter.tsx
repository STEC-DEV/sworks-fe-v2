"use client";
import CommonFilter, {
  FilterConfig,
} from "@/components/ui/custom/filter.tsx/common-filter";
import {
  ContractServiceType,
  SiteServiceType,
} from "@/types/admin/workplace/workplace-filter";
import { BriefcaseBusiness, KeyRound, ReceiptText } from "lucide-react";
import React from "react";
const filterConfig: FilterConfig[] = [
  {
    key: "department",
    placeholder: "부서",
    data: ContractServiceType,
    icon: BriefcaseBusiness,
  },
  {
    key: "permission",
    placeholder: "권한",
    data: SiteServiceType,
    icon: KeyRound,
  },
];

const AdminFilter = () => {
  return <CommonFilter filters={filterConfig} />;
};

export default AdminFilter;
