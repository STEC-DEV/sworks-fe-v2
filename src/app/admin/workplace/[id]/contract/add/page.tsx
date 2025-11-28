"use client";
import ContractAddForm, {
  basicFormType,
} from "@/components/form/admin/workplace/contract-add";
import FormLayout from "@/components/layout/form-layout";
import ResultDialog from "@/components/ui/custom/form/result-dialog";
import { useWorkplaceDetailContractStore } from "@/store/admin/workplace/contract-store";

import { format } from "date-fns";
import { useParams } from "next/navigation";
import React, { useState } from "react";

const Page = () => {
  const [formResult, setFormResult] = useState<boolean>(false);
  const [curStep, setCurStep] = useState<number>(1);
  const [open, setOpen] = useState<boolean>(false);
  const { postAddContract } = useWorkplaceDetailContractStore();
  const { id } = useParams();

  const handleNext = async (values: basicFormType) => {
    const addData = {
      ...values,
      startDt: format(values.startDt, "yyyy-MM-dd"),
      siteSeq: id,
    };

    const res = await postAddContract(addData);

    setFormResult(res.code === 200 ? true : false);
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
      <ResultDialog
        result={formResult}
        open={open}
        setOpen={setOpen}
        successUrl={`/admin/workplace/${id}`}
        failedUrl={`/admin/workplace/${id}`}
      />
    </>
  );
};

export default Page;
