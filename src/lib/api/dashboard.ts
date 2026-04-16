import { useAuthStore } from "@/store/auth/auth-store";
import api from "./api-manager";
import { useEffect } from "react";
import { Response } from "@/types/common/response";

const BASE = "DashBoard/W/sign";

function dashGet<T>(endpoint: string): Promise<Response<T>> {
  return api.get(`${BASE}/${endpoint}`).json<Response<T>>();
}

// ─── Types ───────────────────────────────────────────────────

export interface TaskRate {
  totalCount: number;
  completeCount: number;
  completePercent: number;
}

export interface TodayVoc {
  unprocessed: number;
  processing: number;
  completed: number;
  total: number;
}

export interface MonthVocRate {
  completedPercent: number;
  //   status: string; // "양호" | "주의" | "위험"
}

export interface QEAvg {
  currentMonthAvg: number;
  diffAvg: number;
}

export const dashboardApi = {
  /** 금일 업무 진행률 */
  getTaskRate: () => {
    return dashGet<TaskRate>("GetTaskRate");
  },
  /** 금일 VOC 현황 */
  getTodayVoc: () => dashGet<TodayVoc>("GetTodaySiteVoc"),
  /** 당월 VOC 처리율 */
  getMonthVocRate: () => dashGet<MonthVocRate>("GetMonthVocRate"),
  /** QE 평균 점수 */
  getQEAvg: () => dashGet<QEAvg>("GetQEAvg"),
};
