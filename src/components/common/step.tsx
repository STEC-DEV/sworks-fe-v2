import React from "react";

type StepStatus = "COMPLETE" | "ACTIVE" | "INCOMPLETE";

export interface StepProps {
  stepNum: number;
  label: string;
  curStep: number;
}

const Step = ({ stepNum, label, curStep }: StepProps) => {
  return (
    <div className="flex flex-col items-center gap-2 justify-center">
      <div
        className={`flex items-center justify-center w-10 h-10 rounded-[50px] ${
          stepNum <= curStep ? "bg-blue-500" : "bg-[var(--background)]"
        }`}
      >
        <span
          className={`text-sm ${
            stepNum <= curStep ? "text-white" : "text-black"
          }`}
        >
          {stepNum.toString()}
        </span>
      </div>

      <span
        className={`text-sm ${
          stepNum <= curStep
            ? "text-blue-500"
            : "text-[var(--description-dark)]"
        }`}
      >
        {label}
      </span>
    </div>
  );
};

export default Step;
