"use client";
import RnMAddForm from "@/components/form/normal/facility/rnm/add";
import FormLayout from "@/components/layout/form-layout";
import React, { useState } from "react";

const Page = () => {
  const [formResult, setFormResult] = useState<boolean>(false);
  const [newSeq, setNewSeq] = useState<number>(-1);
  const [curStep, setCurStep] = useState<number>(1);
  const [open, setOpen] = useState<boolean>(false);
  const formsConfig = {
    titles: ["기본정보"],
    forms: [
      <RnMAddForm
        onNext={(values: any) => {
          console.log(values);
        }}
      />,
    ],
  };
  return (
    <>
      <FormLayout
        steps={formsConfig}
        title="R&M 생성"
        description="R&M정보"
        curStep={curStep}
      />
    </>
  );
};

export default Page;
