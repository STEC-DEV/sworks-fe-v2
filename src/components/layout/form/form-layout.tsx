"use client";

import { useState } from "react";

/* ─────────────────────────────────────────
   타입
───────────────────────────────────────── */
interface StepNav {
  next: () => void;
  prev: () => void;
  curStep: number;
  totalSteps: number;
  isFirst: boolean;
  isLast: boolean;
}

interface StepConfig {
  label: string;
  description?: string; // 사이드바 서브텍스트 (선택)
  form: (nav: StepNav) => React.ReactNode; // nav 주입
}

interface FormLayoutProps {
  title: string;
  steps: StepConfig[];
  onComplete?: () => void; // 마지막 단계 완료 후 콜백 (선택)
  defaultStep?: number;
}

/* ─────────────────────────────────────────
   FormLayout
───────────────────────────────────────── */
export const FormLayout = ({
  title,
  steps,
  defaultStep = 1,
}: FormLayoutProps) => {
  const [curStep, setCurStep] = useState<number>(defaultStep);

  const nav: StepNav = {
    next: () => setCurStep((prev) => Math.min(prev + 1, steps.length)),
    prev: () => setCurStep((prev) => Math.max(prev - 1, 1)),
    curStep,
    totalSteps: steps.length,
    isFirst: curStep === 1,
    isLast: curStep === steps.length,
  };

  const currentStep = steps[curStep - 1];

  return (
    <div className="xl:-mx-8 xl:-my-12 flex flex-1 min-h-0">
      <div className="flex flex-1 min-h-0 flex-col gap-6 xl:flex-row">
        {/* ── 스텝 패널 ── */}
        <StepPanel title={title} steps={steps} curStep={curStep} />

        {/* ── 폼 영역 ── */}
        <div className="flex-1 overflow-y-auto xl:p-6">
          <div className="flex flex-col gap-6 ">{currentStep.form(nav)}</div>
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────
   StepPanel — xl: 좌측 사이드바 / 이하: 상단 가로
───────────────────────────────────────── */
const StepPanel = ({
  title,
  steps,
  curStep,
}: {
  title: string;
  steps: StepConfig[];
  curStep: number;
}) => {
  const progress = Math.round((curStep / steps.length) * 100);

  return (
    <div
      className="
      bg-surface border-border
      flex-shrink-0
      flex flex-row items-center justify-between gap-4
      border px-4 py-3
      xl:flex-col xl:items-start xl:justify-start xl:gap-6
      xl:w-[240px] xl:border-b-0 xl:border-r
      xl:px-6 xl:py-6 xl:min-h-0 xl:overflow-y-auto
    "
    >
      {/* 타이틀 — xl에서만 표시 */}
      <div className="hidden xl:flex flex-col gap-1">
        <h1 className="text-sm font-bold text-primary">{title}</h1>
        <p className="text-xs text-description-light">
          필수항목 <span className="text-destructive">*</span> 을 모두
          입력해주세요.
        </p>
      </div>

      {/* 스텝 목록 — xl: 세로 / 이하: 가로 */}
      <div
        className="
        flex flex-row items-center gap-0
        xl:flex-col xl:items-start xl:gap-0 xl:w-full xl:relative
      "
      >
        {/* 세로 연결선 (xl only) */}
        <div
          className="
          hidden xl:block
          absolute left-[11px] top-6 w-0.5 bg-border
        "
          style={{ height: `calc(100% - 48px)` }}
        />

        {steps.map((step, i) => {
          const stepNum = i + 1;
          const isDone = stepNum < curStep;
          const isActive = stepNum === curStep;

          return (
            <div key={i} className="flex items-center gap-0 xl:gap-0">
              {/* 가로 연결선 (xl 미만) */}
              {i > 0 && (
                <div
                  className={`
                  block xl:hidden h-0.5 w-8
                  ${isDone ? "bg-primary" : "bg-border"}
                `}
                />
              )}

              <div className="flex flex-col xl:flex-row items-center xl:items-center gap-1 xl:gap-3 xl:py-2.5 xl:relative xl:z-10">
                {/* 원 */}
                <div
                  className={`
                  w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0
                  ${isDone ? "bg-primary text-primary-foreground" : ""}
                  ${isActive ? "bg-primary text-primary-foreground ring-4 ring-primary/20" : ""}
                  ${!isDone && !isActive ? "bg-background border border-border text-description-light" : ""}
                `}
                >
                  {isDone ? "✓" : stepNum}
                </div>

                {/* 텍스트 */}
                <div className="hidden xl:flex flex-col gap-0.5">
                  <span
                    className={`text-xs font-bold ${isActive ? "text-primary" : isDone ? "text-description" : "text-description-light"}`}
                  >
                    {step.label}
                  </span>
                  {step.description && (
                    <span className="text-xs text-description-light">
                      {step.description}
                    </span>
                  )}
                </div>

                {/* 모바일 — 활성 단계만 레이블 표시 */}
                {isActive && (
                  <span className="block xl:hidden text-xs font-bold text-primary">
                    {step.label}
                  </span>
                )}
              </div>

              {/* 가로 연결선 (xl 미만, 마지막 제외) */}
              {i < steps.length - 1 && (
                <div
                  className={`
                  block xl:hidden h-0.5 w-8
                  ${isActive || isDone ? "bg-primary" : "bg-border"}
                `}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* 진행률 — xl에서만 */}
      <div className="hidden xl:flex flex-col gap-1.5 w-full mt-auto pt-4 border-t border-border">
        <div className="flex justify-between items-center">
          <span className="text-xs text-description-light">진행률</span>
          <span className="text-xs font-bold text-primary">
            {curStep} / {steps.length}
          </span>
        </div>
        <div className="h-1.5 bg-border rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};
