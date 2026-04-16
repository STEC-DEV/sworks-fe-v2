import { dashboardApi } from "@/lib/api/dashboard";
import { useAuthStore } from "@/store/auth/auth-store";
import { useQuery } from "@tanstack/react-query";

// ─── Query Keys ──────────────────────────────────────────────

export const dashboardKeys = {
  taskRate: (siteSeq: number) => ["dashboard", siteSeq, "taskRate"] as const,
  todayVoc: (siteSeq: number) => ["dashboard", siteSeq, "todayVoc"] as const,
  monthVocRate: (siteSeq: number) =>
    ["dashboard", siteSeq, "monthVocRate"] as const,
  qeAvg: (siteSeq: number) => ["dashboard", siteSeq, "qeAvg"] as const,
};

const defaultOptions = {
  staleTime: 60 * 1000, // 1분 캐시 유지
  refetchOnWindowFocus: false,
};

// ─── KPI 카드 섹션 ───────────────────────────────────────────
// GetTaskRate / GetTodaySiteVoc / GetMonthVocRate / GetQEAvg

export function useKpiCards() {
  const siteSeq = useAuthStore((s) => s.enteredWorkplace?.siteSeq);
  console.log("siteSeq:", siteSeq);

  //   if (!siteSeq) return console.error("사업장이 존재하지않습니다.");

  const taskRate = useQuery({
    queryKey: dashboardKeys.taskRate(siteSeq ?? 0),
    queryFn: dashboardApi.getTaskRate,
    select: (res) => res.data,
    enabled: !!siteSeq,
    ...defaultOptions,
  });

  const todayVoc = useQuery({
    queryKey: dashboardKeys.todayVoc(siteSeq ?? 0),
    queryFn: dashboardApi.getTodayVoc,
    select: (res) => res.data,
    enabled: !!siteSeq,
    ...defaultOptions,
  });

  const monthVocRate = useQuery({
    queryKey: dashboardKeys.monthVocRate(siteSeq ?? 0),
    queryFn: dashboardApi.getMonthVocRate,
    select: (res) => res.data,
    enabled: !!siteSeq,
    ...defaultOptions,
  });

  const qeAvg = useQuery({
    queryKey: dashboardKeys.qeAvg(siteSeq ?? 0),
    queryFn: dashboardApi.getQEAvg,
    select: (res) => res.data,
    enabled: !!siteSeq,
    ...defaultOptions,
  });

  const isLoading =
    taskRate.isLoading ||
    todayVoc.isLoading ||
    monthVocRate.isLoading ||
    qeAvg.isLoading;

  // 추가
  const isError =
    taskRate.isError ||
    todayVoc.isError ||
    monthVocRate.isError ||
    qeAvg.isError;

  return { taskRate, todayVoc, monthVocRate, qeAvg, isLoading, isError };
}
