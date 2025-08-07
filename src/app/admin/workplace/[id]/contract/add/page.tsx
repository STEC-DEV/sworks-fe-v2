"use client";
import ContractAddForm from "@/components/form/admin/workplace/contract-add";
import FormLayout from "@/components/layout/form-layout";
import React, { useState } from "react";

const Page = () => {
  const [formResult, setFormResult] = useState<boolean>(false);
  const [newSeq, setNewSeq] = useState<number>(-1);
  const [curStep, setCurStep] = useState<number>(1);
  const [open, setOpen] = useState<boolean>(false);

  const handleNext = async (values: Record<string, any>) => {
    //   const result = await postAddWorkplace(values);
    //   result.code !== 200 ? setFormResult(false) : setFormResult(true);
    //   setNewSeq(result.data);
    setCurStep((prev) => prev + 1);
    setOpen(true);
  };

  const forms = {
    titles: ["기본정보"],
    forms: [<ContractAddForm onNext={handleNext} />],
  };
  return (
    <>
      <FormLayout
        steps={forms}
        title="계약정보 생성"
        description="계약정보"
        curStep={curStep}
      />
    </>
  );
};

export default Page;
