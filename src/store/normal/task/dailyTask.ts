import api from "@/lib/api/api-manager";

import { Response } from "@/types/common/response";
import { paramsCheck } from "@/utils/param";
import { toast } from "sonner";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface DailyTaskStatus {
  dailyTaskList: Task[] | undefined;
  getDailyTaskList: (searchParams: URLSearchParams) => Promise<void>;
}

export const useDailyTaskStore = create<DailyTaskStatus>()(
  devtools(
    persist<DailyTaskStatus>(
      (set, get) => ({
        dailyTaskList: undefined,
        getDailyTaskList: async (searchParams) => {
          const checkParams = await paramsCheck(searchParams);

          try {
            const res: Response<Task[]> = await api
              .get(`sitetask/w/sign/dailytaskprogressinfo`, {
                searchParams: checkParams,
              })
              .json();

            set({ dailyTaskList: res.data });
          } catch (err) {
            console.error(err);
            toast.error("에러 발생");
          }
        },
      }),
      { name: "daily-task-store" }
    )
  )
);
