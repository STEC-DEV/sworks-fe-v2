"use client";
import CustomAccordion from "@/components/common/accordion/custom-accordion";
import { ListCheck } from "lucide-react";
import React from "react";

const ChecklistInfoArea = () => {
  return (
    <CustomAccordion icon={ListCheck} label="체크리스트">
      <div></div>
    </CustomAccordion>
  );
};

export default ChecklistInfoArea;
