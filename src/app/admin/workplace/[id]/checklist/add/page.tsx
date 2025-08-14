"use client";
import ChecklistTypeAddForm, {
  TypeAddFormType,
} from "@/components/form/admin/workplace/checklist/add1";
import ChecklistAddForm, {
  ChecklistAddFormType,
} from "@/components/form/admin/workplace/checklist/add2";

import FormLayout from "@/components/layout/form-layout";
import ResultDialog from "@/components/ui/custom/form/result-dialog";
import { useWorkplaceDetailStore } from "@/store/admin/workplace/workplace-detail-store";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const Page = () => {
  const [formResult, setFormResult] = useState<boolean>(false);
  const [newUrl, setNewUrl] = useState<string>("");
  const [curStep, setCurStep] = useState<number>(1);
  const [open, setOpen] = useState<boolean>(false);
  const {
    postAddChecklist,
    setCreateChecklist,
    resetCreateChecklist,
    resetSelectedAvailableChecklistItem,
  } = useWorkplaceDetailStore();
  const { id } = useParams();

  useEffect(() => {
    resetCreateChecklist();
    return () => {
      resetCreateChecklist();
      resetSelectedAvailableChecklistItem();
    };
  }, []);

  //타입 선택
  const handleTypeAddSubmit = (values: TypeAddFormType) => {
    setCreateChecklist(values);
    setCurStep((prev) => prev + 1);
  };

  //최종 생성
  const handleChecklistSubmit = async (values: ChecklistAddFormType) => {
    if (!id) return;
    setCreateChecklist(values);

    const res = await postAddChecklist(id?.toString());
    res.code !== 200 ? setFormResult(false) : setFormResult(true);
    setNewUrl(
      `${id}/checklist/${res.data.serviceTypeSeq}-${res.data.divCodeSeq}-${res.data.divCodeSeq}`
    );
    setCurStep((prev) => prev + 1);
    setOpen(true);
  };

  const formsConfig = {
    titles: ["기본정보", "평가항목"],
    forms: [
      <ChecklistTypeAddForm onNext={handleTypeAddSubmit} />,
      <ChecklistAddForm
        onNext={handleChecklistSubmit}
        onPrev={() => {
          setCurStep((prev) => prev - 1);
        }}
      />,
    ],
  };

  return (
    <>
      <FormLayout
        steps={formsConfig}
        title="체크리스트 생성"
        description="체크리스트 정보"
        curStep={curStep}
      />
      <ResultDialog
        result={formResult}
        open={open}
        setOpen={setOpen}
        successUrl={newUrl}
        successSubUrl={`/admin/workplace/${id}`}
        failedUrl={`/admin/workplace/${id}`}
      />
    </>
  );
};

export default Page;
