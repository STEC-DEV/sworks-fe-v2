import { dashboardApi } from "@/lib/api/dashboard";
import { useAuthStore } from "@/store/auth/auth-store";
import { useQuery } from "@tanstack/react-query";

// ─── Query Keys ──────────────────────────────────────────────

export const dashboardKeys = {
  /** ========== KPI SECTION ========== */
  taskRate: (siteSeq: number) => ["dashboard", siteSeq, "taskRate"] as const,
  todayVoc: (siteSeq: number) => ["dashboard", siteSeq, "todayVoc"] as const,
  monthVocRate: (siteSeq: number) =>
    ["dashboard", siteSeq, "monthVocRate"] as const,
  qeAvg: (siteSeq: number) => ["dashboard", siteSeq, "qeAvg"] as const,

  /** ========== 2nd SECTION ========== */
  vocTransition: (siteSeq: number) =>
    ["dashboard", siteSeq, "vocTransition"] as const,
  todaySiteTaskCount: (siteSeq: number) =>
    ["dashboard", siteSeq, "todaySiteTaskCount"] as const,
  todayVocList: (siteSeq: number) =>
    ["dashboard", siteSeq, "todayVocList"] as const,

  /** ========== 3rd SECTION ========== */
  qeTransition: (siteSeq: number) =>
    ["dashboard", siteSeq, "qeTransition"] as const,
  dashNotice: (siteSeq: number) =>
    ["dashboard", siteSeq, "dashNotice"] as const,
  dashSch: (siteSeq: number) => ["dashboard", siteSeq, "dashSch"] as const,
};

const defaultOptions = {
  staleTime: 60 * 1000, // 1분 캐시 유지
  refetchOnWindowFocus: false,
};

// ─── KPI 카드 섹션 ───────────────────────────────────────────
// GetTaskRate / GetTodaySiteVoc / GetMonthVocRate / GetQEAvg

export function useKpiCards() {
  const siteSeq = useAuthStore((s) => s.enteredWorkplace?.siteSeq);

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

  /** ========== 2nd SECTION ========== */

  // const vocTransition = useQuery({
  //   queryKey: dashboardKeys.vocTransition(siteSeq ?? 0),
  //   queryFn: dashboardApi.getVocTransition,
  //   select: (res) => res.data,
  //   enabled: !!siteSeq,
  //   ...defaultOptions,
  // });
  // const todaySiteTaskCount = useQuery({
  //   queryKey: dashboardKeys.todaySiteTaskCount(siteSeq ?? 0),
  //   queryFn: dashboardApi.getTodaySiteTaskCount,
  //   select: (res) => res.data,
  //   enabled: !!siteSeq,
  //   ...defaultOptions,
  // });
  // const todayVocList = useQuery({
  //   queryKey: dashboardKeys.todayVocList(siteSeq ?? 0),
  //   queryFn: dashboardApi.getTodayVocList,
  //   select: (res) => res.data,
  //   enabled: !!siteSeq,
  //   ...defaultOptions,
  // });

  /** ========== 3rd SECTION ========== */

  // const qeTransition = useQuery({
  //   queryKey: dashboardKeys.qeTransition(siteSeq ?? 0),
  //   queryFn: dashboardApi.getQETransition,
  //   select: (res) => res.data,
  //   enabled: !!siteSeq,
  //   ...defaultOptions,
  // });
  // const dashNotice = useQuery({
  //   queryKey: dashboardKeys.dashNotice(siteSeq ?? 0),
  //   queryFn: dashboardApi.getNotice,
  //   select: (res) => res.data,
  //   enabled: !!siteSeq,
  //   ...defaultOptions,
  // });
  // const dashSch = useQuery({
  //   queryKey: dashboardKeys.dashSch(siteSeq ?? 0),
  //   queryFn: dashboardApi.getSch,
  //   select: (res) => res.data,
  //   enabled: !!siteSeq,
  //   ...defaultOptions,
  // });

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

  return {
    /** KPI SECTION */
    taskRate,
    todayVoc,
    monthVocRate,
    qeAvg,

    /** 2nd SECTION */
    // vocTransition,
    // todaySiteTaskCount,
    // todayVocList,

    /** 3rd SECTION */
    // qeTransition,
    // dashNotice,
    // dashSch,

    isLoading,
    isError,
  };
}

export const useSecondCard = () => {
  const siteSeq = useAuthStore((s) => s.enteredWorkplace?.siteSeq);

  const vocTransition = useQuery({
    queryKey: dashboardKeys.vocTransition(siteSeq ?? 0),
    queryFn: dashboardApi.getVocTransition,
    select: (res) => res.data,
    enabled: !!siteSeq,
    ...defaultOptions,
  });
  const todaySiteTaskCount = useQuery({
    queryKey: dashboardKeys.todaySiteTaskCount(siteSeq ?? 0),
    queryFn: dashboardApi.getTodaySiteTaskCount,
    select: (res) => res.data,
    enabled: !!siteSeq,
    ...defaultOptions,
  });
  const todayVocList = useQuery({
    queryKey: dashboardKeys.todayVocList(siteSeq ?? 0),
    queryFn: dashboardApi.getTodayVocList,
    select: (res) => res.data,
    enabled: !!siteSeq,
    ...defaultOptions,
  });

  const isLoading =
    vocTransition.isLoading ||
    todaySiteTaskCount.isLoading ||
    todayVocList.isLoading;

  // 추가
  const isError =
    vocTransition.isError || todaySiteTaskCount.isError || todayVocList.isError;

  return {
    vocTransition,
    todaySiteTaskCount,
    todayVocList,
    isLoading,
    isError,
  };
};

export const useThirdCard = () => {
  const siteSeq = useAuthStore((s) => s.enteredWorkplace?.siteSeq);
  const qeTransition = useQuery({
    queryKey: dashboardKeys.qeTransition(siteSeq ?? 0),
    queryFn: dashboardApi.getQETransition,
    select: (res) => res.data,
    enabled: !!siteSeq,
    ...defaultOptions,
  });
  const dashNotice = useQuery({
    queryKey: dashboardKeys.dashNotice(siteSeq ?? 0),
    queryFn: dashboardApi.getNotice,
    select: (res) => res.data,
    enabled: !!siteSeq,
    ...defaultOptions,
  });
  const dashSch = useQuery({
    queryKey: dashboardKeys.dashSch(siteSeq ?? 0),
    queryFn: dashboardApi.getSch,
    select: (res) => res.data,
    enabled: !!siteSeq,
    ...defaultOptions,
  });

  const isLoading =
    qeTransition.isLoading || dashNotice.isLoading || dashSch.isLoading;

  // 추가
  const isError = qeTransition.isError || dashNotice.isError || dashSch.isError;
  return {
    qeTransition,
    dashNotice,
    dashSch,

    isLoading,
    isError,
  };
};
