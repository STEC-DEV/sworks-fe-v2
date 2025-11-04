"use client";
import IconButton from "@/components/common/icon-button";
import AppTitle from "@/components/common/label/title";
import React from "react";
import ChkAccordion from "./chk-accordion";
import { useChecklistDetailStore } from "@/store/admin/checklist/checklist-detail-store";
import { useParams, useRouter } from "next/navigation";

const ChecklistArea = () => {
  const { checklistDetail } = useChecklistDetailStore();
  const { id } = useParams();
  const router = useRouter();
  return (
    <>
      <div className="flex justify-between items-center w-150">
        <AppTitle title="평가항목" />
        <IconButton
          icon="Plus"
          size={16}
          onClick={() => router.push(`${id}/add`)}
        />
      </div>
      <div className="w-150 flex flex-col gap-4">
        {checklistDetail?.mains.map((v, i) => (
          <ChkAccordion key={i} data={v} />
        ))}
      </div>
    </>
  );
};

export default ChecklistArea;
