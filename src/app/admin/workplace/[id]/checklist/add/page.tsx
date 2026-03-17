"use client";
import ChecklistTypeAddForm, {
  TypeAddFormType,
} from "@/components/form/admin/workplace/checklist/add1";
import ChecklistAddForm, {
  ChecklistAddFormType,
} from "@/components/form/admin/workplace/checklist/add2";
import { FormLayout } from "@/components/layout/form/form-layout";

import ResultDialog from "@/components/ui/custom/form/result-dialog";
import { useWorkplaceDetailChecklistStore } from "@/store/admin/workplace/checklist-store";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const Page = () => {
  const [formResult, setFormResult] = useState<boolean>(false);
  const [newUrl, setNewUrl] = useState<string>("");

  const [open, setOpen] = useState<boolean>(false);
  const {
    postAddChecklist,
    setCreateChecklist,
    resetCreateChecklist,
    resetSelectedAvailableChecklistItem,
  } = useWorkplaceDetailChecklistStore();
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
  };

  //최종 생성
  // const handleChecklistSubmit = async (values: ChecklistAddFormType) => {
  const handleChecklistSubmit = async (values: Record<string, any>) => {
    if (!id) return;
    setCreateChecklist(values);

    const res = await postAddChecklist(id?.toString());
    res.code !== 200 ? setFormResult(false) : setFormResult(true);
    setNewUrl(
      `/admin/workplace/${id}/checklist/${res.data.serviceTypeSeq}-${res.data.divCodeSeq}-${res.data.typeCodeSeq}`,
    );

    setOpen(true);
  };

  // const formsConfig = {
  //   titles: ["기본정보", "평가항목"],
  //   forms: [
  //     <ChecklistTypeAddForm onNext={handleTypeAddSubmit} />,
  //     <ChecklistAddForm
  //       onNext={handleChecklistSubmit}
  //       onPrev={() => {
  //         setCurStep((prev) => prev - 1);
  //       }}
  //     />,
  //   ],
  // };

  return (
    <>
      <FormLayout
        steps={[
          {
            label: "기본정보",
            description: "기본정보 입력",
            form: (nav) => (
              <ChecklistTypeAddForm
                onNext={(values) => {
                  setCreateChecklist(values);
                  nav.next();
                }}
              />
            ),
          },
          {
            label: "평가항목",
            description: "평가항목 선택",
            form: (nav) => (
              <ChecklistAddForm
                onPrev={nav.prev}
                onNext={handleChecklistSubmit}
              />
            ),
          },
        ]}
        title="체크리스트 생성"
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
