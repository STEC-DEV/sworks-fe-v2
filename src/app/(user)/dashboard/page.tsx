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
  const totalTasks = 30;
  const doneTasks = 22;
  const inProgressTasks = 5;
  const waitingTasks = 3;
  const progressPct = Math.round((doneTasks / totalTasks) * 100);

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* ── Header ── */}
      <div className="bg-[#1a2340] px-6 py-3.5 flex items-center justify-between mb-6">
        <div className="flex flex-col gap-0.5">
          <span className="text-base font-lg text-white">대명루센타워</span>
          <span className="text-sm text-white/70">
            이동희 사원 · 마스터 &nbsp;·&nbsp; 보안 · 시설 · 미화 &nbsp;·&nbsp;
            2025.01.23 목
          </span>
        </div>
        <div className="flex items-center gap-2.5">
          <span className="bg-red-500/20 border border-red-400/40 text-red-300 text-xs px-2.5 py-1 rounded-full">
            공지 3건 미확인
          </span>
          <span className="bg-white/10 border border-white/15 text-white/80 text-xs px-2.5 py-1 rounded-full">
            민원 처리중 2건
          </span>
          <div className="w-7 h-7 rounded-full bg-[#378add] flex items-center justify-center text-xs font-medium text-white">
            이동
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="mb-6">
        {/* KPI Row */}
        <KpiSection />
        {/* <div className="grid grid-cols-4 gap-2.5 mb-4">
         
          <Card>
            <div className="text-xs text-description mb-1">
              금일 업무 진행률
            </div>
            <div className="text-2xl font-medium text-[#1a2340]">
              {progressPct}%
            </div>
            <div className="h-1 bg-gray-100 rounded-full my-1.5 overflow-hidden">
              <div
                className="h-1 bg-[#1D9E75] rounded-full"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <div className="text-xs text-description">
              완료 {doneTasks}건 / 전체 {totalTasks}건
            </div>
          </Card>

    
          <Card>
            <div className="text-xs text-description mb-1">금일 민원 발생</div>
            <div className="text-2xl font-medium text-[#1a2340]">5건</div>
            <div className="text-xs text-description mt-1.5">
              처리완료 3 · 처리중{" "}
              <span className="text-amber-600 font-medium">2</span>
            </div>
          </Card>

          <Card>
            <div className="text-xs text-description mb-1">
              이번달 민원 처리율
            </div>
            <div className="text-2xl font-medium text-[#1a2340]">94%</div>
            <div className="flex items-center gap-1.5 text-xs text-description mt-1.5">
              <span className="text-xs font-medium bg-green-50 text-green-800 px-1.5 py-0.5 rounded-lg">
                양호
              </span>
            </div>
          </Card>

     
          <Card>
            <div className="text-xs text-description mb-1">
              이번달 품질 평균
            </div>
            <div className="text-2xl font-medium text-[#1a2340]">
              87.4
              <span className="text-sm text-description font-normal">점</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-description mt-1.5">
              <span className="text-xs font-medium bg-green-50 text-green-800 px-1.5 py-0.5 rounded-lg">
                +2.1pt
              </span>
              전월 대비
            </div>
          </Card>
        </div> */}

        {/* Main Grid */}
        <div
          className="grid gap-3.5 mb-3.5 items-stretch"
          style={{ gridTemplateColumns: "1.8fr 1fr" }}
        >
          {/* 민원 발생 추이 */}
          <Card className="flex flex-col">
            <CardTitle sub="최근 6개월">민원 발생 추이</CardTitle>
            <div className="flex-1 min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={complaintTrendData}
                  margin={{ top: 4, right: 8, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="gradBlue" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="0%"
                        stopColor="#378add"
                        stopOpacity={0.18}
                      />
                      <stop offset="100%" stopColor="#378add" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 11, fill: "var(--description)" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: "var(--description)" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      fontSize: 12,
                      borderRadius: 8,
                      border: "0.5px solid #eee",
                    }}
                    formatter={(v: number) => [`${v}건`, "민원"]}
                  />
                  <Area
                    type="monotone"
                    dataKey="count"
                    stroke="#378add"
                    strokeWidth={2}
                    fill="url(#gradBlue)"
                    dot={{
                      r: 3,
                      fill: "#fff",
                      stroke: "#378add",
                      strokeWidth: 2,
                    }}
                    activeDot={{ r: 4 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* 금일 업무 현황 */}
          <Card>
            <CardTitle>금일 업무 현황</CardTitle>

            {/* 세그먼트 바 */}
            <div className="flex h-2 rounded overflow-hidden gap-0.5 mt-1 mb-1.5">
              <div className="bg-[#1D9E75]" style={{ flex: doneTasks }} />
              <div className="bg-[#378add]" style={{ flex: inProgressTasks }} />
              <div className="bg-gray-200" style={{ flex: waitingTasks }} />
            </div>
            <div className="flex gap-3 mb-3.5">
              {[
                { color: "#1D9E75", label: `완료 ${doneTasks}` },
                { color: "#378add", label: `진행 ${inProgressTasks}` },
                { color: "#e0e0e0", label: `미착수 ${waitingTasks}` },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center gap-1 text-xs text-description"
                >
                  <div
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ background: item.color }}
                  />
                  {item.label}
                </div>
              ))}
            </div>

            {/* 오늘 민원 현황 */}
            <div className="text-sm font-medium text-[#1a2340] mb-2">
              오늘 민원 현황
            </div>
            {todayComplaints.map((c) => (
              <div
                key={c.id}
                className="flex items-center justify-between py-1.5 border-b border-gray-50 last:border-0"
              >
                <div>
                  <div className="text-sm text-description">{c.title}</div>
                  <div className="text-xs text-description">{c.time}</div>
                </div>
                <StatusBadge status={c.status as "done" | "proc" | "wait"} />
              </div>
            ))}
          </Card>
        </div>

        {/* Bottom Grid */}
        <div className="grid grid-cols-3 gap-3.5 items-stretch">
          {/* 품질평가 점수 추이 */}
          <Card className="flex flex-col">
            <CardTitle sub="최근 3개월">품질평가 점수 추이</CardTitle>
            <div className="flex-1 min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={qualityScoreData}
                  margin={{ top: 4, right: 8, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="gradGreen" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="0%"
                        stopColor="#1D9E75"
                        stopOpacity={0.18}
                      />
                      <stop offset="100%" stopColor="#1D9E75" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="period"
                    tick={{ fontSize: 11, fill: "var(--description)" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    domain={[75, 95]}
                    tick={{ fontSize: 11, fill: "var(--description)" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      fontSize: 12,
                      borderRadius: 8,
                      border: "0.5px solid #eee",
                    }}
                    formatter={(v: number) => [`${v}점`, "품질평가"]}
                  />
                  <Area
                    type="monotone"
                    dataKey="score"
                    stroke="#1D9E75"
                    strokeWidth={2}
                    fill="url(#gradGreen)"
                    dot={{
                      r: 3,
                      fill: "#fff",
                      stroke: "#1D9E75",
                      strokeWidth: 2,
                    }}
                    activeDot={{ r: 4 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* 공지사항 */}
          <Card>
            <CardTitle>최근 공지사항</CardTitle>
            {notices.map((n) => (
              <div
                key={n.id}
                className="flex items-start gap-2 py-1.5 border-b border-gray-50 last:border-0"
              >
                <div
                  className="w-1.5 h-1.5 rounded-full mt-1 shrink-0"
                  style={{ background: n.unread ? "#378add" : "#ddd" }}
                />
                <div className="flex-1 min-w-0">
                  <div
                    className={`text-sm truncate ${n.unread ? "text-description" : "text-description opacity-50"}`}
                  >
                    {n.title}
                  </div>
                  <div className="text-xs text-description opacity-70 mt-0.5">
                    {n.date}
                    {n.unread ? " · 읽지않음" : ""}
                  </div>
                </div>
              </div>
            ))}
          </Card>

          {/* 일정 */}
          <Card>
            <CardTitle>오늘 · 내일 일정</CardTitle>
            {schedules.map((s, i) => (
              <div
                key={i}
                className={`flex gap-2 py-1.5 border-b border-gray-50 last:border-0 ${s.day === "tomorrow" ? "opacity-60" : ""}`}
              >
                <div className="text-xs text-description min-w-[32px] pt-0.5">
                  {s.time}
                </div>
                <div
                  className="w-1.5 h-1.5 rounded-full mt-1 shrink-0"
                  style={{ background: s.color }}
                />
                <div>
                  <div className="text-sm text-description">{s.title}</div>
                  <div className="text-xs text-description">
                    {s.location} · {s.day === "today" ? "오늘" : "내일"}
                  </div>
                </div>
              </div>
            ))}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
