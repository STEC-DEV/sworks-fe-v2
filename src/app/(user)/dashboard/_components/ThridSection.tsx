import CustomCard from "@/components/common/card";
import { useKpiCards, useThirdCard } from "@/hooks/useDashboard";
import { DashNotice, DashSch } from "@/lib/api/dashboard";
import { format, isPast, isToday, parse } from "date-fns";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

function formatTime(time: string) {
  // "09:30:00" → Date 객체로 변환 후 "09:30" 형식으로
  return format(parse(time, "HH:mm:ss", new Date()), "HH:mm");
}

function isPastSchedule(dates: string, endTime: string) {
  // "2025-01-23" + "09:30:00" → Date 객체로 합쳐서 비교
  return isPast(
    parse(`${dates} ${endTime}`, "yyyy-MM-dd HH:mm:ss", new Date()),
  );
}

// ─── 품질평가 점수 추이 스켈레톤 ─────────────────────────────

function QeTransitionSkeleton() {
  return (
    <CustomCard className="flex flex-col p-4 gap-0 border-border-strong">
      {/* 타이틀 */}
      <div className="flex items-center gap-2 mb-2.5">
        <div className="h-4 w-28 bg-gray-100 rounded animate-pulse" />
        <div className="h-3 w-16 bg-gray-100 rounded animate-pulse" />
      </div>

      {/* 차트 영역 */}
      <div className="flex-1 min-h-[180px] flex flex-col justify-end gap-1 px-2">
        <div className="flex items-end gap-2 h-full">
          {[55, 70, 60, 80, 65, 90].map((h, i) => (
            <div key={i} className="flex-1 flex flex-col justify-end">
              <div
                className="w-full bg-gray-100 rounded animate-pulse"
                style={{ height: `${h}%` }}
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

// ─── 공지사항 스켈레톤 ────────────────────────────────────────

function DashNoticeSkeleton() {
  return (
    <CustomCard className="p-4 gap-0 border-border-strong">
      {/* 타이틀 */}
      <div className="h-4 w-24 bg-gray-100 rounded animate-pulse mb-2.5" />

      {/* 목록 */}
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="flex items-start gap-2 py-1.5 border-b border-gray-50 last:border-0"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-gray-100 animate-pulse mt-1 shrink-0" />
          <div className="flex-1 min-w-0 flex flex-col gap-1">
            <div
              className="h-3.5 bg-gray-100 rounded animate-pulse"
              style={{ width: `${[80, 65, 75, 55, 70][i]}%` }}
            />
            <div className="h-3 w-10 bg-gray-100 rounded animate-pulse" />
          </div>
        </div>
      ))}
    </CustomCard>
  );
}

// ─── 일정 스켈레톤 ────────────────────────────────────────────

function DashSchSkeleton() {
  return (
    <CustomCard className="p-4 gap-0 border-border-strong">
      {/* 타이틀 */}
      <div className="h-4 w-24 bg-gray-100 rounded animate-pulse mb-2.5" />

      {/* 목록 */}
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="flex gap-2 py-1.5 border-b border-gray-50 last:border-0"
        >
          {/* 날짜 */}
          <div className="h-3 w-8 bg-gray-100 rounded animate-pulse mt-0.5 shrink-0" />
          {/* 컬러 도트 */}
          <div className="w-1.5 h-1.5 rounded-full bg-gray-100 animate-pulse mt-1 shrink-0" />
          {/* 내용 */}
          <div className="flex flex-col gap-1 flex-1">
            <div
              className="h-3.5 bg-gray-100 rounded animate-pulse"
              style={{ width: `${[70, 55, 80, 60][i]}%` }}
            />
            <div className="h-3 w-24 bg-gray-100 rounded animate-pulse" />
          </div>
        </div>
      ))}
    </CustomCard>
  );
}

// ─── ThirdSection 스켈레톤 ────────────────────────────────────
function ThirdSectionSkeleton() {
  return (
    <div className="grid grid-cols-3 gap-3.5 items-stretch">
      <QeTransitionSkeleton />
      <DashNoticeSkeleton />
      <DashSchSkeleton />
    </div>
  );
}

// ─── Schedule List ─────────────────────────────────────────────────
const DashScheduleItem = ({ item }: { item: DashSch }) => {
  return (
    <div
      key={item.schSeq}
      className={`flex gap-2 py-1.5 border-b border-gray-50 last:border-0 ${
        isPastSchedule(item.dates, item.endTime) ? "opacity-60" : ""
      }`}
    >
      {/* 날짜로변경 */}
      <div className="text-xs text-description min-w-[32px] pt-0.5">
        {format(item.dates, "MM-dd")}
      </div>
      <div
        className="w-1.5 h-1.5 rounded-full mt-1 shrink-0"
        style={{ background: `#${item.viewColor}` }}
      />
      <div>
        <div className="text-sm text-description">{item.schTitle}</div>
        <div className="text-xs text-description">
          {formatTime(item.startTime)} ~ {formatTime(item.endTime)}
        </div>

        {/* <div className="text-xs text-description">
          {s.location} · {s.day === "today" ? "오늘" : "내일"}
        </div> */}
      </div>
    </div>
  );
};

// ─── Notice List ─────────────────────────────────────────────────
const DashNoticeItem = ({ item }: { item: DashNotice }) => {
  return (
    <div
      key={item.id}
      className="flex items-start gap-2 py-1.5 border-b border-gray-50 last:border-0"
    >
      <div
        className="w-1.5 h-1.5 rounded-full mt-1 shrink-0"
        style={{ background: item.isPin ? "#e60e0e" : "#378add" }}
      />
      <div className="flex-1 min-w-0">
        <div className={`text-sm truncate text-description`}>{item.title}</div>
        <div className="text-xs text-description opacity-70 mt-0.5">
          {format(item.createDt, "MM-dd")}
        </div>
      </div>
    </div>
  );
};

{
  /* <div
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
          </div> */
}

export function ThirdSection() {
  const { qeTransition, dashNotice, dashSch, isError, isLoading } =
    useThirdCard();

  if (isLoading) return <ThirdSectionSkeleton />;

  console.log(dashNotice.data?.slice(0, 6));

  return (
    <div className="grid grid-cols-3 gap-3.5 items-stretch">
      {/* 품질평가 점수 추이 */}
      <CustomCard className="flex flex-col p-4 gap-0 border-border-strong">
        <div className="text-sm font-medium text-[#1a2340] mb-2.5">
          품질평가 점수 추이
          <span className="font-normal text-description ml-1.5">
            최근 3개월
          </span>
        </div>
        <div className="flex-1 min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={qeTransition.data}
              margin={{ top: 4, right: 8, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="gradGreen" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1D9E75" stopOpacity={0.18} />
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
      </CustomCard>

      {/* 공지사항 */}
      <CustomCard className="p-4 gap-0 border-border-strong">
        <div className="text-sm font-medium text-[#1a2340] mb-2.5">
          최근 공지사항
        </div>
        {dashNotice.data && dashNotice.data?.length > 0 ? (
          dashNotice.data
            .slice(0, 6)
            .map((n, i) => <DashNoticeItem key={"notice" + i} item={n} />)
        ) : (
          <div className="text-xs text-description">
            최근 공지사항이 없습니다.
          </div>
        )}
      </CustomCard>

      {/* 일정 */}
      <CustomCard className="p-4 gap-0 border-border-strong">
        <div className="text-sm font-medium text-[#1a2340] mb-2.5">
          오늘 · 내일 일정
        </div>
        {dashSch.data && dashSch.data.length > 0 ? (
          dashSch.data
            .slice(0, 6)
            .map((s, i) => <DashScheduleItem key={"sch" + i} item={s} />)
        ) : (
          <div className="text-xs text-description">최근 일정이 없습니다.</div>
        )}
      </CustomCard>
    </div>
  );
}
//   <div
//     key={n.id}
//     className="flex items-start gap-2 py-1.5 border-b border-gray-50 last:border-0"
//   >
//     <div
//       className="w-1.5 h-1.5 rounded-full mt-1 shrink-0"
//       style={{ background: n.unread ? "#378add" : "#ddd" }}
//     />
//     <div className="flex-1 min-w-0">
//       <div
//         className={`text-sm truncate ${n.unread ? "text-description" : "text-description opacity-50"}`}
//       >
//         {n.title}
//       </div>
//       <div className="text-xs text-description opacity-70 mt-0.5">
//         {n.date}
//         {n.unread ? " · 읽지않음" : ""}
//       </div>
//     </div>
//   </div>

/******************** */
//   <div
//     key={i}
//     className={`flex gap-2 py-1.5 border-b border-gray-50 last:border-0 ${s.day === "tomorrow" ? "opacity-60" : ""}`}
//   >
//     <div className="text-xs text-description min-w-[32px] pt-0.5">
//       {s.time}
//     </div>
//     <div
//       className="w-1.5 h-1.5 rounded-full mt-1 shrink-0"
//       style={{ background: s.color }}
//     />
//     <div>
//       <div className="text-sm text-description">{s.title}</div>
//       <div className="text-xs text-description">
//         {s.location} · {s.day === "today" ? "오늘" : "내일"}
//       </div>
//     </div>
//   </div>
