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

export interface VocTransition {
  dates: string;
  counts: number;
}
export interface TodayTaskCount {
  notStartedCount: number;
  inProgressCount: number;
  completedCount: number;
}
export interface TodayVocList {
  title: string;
  pointName: string;
  statusName: string;
  createDt: string;
}

export interface QeTransition {
  dates: string;
  score: number;
}
export interface DashNotice {
  id: string; // 현재 api에 없음
  title: string;
  isPin: boolean;
  creator: boolean;
  createDt: string;
}
export interface DashSch {
  dates: string;
  schSeq: number;
  schTitle: string;
  viewColor: string;
  isAllday: boolean;
  serviceTypeSeq: number;
  serviceTypeName: string;
  startTime: string;
  endTime: string;
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

  /** =========================== */

  /** 민원 6개월 추이 */
  getVocTransition: () => dashGet<VocTransition[]>("GetVocTransition"),
  /** 금일 업무 진행현황 카운트 */
  getTodaySiteTaskCount: () => dashGet<TodayTaskCount>("GetTodaySiteTaskCount"),
  /** 금일 voc 리스트 */
  getTodayVocList: () => dashGet<TodayVocList[]>("GetTodayVocList"),

  /** =========================== */

  /** 금일 voc 리스트 */
  getQETransition: () => dashGet<QeTransition[]>("GetQETransition"),
  /** 금일 voc 리스트 */
  getNotice: () => dashGet<DashNotice[]>("GetNotice"),
  /** 금일 voc 리스트 */
  getSch: () => dashGet<DashSch[]>("GetSch"),
};
