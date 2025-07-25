"use client";
import WorkplaceAddForm from "@/components/form/admin/workplace-add";
import FormLayout from "@/components/layout/form-layout";
import ResultDialog from "@/components/ui/custom/form/result-dialog";
import React, { useEffect, useState } from "react";

const Page = () => {
  const [curStep, setCurStep] = useState<number>(1);
  const [open, setOpen] = useState<boolean>(false);

  const handleNext = () => {
    setCurStep((prev) => prev + 1);
    setOpen(true);
  };

  const mockForm = {
    titles: ["기본정보"],
    forms: [<WorkplaceAddForm onNext={handleNext} />],
  };

  return (
    <>
      <FormLayout
        steps={mockForm}
        title="사업장 생성"
        description="사업장정보"
        curStep={curStep}
      />
      <ResultDialog
        result={true}
        open={open}
        setOpen={setOpen}
        successUrl={"1"}
        successSubUrl="/admin/workplace"
        failedUrl="/admin/workplace"
      />
    </>
  );
};

export default Page;
