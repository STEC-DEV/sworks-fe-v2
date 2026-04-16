import CustomCard from "@/components/common/card";
import { useKpiCards } from "@/hooks/useDashboard";

export function KpiSection() {
  const { taskRate, todayVoc, monthVocRate, qeAvg, isLoading } = useKpiCards();

  if (isLoading) return <KpiSkeleton />;

  // 에러

  console.log(taskRate.data);
  console.log(todayVoc.data);
  console.log(monthVocRate.data);
  console.log(qeAvg.data);

  if (taskRate.isError) {
    console.log(taskRate.error);
    return <div>데이터를 불러오지 못했습니다.</div>;
  }

  function getVocRateStatus(percent?: number) {
    if (percent === undefined || percent === 0) return null; // null이면 -- 표시

    if (percent >= 80)
      return { label: "양호", className: "bg-green-50 text-green-800" };
    if (percent >= 60)
      return { label: "보통", className: "bg-amber-50 text-amber-800" };
    return { label: "미흡", className: "bg-red-50 text-red-800" };
  }

  function VocRateStatus({ percent }: { percent?: number }) {
    const status = getVocRateStatus(percent);
    if (!status) return null;

    return (
      <span
        className={`text-xs font-medium px-1.5 py-0.5 rounded-lg ${status.className}`}
      >
        {status.label}
      </span>
    );
  }

  const getQeDiffStatus = (diff: number) => {
    if (diff > 0) return { className: "bg-green-50 text-green-800" };
    if (diff < 0) return { className: "bg-red-50 text-red-800" };
    return { className: "bg-gray-50 text-gray-800" };
  };

  const QeDiffStatus = ({ diff }: { diff: number }) => {
    const status = getQeDiffStatus(diff);
    if (!status) return null;
    return (
      <div className="flex items-center gap-1.5 text-xs text-description mt-1.5">
        <span
          className={`text-xs font-medium ${status.className} px-1.5 py-0.5 rounded-lg`}
        >
          {diff}
        </span>
        전월 대비
      </div>
    );
  };

  return (
    <div className="grid grid-cols-4 gap-2.5 mb-4">
      {/* 업무 진행률 */}
      <CustomCard className="p-4 gap-0  border-border-strong">
        <div className="text-xs text-description mb-1">금일 업무 진행률</div>
        <div className="text-2xl font-medium text-[#1a2340]">
          {taskRate.data?.completePercent}%
        </div>
        <div className="h-1 bg-gray-100 rounded-full my-1.5 overflow-hidden">
          <div
            className="h-1 bg-[#1D9E75] rounded-full"
            style={{ width: `${taskRate.data?.completePercent}%` }}
          />
        </div>
        <div className="text-xs text-description">
          완료 {taskRate.data?.completeCount}건 / 전체{" "}
          {taskRate.data?.totalCount}건
        </div>
      </CustomCard>

      {/* 민원 발생 */}
      <CustomCard className="p-4 gap-0  border-border-strong">
        <div className="text-xs text-description mb-1">금일 민원 발생</div>
        <div className="text-2xl font-medium text-[#1a2340]">
          {todayVoc.data?.total}건
        </div>
        <div className="text-xs text-description mt-1.5">
          처리완료 {todayVoc.data?.completed} · 처리중
          <span className="text-amber-600 font-medium">
            &nbsp;{todayVoc.data?.processing}
          </span>
        </div>
      </CustomCard>

      {/* 민원 처리율 */}
      <CustomCard className="p-4 gap-0  border-border-strong">
        <div className="text-xs text-description mb-1">이번달 민원 처리율</div>
        <div className="text-2xl font-medium text-[#1a2340]">
          {monthVocRate.data?.completedPercent}%
        </div>
        <div className="flex items-center gap-1.5 text-xs text-description mt-1.5">
          <VocRateStatus percent={monthVocRate.data?.completedPercent} />
        </div>
      </CustomCard>

      {/* 품질 평균 */}
      <CustomCard className="p-4 gap-0 border-border-strong">
        <div className="text-xs text-description mb-1">이번달 품질 평균</div>
        <div className="text-2xl font-medium text-[#1a2340]">
          {qeAvg.data?.currentMonthAvg}
          <span className="text-sm text-description font-normal">점</span>
        </div>
        <QeDiffStatus diff={qeAvg.data?.diffAvg || 0} />
      </CustomCard>
    </div>
  );
}

function KpiSkeleton() {
  return (
    <div className="grid grid-cols-4 gap-2.5 mb-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <CustomCard key={i} className="p-4 gap-0 border-border-strong">
          <div className="h-3 w-20 bg-gray-100 rounded animate-pulse mb-2" />
          <div className="h-8 w-16 bg-gray-100 rounded animate-pulse mb-2" />
          <div className="h-3 w-28 bg-gray-100 rounded animate-pulse" />
        </CustomCard>
      ))}
    </div>
  );
}
