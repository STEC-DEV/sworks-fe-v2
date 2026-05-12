"use client";
import { ProcessBadge } from "@/app/(user)/(voc)/voc/_components/item";
import BaseCarousel from "@/components/common/base-carousel";
import BaseSkeleton from "@/components/common/base-skeleton";
import CustomCard from "@/components/common/card";
import AppTitle from "@/components/common/label/title";
import DialogCarousel from "@/components/ui/custom/image/size-carousel";
import { useDecodeParam } from "@/hooks/params";
import { useUIStore } from "@/store/common/ui-store";
import { useVocDetailStore } from "@/store/normal/voc/detail-store";
import { LANGUAGES, Languages } from "@/types/common/term";
import { format } from "date-fns";
import { AlarmClockIcon, CheckCircleIcon, RotateCwIcon } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

export const VOC_DETAIL_TEXT = {
  한국어: {
    pageTitle: "민원조회",
    writer: "작성자",
    titleLabel: "제목",
    contentLabel: "민원내용",
    processStatus: "처리현황",
    consultHours: "상담 업무 시간",
    defaultHours: "평일 09:00 ~ 18:00",
    phoneInquiry: "전화 문의",
    noReply: "아직 등록된 처리 현황이 없습니다",
    statusLabels: { 0: "미처리", 1: "처리중", 2: "처리완료" },
  },
  English: {
    pageTitle: "Request Status",
    writer: "Submitted by",
    titleLabel: "Title",
    contentLabel: "Complaint Details",
    processStatus: "Processing Status",
    consultHours: "Consultation Hours",
    defaultHours: "Weekdays 09:00 ~ 18:00",
    phoneInquiry: "Phone Inquiry",
    noReply: "No updates have been registered yet",
    statusLabels: { 0: "Pending", 1: "In Progress", 2: "Completed" },
  },
} as const satisfies Record<Languages, object>;

const LANG_MAP: Record<string, Languages> = {
  ko: "한국어",
  eng: "English",
};

const Page = () => {
  const { rawValue: code } = useDecodeParam("seq");
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // [추가] lang 파라미터 → language 초기값, 없으면 ko
  const langParam = searchParams.get("lang") ?? "ko";
  const [language, setLanguage] = useState<Languages>(
    LANG_MAP[langParam] ?? "한국어",
  );

  const t = VOC_DETAIL_TEXT[language];

  const { complain, getComplain, loadingKeys } = useVocDetailStore();
  const { isLoading, hasError } = useUIStore();

  useEffect(() => {
    if (!code) return;
    getComplain(code);
  }, [code]);

  // [추가] 탭 변경 시 URL lang 파라미터도 업데이트
  const handleLanguageChange = (lang: Languages) => {
    setLanguage(lang);
    const params = new URLSearchParams(searchParams.toString());
    params.set("lang", lang === "한국어" ? "ko" : "eng");
    router.replace(`${pathname}?${params.toString()}`);
  };

  if (isLoading(loadingKeys.COMPLAIN) || !complain) return <div></div>;
  if (hasError(loadingKeys.COMPLAIN)) return <div>에러 발생</div>;

  return (
    <div className="flex justify-center h-screen overflow-hidden">
      <div className="flex flex-col gap-6 w-full xl:max-w-[769px] xl:border py-6 h-full bg-white shadow-xl overflow-auto">
        <div className="px-6 shrink-0">
          {/* [추가] 언어탭 */}
          <div className="flex justify-end mb-2">
            <div className="flex items-center bg-gray-200 dark:bg-zinc-700 rounded-lg p-0.5 w-fit">
              {LANGUAGES.map((v, i) => (
                <div
                  key={i}
                  onClick={() => handleLanguageChange(v)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium cursor-pointer transition-all
                    ${
                      language === v
                        ? "bg-white dark:bg-zinc-950 text-[#1a2340] dark:text-white shadow-sm font-semibold"
                        : "text-gray-400 dark:text-zinc-500"
                    }`}
                >
                  {v}
                </div>
              ))}
            </div>
          </div>
          <AppTitle title={t.pageTitle} isBorder />
        </div>
        <div className="flex flex-col gap-12">
          <Log data={complain.logs} t={t} />

          <div className="flex px-6 flex-col gap-4">
            <div className="pb-4 border-b-2 border-border text-md font-semibold">
              {t.processStatus}
            </div>
            <div className="border-2 p-2 border-primary rounded-[4px] bg-background text-sm">
              <div>
                <span>{t.consultHours} : </span>
                <span className="font-semibold">
                  {complain.clients.comments || t.defaultHours}
                </span>
              </div>
              <div>
                <span>{t.phoneInquiry} : </span>
                <span className="font-semibold">{complain.clients.tel}</span>
              </div>
            </div>
            {complain.replys.length > 0 ? (
              complain.replys.map((v, i) => <Reply key={i} data={v} t={t} />)
            ) : (
              <span className="text-sm text-[var(--description-light)]">
                {t.noReply}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;

const Log = ({
  data,
  t,
}: {
  data: LogInfo;
  t: (typeof VOC_DETAIL_TEXT)[Languages];
}) => {
  return (
    <div className="px-6 flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <span className="text-sm text-[var(--description)]">{t.writer}</span>
        <span className="text-sm">{data.createUser}</span>
      </div>
      <div className="h-0.25 w-full bg-border" />
      <div className="flex flex-col gap-1">
        <span className="text-sm text-[var(--description)]">
          {t.titleLabel}
        </span>
        <span className="text-sm">{data.title}</span>
      </div>
      <div className="h-0.25 w-full bg-border" />
      <div className="flex flex-col gap-1">
        <span className="text-sm text-[var(--description)]">
          {t.contentLabel}
        </span>
        <span className="text-sm">{data.content}</span>
      </div>
      <DialogCarousel pathList={data.attaches.map((v) => v.path)} isSmall />
    </div>
  );
};

const Reply = ({
  data,
  t,
}: {
  data: VocReply;
  t: (typeof VOC_DETAIL_TEXT)[Languages];
}) => {
  const status = () => {
    switch (data.status) {
      case 0:
        return (
          <ProcessBadge
            label={t.statusLabels[0]}
            icon={AlarmClockIcon}
            style="bg-gray-400 w-fit px-2"
          />
        );
      case 1:
        return (
          <ProcessBadge
            label={t.statusLabels[1]}
            icon={RotateCwIcon}
            style="bg-green-500 w-fit px-2"
          />
        );
      case 2:
        return (
          <ProcessBadge
            label={t.statusLabels[2]}
            icon={CheckCircleIcon}
            style="bg-blue-500 w-fit px-2"
          />
        );
    }
  };
  return (
    <CustomCard className="gap-4" size={"sm"}>
      <div className="flex justify-between items-center">
        <span className="text-xs">{data.createUser}</span>
        <span className="text-xs text-[var(--description-light)]">
          {format(data.createDt, "yyyy-MM-dd HH:mm:ss")}
        </span>
      </div>
      <span className="text-sm">{status()}</span>
      {data.attaches.length > 0 && (
        <DialogCarousel pathList={data.attaches.map((v) => v.path)} isSmall />
      )}

      <span className="text-sm">{data.content}</span>
    </CustomCard>
  );
};
