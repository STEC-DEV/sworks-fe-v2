import api from "@/lib/api/api-manager";
import { useAuthStore } from "@/store/auth/auth-store";
import { Response } from "@/types/common/response";
import { ListData, ListState } from "@/types/list-type";
import { TaskHistoryListItem } from "@/types/normal/task/task-history";
import { TaskHistory } from "@/types/normal/task/task-history-detail";
import { paramsCheck } from "@/utils/param";
import { toast } from "sonner";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface TaskHistoryState {
  taskHistoryList: ListState<TaskHistoryListItem>;
  getTaskHistoryList: (params: URLSearchParams) => Promise<void>;
  taskHistoryDetail: TaskHistory | undefined;
  getTaskHistoryDetail: (historySeq: string) => Promise<void>;
}

export const useTaskHistoryStore = create<TaskHistoryState>()(
  devtools(
    persist<TaskHistoryState>(
      (set, get) => ({
        taskHistoryList: { type: "loading" },
        getTaskHistoryList: async (params) => {
          set({ taskHistoryList: { type: "loading" } });
          const { enteredWorkplace } = useAuthStore.getState();
          if (!enteredWorkplace) {
            set({ taskHistoryList: { type: "error", message: "조회 실패" } });
            toast.error("조회 실패");
            return;
          }
          const checkParams = paramsCheck(params);
          checkParams.set("siteSeq", enteredWorkplace.siteSeq.toString());
          try {
            const res: Response<ListData<TaskHistoryListItem>> = await api
              .get(`sitetask/w/sign/sitetaskhistory`, {
                searchParams: checkParams,
              })
              .json();

            set({ taskHistoryList: { type: "data", payload: res.data } });
          } catch (err) {
            console.error(err);
            set({ taskHistoryList: { type: "error", message: "조회 실패" } });
            toast.error("조회 실패");
          }
        },
        taskHistoryDetail: undefined,
        getTaskHistoryDetail: async (historySeq) => {
          try {
            const res: Response<TaskHistory> = await api
              .get(`sitetask/w/sign/sitetaskhistorydetail`, {
                searchParams: { historySeq },
              })
              .json();

            set({ taskHistoryDetail: res.data });
          } catch (err) {
            console.error(err);
            toast.error("조회 실패");
          }
        },
      }),
      {
        name: "task-history-store",
      }
    )
  )
);
