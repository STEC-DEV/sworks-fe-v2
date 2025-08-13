"use client";
import ChecklistItemAddForm from "@/components/form/admin/checklist/add";
import FormLayout from "@/components/layout/form-layout";
import ResultDialog from "@/components/ui/custom/form/result-dialog";
import { useChecklistDetailStore } from "@/store/admin/checklist/checklist-detail-store";
import { useParams } from "next/navigation";
import React, { useState } from "react";

const Page = () => {
  const [formResult, setFormResult] = useState<boolean>(false);
  const [newSeq, setNewSeq] = useState<number>(-1);
  const [curStep, setCurStep] = useState<number>(1);
  const [open, setOpen] = useState<boolean>(false);
  const { postAddChecklistItem } = useChecklistDetailStore();
  const { id } = useParams();

  const handleSubmit = async (values: Record<string, any>) => {
    const result = await postAddChecklistItem(values);
    result.code !== 200 ? setFormResult(false) : setFormResult(true);
    setNewSeq(result.data);
    setCurStep((prev) => prev + 1);
    setOpen(true);
  };
  const formsConfig = {
    titles: ["평가항목"],
    forms: [<ChecklistItemAddForm onNext={handleSubmit} />],
  };

  return (
    <>
      <FormLayout
        title="평가항목 생성"
        description="평가항목 정보"
        steps={formsConfig}
        curStep={curStep}
      />
      <ResultDialog
        result={formResult}
        open={open}
        setOpen={setOpen}
        successUrl={`/admin/checklist/${id}`}
        failedUrl={`/admin/checklist/${id}`}
      />
    </>
  );
};

export default Page;
