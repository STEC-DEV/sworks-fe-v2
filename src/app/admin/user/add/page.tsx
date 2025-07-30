"use client";
import AdminAddForm, { basicFormType } from "@/components/form/admin/admin-add";
import FormLayout from "@/components/layout/form-layout";
import ResultDialog from "@/components/ui/custom/form/result-dialog";
import { useAdminListStore } from "@/store/admin/admin/admin-list-store";

import React, { useState } from "react";

const Page = () => {
  const [formResult, setFormResult] = useState<boolean>(false);
  const [newSeq, setNewSeq] = useState<number>(-1);
  const [curStep, setCurStep] = useState<number>(1);
  const [open, setOpen] = useState<boolean>(false);
  const { postAddAdmin } = useAdminListStore();

  const handleNext = async (values: basicFormType) => {
    console.log(values);
    const result = await postAddAdmin(values);
    result.code !== 200 ? setFormResult(false) : setFormResult(true);
    setNewSeq(result.data);
    setCurStep((prev) => prev + 1);
    setOpen(true);
  };

  const formsConfig = {
    titles: ["기본정보"],
    forms: [<AdminAddForm onNext={handleNext} />],
  };
  return (
    <>
      <FormLayout
        steps={formsConfig}
        title="관리자 생성"
        description="관리자정보"
        curStep={curStep}
      />
      <ResultDialog
        result={formResult}
        open={open}
        setOpen={setOpen}
        successUrl={newSeq.toString()}
        successSubUrl={"/admin/user"}
        failedUrl={"/admin/user"}
      />
    </>
  );
};

export default Page;
