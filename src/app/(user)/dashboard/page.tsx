"use client";

import React from "react";

import { useAuthStore } from "@/store/auth/auth-store";
import { format } from "date-fns/format";
import { ko } from "date-fns/locale";
import VocTrendChart from "./_components/VocTrendChart";
import QeTrendChart from "./_components/QeTrendChart";
import TodayTaskChart from "./_components/TodayTaskChart";
import ScheduleCard from "./_components/ScheduleCard";
import NoticeCard from "./_components/NoticeCard";
import TodayVocKpi from "./_components/TodayVocKpi";
import MonthVocKpi from "./_components/MonthVocKpi";

// ─── Main Page ───────────────────────────────────────────────

const DashboardPage = () => {
  const { loginProfile, enteredWorkplace } = useAuthStore();

  return (
    <div className="flex flex-col flex-1 ">
      {/* ── Header ── */}

      <div className="space-y-1 mb-8 shrink-0">
        <div>
          <span className="text-2xl font-extrabold">
            안녕하세요, {loginProfile?.userName}님
          </span>
          <span className="text-xl font-bold text-description-light">
            · {enteredWorkplace?.siteName}
          </span>
        </div>
        <div className="flex items-center justify-between text-description">
          <span>오늘도 안전한 하루 되세요.</span>
          <span>{format(new Date(), "yyyy.MM.dd  EEEE", { locale: ko })}</span>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="flex-1 min-h-0 xl:flex gap-6">
        {/* 왼쪽 - min-h-0 추가, 브라켓 추가 */}
        <div className="xl:flex-[8]  xl:grid xl:grid-cols-3 xl:grid-rows-5 gap-6">
          <VocTrendChart className="col-span-3 row-span-3 " />
          {/* <TodayVocKpi className="col-start-1 row-start-4 col-span-1 row-span-1" />
          <MonthVocKpi className="col-start-1 row-start-5 col-span-1 row-span-1" /> */}

          <QeTrendChart className="col-span-2 row-span-2" />
        </div>

        {/* 오른쪽 - 브라켓 추가 */}
        <div className="xl:flex-[3]  xl:flex xl:flex-col xl:gap-6">
          {/* <TodayTaskChart className="flex-1" />
          <NoticeCard className="flex-2" />
          <ScheduleCard className="flex-3" /> */}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
