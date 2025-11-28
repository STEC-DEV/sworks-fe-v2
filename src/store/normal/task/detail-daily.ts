import { create } from "zustand";

import { toast } from "sonner";
import { devtools, persist } from "zustand/middleware";
import api from "@/lib/api/api-manager";
import { Response } from "@/types/common/response";
import { DailyTask } from "@/types/normal/task/detail-daily";
import { useUIStore } from "@/store/common/ui-store";
import { objectToFormData } from "@/utils/convert";

export const DAILY_DETAIL_LOADING_KEYS = {
  INFO: "daily_detail_info",
} as const;

interface DailyTaskDetailState {
  loadingKeys: typeof DAILY_DETAIL_LOADING_KEYS;
  dailyTask: DailyTask | null;
  getDailyTask: (taskSeq: string, workDt: string) => Promise<void>;
  putCoverTaskComplete: (userSeq: number, taskSeq: number) => Promise<void>;
  patchUpdateLogs: (logSeq: number, data: Record<string, any>) => Promise<void>;
}

export const useDailyTaskDetailStore = create<DailyTaskDetailState>()(
  devtools(
    persist<DailyTaskDetailState>(
      (set, get) => ({
        loadingKeys: DAILY_DETAIL_LOADING_KEYS,
        dailyTask: null,
        getDailyTask: async (taskSeq, workDt) => {
          const searchParams = new URLSearchParams();
          searchParams.set("taskSeq", taskSeq);
          searchParams.set("workDt", workDt);
          const { setError, setLoading } = useUIStore.getState();
          setLoading(DAILY_DETAIL_LOADING_KEYS.INFO, true);
          try {
            const res: Response<DailyTask> = await api
              .get(`sitetask/w/sign/historytaskdetailinfo`, {
                searchParams: searchParams,
              })
              .json();

            set({ dailyTask: res.data });
          } catch (err) {
            console.error(err);
            const errMessage =
              err instanceof Error
                ? err.message
                : "업무 상세조회 문제가 발새하였습니다. 잠시후 다시 시도해주세요.";
            setError(DAILY_DETAIL_LOADING_KEYS.INFO, errMessage);
            toast.error(errMessage);
          } finally {
            setLoading(DAILY_DETAIL_LOADING_KEYS.INFO, false);
          }
        },
        putCoverTaskComplete: async (userSeq, taskSeq) => {
          try {
            const res: Response<boolean> = await api
              .put(`sitetask/w/sign/commtask`, {
                json: { userSeq, taskSeq },
              })
              .json();
            toast.success("업무처리 완료");
          } catch (err) {
            console.error(err);
            toast.error("업무처리 실패");
          }
        },
        patchUpdateLogs: async (logSeq, data) => {
          const lastData = { ...data, logSeq };
          const formData = objectToFormData(lastData);
          try {
            const res = await api
              .patch(`sitetask/w/sign/updatelogs`, {
                body: formData,
              })
              .json();
            toast.success("저장");
          } catch (err) {
            console.error(err);
            toast.error("저장 실패");
          }
        },
      }),
      { name: "dailytask-detail-store" }
    )
  )
);
