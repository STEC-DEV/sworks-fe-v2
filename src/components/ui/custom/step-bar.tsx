import Step, { StepProps } from "@/components/common/step";
import React, { useState } from "react";

interface StepBarProps {
  steps: string[];
  curStep: number;
}

const StepBar = ({ steps, curStep }: StepBarProps) => {
  return (
    <div className="flex justify-center w-full">
      <div className="flex gap-24">
        {steps.map((v, i) => (
          <Step key={i} stepNum={i + 1} label={v} curStep={curStep} />
        ))}
      </div>
    </div>
  );
};

export default StepBar;
