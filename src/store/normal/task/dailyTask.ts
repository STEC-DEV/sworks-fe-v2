import api from "@/lib/api/api-manager";
import { handleApiError } from "@/lib/api/errorHandler";
import { useUIStore } from "@/store/common/ui-store";

import { Response } from "@/types/common/response";
import { paramsCheck } from "@/utils/param";
import { toast } from "sonner";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

export const DAILY_TASK_LOADING_KEYS = {
  LIST: "daily_task_list",
} as const;

interface DailyTaskStatus {
  loadingKeys: typeof DAILY_TASK_LOADING_KEYS;
  dailyTaskList: Task[] | null;
  getDailyTaskList: (searchParams: URLSearchParams) => Promise<void>;
}

export const useDailyTaskStore = create<DailyTaskStatus>()(
  devtools(
    persist<DailyTaskStatus>(
      (set, get) => ({
        loadingKeys: DAILY_TASK_LOADING_KEYS,
        dailyTaskList: null,
        getDailyTaskList: async (searchParams) => {
          const checkParams = paramsCheck(searchParams);
          const { setError, setLoading } = useUIStore.getState();
          setLoading(DAILY_TASK_LOADING_KEYS.LIST, true);
          try {
            const res: Response<Task[]> = await api
              .get(`sitetask/w/sign/dailytaskprogressinfo`, {
                searchParams: checkParams,
              })
              .json();

            set({ dailyTaskList: res.data });
          } catch (err) {
            console.error(err);
            const errMessage = await handleApiError(err);
            setError(DAILY_TASK_LOADING_KEYS.LIST, errMessage);
            toast.error(errMessage);
          } finally {
            setLoading(DAILY_TASK_LOADING_KEYS.LIST, false);
          }
        },
      }),
      { name: "daily-task-store" }
    )
  )
);
