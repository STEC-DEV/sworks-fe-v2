"use client";
import BuildingInfoAddForm from "@/components/form/normal/building/info-add";
import FormLayout from "@/components/layout/form-layout";
import ResultDialog from "@/components/ui/custom/form/result-dialog";
import { useBuildingStore } from "@/store/normal/building/building";
import { format } from "date-fns";
import React, { useState } from "react";

const Page = () => {
  const { postAddArchitecture } = useBuildingStore();
  const [formResult, setFormResult] = useState<boolean>(false);
  const [curStep, setCurStep] = useState<number>(1);
  const [open, setOpen] = useState<boolean>(false);

  const handleSubmit = async (data: Record<string, any>) => {
    const { completeDt, ...rest } = data;

    const res = await postAddArchitecture({
      ...rest,
      completeDt: format(completeDt, "yyyy-MM-dd"),
    });
    setFormResult(res);
    handleNext();
    setOpen(true);
  };
  const handleNext = () => {
    setCurStep((prev) => prev + 1);
  };

  const formsConfig = {
    titles: ["건축물정보"],
    forms: [<BuildingInfoAddForm onNext={handleSubmit} />],
  };

  return (
    <>
      <FormLayout
        steps={formsConfig}
        title="건축물정보 생성"
        description="건축물정보"
        curStep={curStep}
      />
      <ResultDialog
        result={formResult}
        open={open}
        setOpen={setOpen}
        successUrl={"/workplace"}
        failedUrl="/workplace"
      />
    </>
  );
};

export default Page;
