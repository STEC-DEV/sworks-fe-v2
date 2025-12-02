"use client";
import AppTitle from "@/components/common/label/title";
import React, { Suspense, useCallback, useEffect, useState } from "react";
import ComplainAddForm from "./_components/add";
import BaseSkeleton from "@/components/common/base-skeleton";
import { useSearchParams } from "next/navigation";
import Button from "@/components/common/button";
import { CircleCheck } from "lucide-react";

const ComplainAddContent = () => {
  const searchParams = useSearchParams();

  const seq = searchParams.get("vocSeq");
  if (!seq) return <BaseSkeleton />;
  return <ComplainAddForm seq={parseInt(seq)} />;
};

const Page = () => {
  const [agree, setAgree] = useState<boolean>(false);
  const [step, setStep] = useState<number>(0);

  useEffect(() => {}, [agree]);

  const handleAgree = (agree: boolean) => {
    setAgree(agree);
  };

  const handleNext = () => {
    setStep((prev) => prev + 1);
  };

  const view = () => {
    switch (step) {
      case 0:
        return (
          <ToS isAgree={agree} onAgree={handleAgree} onNext={handleNext} />
        );
      case 1:
        return <ComplainAddContent />;
    }
  };
  return (
    <div className="flex justify-center h-screen overflow-hidden">
      <div className="flex flex-col gap-6 w-full xl:max-w-[769px] xl:border py-6 h-full bg-white shadow-xl overflow-auto">
        <div className="px-6 shrink-0">
          <AppTitle title="민원접수" isBorder />
        </div>

        <Suspense fallback={<BaseSkeleton />}>
          {view()}
          {/* <ComplainAddContent /> */}
        </Suspense>
      </div>
    </div>
  );
};

export default Page;

export interface TermSection {
  title: string;
  content: string | string[];
  subSections?: TermSection[];
}

export interface Term {
  id: string;
  title: string;
  isRequired: boolean;
  sections: TermSection[];
  version?: string;
  effectiveDate?: string;
}

export const PRIVACY_TERMS: Term = {
  id: "privacy",
  title: "개인정보 수집 및 이용 동의",
  isRequired: true,
  version: "1.0",
  effectiveDate: "2024-01-01",
  sections: [
    {
      title: "수집하는 개인정보의 항목",
      content: "",
      subSections: [
        {
          title:
            "가. 회사는 고객님의 질문에 대한 답변을 위해 아래와 같은 개인정보를 수집하고 있습니다.",
          content: "- 필수항목 : 상호명, 소재지, 휴대폰 번호, 이메일",
        },
        {
          title:
            "나. 서비스 이용과정에서 아래와 같은 정보들이 자동으로 생성되어 수집될 수 있습니다.",
          content: "- IP Address, 쿠키, 방문 일시, 서비스 이용 기록",
        },
      ],
    },
    {
      title: "개인정보의 수집 및 이용 목적",
      content: "",
      subSections: [
        {
          title: "가. 질문에 대한 답변",
          content:
            "- 질문에 대한 답변, 본인확인, 개인식별, 기타 답변을 위한 기본자료 활용",
        },
      ],
    },
    {
      title: "개인정보의 보유 및 이용기간",
      content:
        "이용자의 개인정보는 원칙적으로 개인정보의 수집 및 이용목적이 달성되면 지체 없이 파기합니다.\n단, 다음의 정보에 대해서는 아래의 이유로 명시한 기간 동안 보존합니다.",
      subSections: [
        {
          title: "가. 회사 내부 방침에 의한 정보보유 사유",
          content: [
            "부정이용기록 - 보존 근거: 부정 이용 방지, 보존 기간: 1년",
            "본인확인에 관한 기록 - 보존 근거: 정보통신 이용촉진 및 정보보호 등에 관한 법률, 보존 기간: 6개월",
          ],
        },
      ],
    },
  ],
};

const ToS = ({
  isAgree,
  onAgree,
  onNext,
}: {
  isAgree: boolean;
  onAgree: (agree: boolean) => void;
  onNext: () => void;
}) => {
  return (
    <div className="px-6 flex flex-col gap-6 flex-1">
      <span className="text-lg font-medium">{PRIVACY_TERMS.title}</span>

      <div className="flex flex-col gap-6 flex-1">
        {PRIVACY_TERMS.sections.map((s, i) => (
          <Section data={s} key={i} />
        ))}
      </div>
      <div className="flex gap-2 items-center">
        <span>개인정보 수집 및 이용 동의 (필수)</span>
        <label>
          <CircleCheck
            className={`cursor-pointer ${
              isAgree ? "text-blue-500" : "text-[var(--icon)] "
            } `}
            onClick={() => onAgree(!isAgree)}
            strokeWidth={1.5}
          />
        </label>
      </div>
      <Button
        label="다음"
        variant={isAgree ? "default" : "disabled"}
        onClick={onNext}
      />
    </div>
  );
};

const Section = ({ data }: { data: TermSection }) => {
  return (
    <div className="flex flex-col gap-4">
      <span className="text-md font-medium">{data.title}</span>
      {data.content && <span className="text-sm">{data.content}</span>}

      <div className="flex flex-col gap-2">
        {data.subSections?.map((s, i) => (
          <div key={i} className="flex flex-col gap-2">
            <span className="text-sm">{s.title}</span>
            <div className="flex flex-col gap-1">
              {Array.isArray(s.content) &&
                s.content.map((item, i) => (
                  <span className="text-sm" key={i}>
                    {item}
                  </span>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
