import { create } from "zustand";
import { useDailyTaskStore } from "./dailyTask";

import { toast } from "sonner";
import { devtools, persist } from "zustand/middleware";
import api from "@/lib/api/api-manager";
import { Response } from "@/types/common/response";
import { DailyTask } from "@/types/normal/task/detail-daily";

interface DailyTaskDetailState {
  dailyTask: DailyTask | undefined;
  getDailyTask: (taskSeq: string, workDt: string) => Promise<void>;
}

export const useDailyTaskDetailStore = create<DailyTaskDetailState>()(
  devtools(
    persist<DailyTaskDetailState>(
      (set, get) => ({
        dailyTask: undefined,
        getDailyTask: async (taskSeq, workDt) => {
          const searchParams = new URLSearchParams();
          searchParams.set("taskSeq", taskSeq);
          searchParams.set("workDt", workDt);
          try {
            const res: Response<DailyTask> = await api
              .get(`sitetask/w/sign/historytaskdetailinfo`, {
                searchParams: searchParams,
              })
              .json();

            set({ dailyTask: res.data });
          } catch (err) {
            console.error(err);
            toast.error("에러 발생");
          }
        },
      }),
      { name: "dailytask-detail-store" }
    )
  )
);
