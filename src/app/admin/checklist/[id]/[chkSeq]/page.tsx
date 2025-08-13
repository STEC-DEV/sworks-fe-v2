"use client";
import AppTitle from "@/components/common/label/title";
import ChecklistItemEditForm from "@/components/form/admin/checklist/edit";
import { useChecklistDetailStore } from "@/store/admin/checklist/checklist-detail-store";
import { useParams } from "next/navigation";
import React, { useEffect } from "react";

const Page = () => {
  const { setEditChecklistItem, resetEditChecklistItem } =
    useChecklistDetailStore();
  const { chkSeq } = useParams();
  useEffect(() => {
    setItem();

    return () => {
      resetEditChecklistItem();
    };
  }, []);

  const setItem = async () => {
    if (!chkSeq) return;
    await setEditChecklistItem(parseInt(chkSeq.toString()));
  };

  return (
    <>
      <AppTitle title="평가항목 수정" />
      <ChecklistItemEditForm />
    </>
  );
};

export default Page;
