"use client";

import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { KpiSection } from "./_components/KpiSection";
import { SecondSection } from "./_components/SecondSection";
import { ThirdSection } from "./_components/ThridSection";
import { useAuthStore } from "@/store/auth/auth-store";
import { format } from "date-fns/format";
import { ko } from "date-fns/locale";

// ─── Mock Data ───────────────────────────────────────────────
const complaintTrendData = [
  { month: "8월", count: 12 },
  { month: "9월", count: 9 },
  { month: "10월", count: 15 },
  { month: "11월", count: 7 },
  { month: "12월", count: 11 },
  { month: "1월", count: 5 },
];

const qualityScoreData = [
  { period: "11/1차", score: 82 },
  { period: "11/2차", score: 85 },
  { period: "12/1차", score: 83 },
  { period: "12/2차", score: 86 },
  { period: "1/1차", score: 85 },
  { period: "1/2차", score: 87 },
];

const todayComplaints = [
  { id: 1, title: "누수 신고 (B2 기계실)", time: "09:14 접수", status: "done" },
  { id: 2, title: "조명 교체 요청 (5층)", time: "11:32 접수", status: "proc" },
  { id: 3, title: "주차 민원 (지상 1층)", time: "14:05 접수", status: "proc" },
];

const notices = [
  { id: 1, title: "1월 청소 일정 변경 안내", date: "01.23", unread: true },
  { id: 2, title: "겨울철 동파 예방 조치 지침", date: "01.21", unread: true },
  { id: 3, title: "설 연휴 비상 연락망 업데이트", date: "01.20", unread: true },
  { id: 4, title: "2025년 1월 운영 계획 공유", date: "01.15", unread: false },
  { id: 5, title: "12월 품질 평가 결과 공지", date: "01.10", unread: false },
];

const schedules = [
  {
    time: "09:00",
    title: "보안 순찰 점검",
    location: "B1 주차장",
    day: "today",
    color: "#378add",
  },
  {
    time: "14:00",
    title: "시설 정기 점검",
    location: "3층 전기실",
    day: "today",
    color: "#1D9E75",
  },
  {
    time: "10:00",
    title: "청소 품질 평가",
    location: "전 층 공용부",
    day: "tomorrow",
    color: "#BA7517",
  },
  {
    time: "15:30",
    title: "소방 설비 점검",
    location: "옥상",
    day: "tomorrow",
    color: "#D85A30",
  },
];

// ─── Sub Components ──────────────────────────────────────────

const statusMap = {
  done: { label: "처리완료", className: "bg-green-50 text-green-800" },
  proc: { label: "처리중", className: "bg-blue-50 text-blue-800" },
  wait: { label: "대기중", className: "bg-amber-50 text-amber-800" },
};

function StatusBadge({ status }: { status: "done" | "proc" | "wait" }) {
  const s = statusMap[status];
  return (
    <span
      className={`text-xs font-medium px-2 py-0.5 rounded-lg whitespace-nowrap ${s.className}`}
    >
      {s.label}
    </span>
  );
}

function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`bg-white border border-border-strong rounded-xl p-4 shadow-sm ${className}`}
    >
      {children}
    </div>
  );
}

function CardTitle({
  children,
  sub,
}: {
  children: React.ReactNode;
  sub?: string;
}) {
  return (
    <div className="flex items-center gap-1.5 text-sm font-medium text-[#1a2340] mb-2.5">
      {children}
      {sub && <span className="font-normal text-description">{sub}</span>}
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────

const DashboardPage = () => {
  const { loginProfile } = useAuthStore();
  const totalTasks = 30;
  const doneTasks = 22;
  const inProgressTasks = 5;
  const waitingTasks = 3;
  const progressPct = Math.round((doneTasks / totalTasks) * 100);

  return (
    <div className="bg-gray-50 ">
      {/* ── Header ── */}
      <div className="bg-[#1a2340] px-6 py-3.5 flex items-center justify-between mb-6">
        <div className="flex flex-col gap-0.5">
          <span className="text-lg font-medium text-white">대명루센타워</span>
          <span className="text-sm text-white/70">
            {loginProfile?.userName} {loginProfile?.job} · {loginProfile?.role}{" "}
            {/* &nbsp;·&nbsp; 보안 · 시설 · 미화 &nbsp;·&nbsp;{" "} */}
            {/* {format(new Date(), "yyyy.MM.dd EEEE", { locale: ko })} */}
          </span>
        </div>
        <div>
          <span className="text-white font-medium">
            {" "}
            {format(new Date(), "yyyy.MM.dd  EEEE", { locale: ko })}
          </span>
        </div>
        {/* <div className="flex items-center gap-2.5">
          <span className="bg-red-500/20 border border-red-400/40 text-red-300 text-xs px-2.5 py-1 rounded-full">
            공지 3건 미확인
          </span>
          <span className="bg-white/10 border border-white/15 text-white/80 text-xs px-2.5 py-1 rounded-full">
            민원 처리중 2건
          </span>
          <div className="w-7 h-7 rounded-full bg-[#378add] flex items-center justify-center text-xs font-medium text-white">
            이동
          </div>
        </div> */}
      </div>

      {/* ── Body ── */}
      <div className="">
        {/* KPI Row */}
        <KpiSection />
        {/* 2nd */}
        <SecondSection />
        {/* 3rd */}
        <ThirdSection />
      </div>
    </div>
  );
};

export default DashboardPage;
