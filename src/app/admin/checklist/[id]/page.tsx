"use client";

import { useChecklistDetailStore } from "@/store/admin/checklist/checklist-detail-store";
import { useParams } from "next/navigation";
import React, { useEffect } from "react";
import ChecklistInfo from "./_components/checklist-info";

import ChecklistArea from "./_components/checklist-area";

const Page = () => {
  const { id } = useParams();
  const { getChecklistDetail } = useChecklistDetailStore();

  useEffect(() => {
    if (!id) return;
    getChecklistDetail(id?.toString());
  }, []);

  return (
    <>
      <ChecklistInfo />
      <ChecklistArea />
    </>
  );
};

export default Page;
