import CustomCard from "@/components/common/card";
import { useKpiCards, useSecondCard } from "@/hooks/useDashboard";
import { TodayTaskCount, TodayVocList } from "@/lib/api/dashboard";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// ─── Status Badge ─────────────────────────────────────────────

const statusMap: Record<string, { label: string; className: string }> = {
  완료: { label: "완료", className: "bg-green-50 text-green-800" },
  처리중: { label: "처리중", className: "bg-blue-50 text-blue-800" },
  미처리: { label: "미처리", className: "bg-amber-50 text-amber-800" },
};

function StatusBadge({ statusName }: { statusName: string }) {
  const s = statusMap[statusName] ?? {
    label: statusName,
    className: "bg-gray-50 text-gray-800",
  };
  return (
    <span
      className={`text-xs font-medium px-2 py-0.5 rounded-lg whitespace-nowrap ${s.className}`}
    >
      {s.label}
    </span>
  );
}

// ─── Task Segment Bar ─────────────────────────────────────────

function TaskSegmentBar({ data }: { data?: TodayTaskCount }) {
  const done = data?.completedCount ?? 0;
  const inProgress = data?.inProgressCount ?? 0;
  const notStarted = data?.notStartedCount ?? 0;
  const total = done + inProgress + notStarted;

  const segments = [
    { color: "#1D9E75", label: `완료 ${done}`, flex: done },
    { color: "#378add", label: `진행 ${inProgress}`, flex: inProgress },
    { color: "#e0e0e0", label: `미착수 ${notStarted}`, flex: notStarted },
  ];

  if (total === 0)
    return (
      <div className="text-xs text-description">업무 데이터가 없습니다.</div>
    );

  return (
    <>
      <div className="flex h-2 rounded overflow-hidden gap-0.5 mt-1 mb-1.5">
        {segments.map((s) => (
          <div key={s.label} style={{ flex: s.flex, background: s.color }} />
        ))}
      </div>
      <div className="flex gap-3 mb-3.5">
        {segments.map((s) => (
          <div
            key={s.label}
            className="flex items-center gap-1 text-xs text-description"
          >
            <div
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: s.color }}
            />
            {s.label}
          </div>
        ))}
      </div>
    </>
  );
}

// ─── Voc List ─────────────────────────────────────────────────

function TodayVocItem({ item }: { item: TodayVocList }) {
  return (
    <div className="flex items-center justify-between py-1.5 border-b border-gray-50 last:border-0">
      <div>
        <div className="text-sm text-description">{item.title}</div>
        <div className="text-xs text-description">
          {item.pointName} · {item.createDt}
        </div>
      </div>
      <StatusBadge statusName={item.statusName} />
    </div>
  );
}

// ─── 민원 발생 추이 스켈레톤 ──────────────────────────────────

function VocTransitionSkeleton() {
  return (
    <CustomCard className="flex flex-col p-4 gap-0 border-border-strong">
      {/* 타이틀 */}
      <div className="flex items-center gap-2 mb-2.5">
        <div className="h-4 w-24 bg-gray-100 rounded animate-pulse" />
        <div className="h-3 w-16 bg-gray-100 rounded animate-pulse" />
      </div>

      {/* 차트 영역 */}
      <div className="flex-1 min-h-[250px] flex flex-col justify-end gap-1 px-2">
        {/* y축 라인 흉내 */}
        <div className="flex items-end gap-2 h-full">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex-1 flex flex-col justify-end gap-1">
              <div
                className="w-full bg-gray-100 rounded animate-pulse"
                style={{ height: `${[40, 60, 30, 75, 50, 85][i]}%` }}
              />
            </div>
          ))}
        </div>
        {/* x축 라벨 */}
        <div className="flex gap-2 mt-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="flex-1 h-3 bg-gray-100 rounded animate-pulse"
            />
          ))}
        </div>
      </div>
    </CustomCard>
  );
}

// ─── 금일 업무 현황 스켈레톤 ─────────────────────────────────

function TodayTaskSkeleton() {
  return (
    <CustomCard className="flex flex-col p-4 gap-0 border-border-strong">
      {/* 타이틀 */}
      <div className="h-4 w-24 bg-gray-100 rounded animate-pulse mb-2.5" />

      {/* 세그먼트 바 */}
      <div className="h-2 w-full bg-gray-100 rounded animate-pulse mt-1 mb-1.5" />

      {/* 범례 */}
      <div className="flex gap-3 mb-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-gray-100 animate-pulse" />
            <div className="h-3 w-10 bg-gray-100 rounded animate-pulse" />
          </div>
        ))}
      </div>

      {/* 민원 현황 타이틀 */}
      <div className="h-4 w-24 bg-gray-100 rounded animate-pulse mb-2" />

      {/* 민원 목록 */}
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="flex items-center justify-between py-1.5 border-b border-gray-50 last:border-0"
        >
          <div className="flex flex-col gap-1">
            <div className="h-3.5 w-36 bg-gray-100 rounded animate-pulse" />
            <div className="h-3 w-24 bg-gray-100 rounded animate-pulse" />
          </div>
          <div className="h-5 w-12 bg-gray-100 rounded-lg animate-pulse" />
        </div>
      ))}
    </CustomCard>
  );
}

// ─── SecondSection 스켈레톤 ──────────────────────────────────

function SecondSectionSkeleton() {
  return (
    <div
      className="grid gap-3.5 mb-3.5 items-stretch"
      style={{ gridTemplateColumns: "1.8fr 1fr" }}
    >
      <VocTransitionSkeleton />
      <TodayTaskSkeleton />
    </div>
  );
}

export function SecondSection() {
  const {
    vocTransition,
    todaySiteTaskCount,
    todayVocList,
    isLoading,
    isError,
  } = useSecondCard();

  if (isLoading) return <SecondSectionSkeleton />;

  return (
    <div
      className="grid gap-3.5 mb-3.5 items-stretch"
      style={{ gridTemplateColumns: "1.8fr 1fr" }}
    >
      {/* 민원 발생 추이 */}
      <CustomCard className="flex flex-col p-4 gap-0 border-border-strong">
        <div className="text-sm font-medium text-[#1a2340] mb-2.5">
          민원 발생 추이
          <span className="font-normal text-description ml-1.5">
            최근 6개월
          </span>
        </div>
        <div className="flex-1 min-h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={vocTransition.data}
              margin={{ top: 4, right: 8, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="gradBlue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#378add" stopOpacity={0.18} />
                  <stop offset="100%" stopColor="#378add" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="dates" // ← VocTransition.dates
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
                dataKey="counts" // ← VocTransition.counts
                stroke="#378add"
                strokeWidth={2}
                fill="url(#gradBlue)"
                dot={{ r: 3, fill: "#fff", stroke: "#378add", strokeWidth: 2 }}
                activeDot={{ r: 4 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CustomCard>

      {/* 금일 업무 현황 */}
      <CustomCard className="p-4 gap-0 border-border-strong">
        <div className="text-sm font-medium text-[#1a2340] mb-2.5">
          금일 업무 현황
        </div>

        {/* 세그먼트 바 */}
        <TaskSegmentBar data={todaySiteTaskCount.data} />

        {/* 오늘 민원 현황 */}
        <div className="text-sm font-medium text-[#1a2340] mb-2">
          오늘 민원 현황
        </div>
        {todayVocList.data && todayVocList.data.length > 0 ? (
          todayVocList.data.map((item, i) => (
            <TodayVocItem key={i} item={item} />
          ))
        ) : (
          <div className="text-xs text-description">금일 민원이 없습니다.</div>
        )}
      </CustomCard>
    </div>
  );
}
