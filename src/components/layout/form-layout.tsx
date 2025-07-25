"use client";
import React, { useState } from "react";
import AppTitle from "../common/label/title";

import StepBar from "../ui/custom/step-bar";

interface FormLayoutProps {
  title: string;
  description: string;
  steps: Record<string, any>;
  curStep: number;
}

const FormLayout = ({
  title,
  description,
  steps,
  curStep,
}: FormLayoutProps) => {
  return (
    <>
      <AppTitle title={title} />
      <div className="text-[var(--description-light)]">
        <span>{description}</span>를 입력해주세요. 필수항목은
        <span className="text-red-500"> *</span> 로 표시되어있습니다.
      </div>
      <StepBar steps={steps.titles} curStep={curStep} />
      {steps.forms[curStep - 1]}
    </>
  );
};

export default FormLayout;
