"use client";
import ChecklistTypeAddForm, {
  TypeAddFormType,
} from "@/components/form/admin/workplace/checklist/add1";
import ChecklistAddForm from "@/components/form/admin/workplace/checklist/add2";
import FormLayout from "@/components/layout/form-layout";
import { useWorkplaceDetailStore } from "@/store/admin/workplace/workplace-detail-store";
import React, { useEffect, useState } from "react";

const Page = () => {
  const [formResult, setFormResult] = useState<boolean>(false);
  const [newSeq, setNewSeq] = useState<number>(-1);
  const [curStep, setCurStep] = useState<number>(1);
  const [open, setOpen] = useState<boolean>(false);
  const {
    setCreateChecklist,
    resetCreateChecklist,
    resetSelectedAvailableChecklistItem,
  } = useWorkplaceDetailStore();

  useEffect(() => {
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
  const handleChecklistSubmit = () => {};

  const formsConfig = {
    titles: ["기본정보", "평가항목"],
    forms: [
      <ChecklistTypeAddForm onNext={handleTypeAddSubmit} />,
      <ChecklistAddForm
        onNext={() => {}}
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
    </>
  );
};

export default Page;
