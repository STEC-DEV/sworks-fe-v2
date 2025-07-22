"use client";
import CommonFilter, {
  FilterConfig,
} from "@/components/ui/custom/filter.tsx/common-filter";
import { WorkType } from "@/types/admin/workplace/workplace-filter";
import { ReceiptText } from "lucide-react";
import React from "react";
const filterConfig: FilterConfig[] = [
  {
    key: "serviceType",
    placeholder: "계약유형",
    data: WorkType,
    icon: ReceiptText,
  },
];

const WorkplaceFilter = () => {
  return <CommonFilter filters={filterConfig} />;
};

export default WorkplaceFilter;
