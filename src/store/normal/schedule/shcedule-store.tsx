import api from "@/lib/api/api-manager";
import { useAuthStore } from "@/store/auth/auth-store";
import { Response } from "@/types/common/response";
import { DaySchedule } from "@/types/normal/schedule/day-schedule";
import {
  MonthScheduleListItem,
  monthSchedules,
} from "@/types/normal/schedule/month";
import { format } from "date-fns";
import { toast } from "sonner";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface ScheduleState {
  schedules: DaySchedule[] | undefined;
  schedule: DaySchedule | undefined;
  getDaySchedule: (date: string) => Promise<void>;
  getDayScheduleDetail: (scheduleId: string) => Promise<void>;
  resetSchedule: () => void;
  postAddSchedule: (data: Record<string, any>) => Promise<void>;
  patchUpdateSchedule: (data: FormData) => Promise<void>;
  //월간일정
  monthSchedules: MonthScheduleListItem[] | undefined;
  getMonthSchedule: (date: URLSearchParams) => Promise<void>;
  postAddMonthSchedule: (data: Record<string, any>) => Promise<void>;
  patchUpdateMonthSchedule: (data: Record<string, any>) => Promise<void>;
  //Month to Day
  postMonthToDay: (data: MonthScheduleListItem, date: Date) => Promise<void>;
}

export const useScheduleStore = create<ScheduleState>()(
  devtools(
    persist<ScheduleState>(
      (set, get) => ({
        schedules: undefined,
        schedule: undefined,
        getDaySchedule: async (date) => {
          try {
            set({ schedules: undefined });
            const res: Response<DaySchedule[]> = await api
              .get(`sch/w/sign/getschlist`, {
                searchParams: { targetDt: date },
              })
              .json();

            set({ schedules: res.data });
          } catch (err) {
            console.error(err);
            toast.error("일정 조횟 실패");
          }
        },
        getDayScheduleDetail: async (scheduleId) => {
          try {
            const res: Response<DaySchedule> = await api
              .get(`sch/w/sign/detailsch`, {
                searchParams: { schSeq: scheduleId },
              })
              .json();

            set({ schedule: res.data });
          } catch (err) {
            console.error(err);
            toast.error("조회 실패");
          }
        },
        resetSchedule: () => {
          set({ schedule: undefined });
        },
        postAddSchedule: async (data) => {
          const { enteredWorkplace } = useAuthStore.getState();
          if (!enteredWorkplace) {
            toast.error("등록 실패");
            return;
          }
          try {
            data.siteSeq = enteredWorkplace.siteSeq;
            const res: Response<boolean> = await api
              .post(`sch/w/sign/addschinfo`, {
                json: data,
              })
              .json();

            toast.success("등록");
          } catch (err) {
            console.error(err);
            toast.error("등록 실패");
          }
        },
        patchUpdateSchedule: async (data) => {
          console.log(data);
          try {
            const res: Response<boolean> = await api
              .patch(`sch/w/sign/upsertlog`, {
                body: data,
              })
              .json();
            toast.success("저장");
          } catch (err) {
            console.error(err);
            toast.error("수정 실패");
          }
        },
        monthSchedules: undefined,
        getMonthSchedule: async (date) => {
          try {
            const res: Response<MonthScheduleListItem[]> = await api
              .get("plan/w/sign/getplanlist", {
                searchParams: date,
              })
              .json();

            set({ monthSchedules: res.data });
          } catch (err) {
            console.error(err);
            toast.error("월간일정 조회 실패");
          }
        },
        postAddMonthSchedule: async (data) => {
          const { enteredWorkplace } = useAuthStore.getState();
          if (!enteredWorkplace) return;
          data.siteSeq = enteredWorkplace.siteSeq;
          try {
            const res: Response<boolean> = await api
              .post(`plan/w/sign/addplaninfo`, {
                json: data,
              })
              .json();

            toast.success("생성");
          } catch (err) {
            console.error(err);
            toast.error("등록 실패");
          }
        },
        patchUpdateMonthSchedule: async (data) => {
          try {
            const res: Response<boolean> = await api
              .patch(`plan/w/sign/updateplaninfo`, {
                json: data,
              })
              .json();
            toast.success("저장");
          } catch (err) {
            console.error(err);
            toast.error("저장 실패");
          }
        },
        postMonthToDay: async (data, date) => {
          try {
            console.log("일별 to 일별");
            console.log(data);
            console.log(date);

            const convertData = {
              planSeq: data.planSeq,
              serviceTypeSeq: data.serviceTypeSeq,
              schTitle: data.planTitle,
              description: data.description,
              isAllDay: true,
              startDt: format(date, "yyyy-MM-dd"),
              endDt: format(date, "yyyy-MM-dd"),
              alarmYn: false,
              alarmDt: null,
              alarmMin: 0,
              alarmOffsetDays: 0,
              viewColor: "d32f2f",
            };

            const res: Response<boolean> = await api
              .post(`plan/w/sign/changeplansch`, {
                json: convertData,
              })
              .json();
          } catch (err) {
            console.error(err);
            toast.error("문제가 발생하였습니다. 잠시후 다시 시도해주세요.");
          }
        },
      }),
      { name: "schedule-store" }
    )
  )
);
