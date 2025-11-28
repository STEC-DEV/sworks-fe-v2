import api from "@/lib/api/api-manager";
import { useAuthStore } from "@/store/auth/auth-store";
import { useUIStore } from "@/store/common/ui-store";
import { Response } from "@/types/common/response";
import { ListData, ListState } from "@/types/list-type";
import { TaskHistoryListItem } from "@/types/normal/task/task-history";
import { TaskHistory } from "@/types/normal/task/task-history-detail";
import { paramsCheck } from "@/utils/param";
import { toast } from "sonner";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

export const TASK_HISTORY_LOADING_KEYS = {
  LIST: "task_history_list",
  DETAIL: "task_history_detail",
} as const;

interface TaskHistoryState {
  loadingKeys: typeof TASK_HISTORY_LOADING_KEYS;
  taskHistoryList: ListData<TaskHistoryListItem> | null;
  getTaskHistoryList: (params: URLSearchParams) => Promise<void>;
  taskHistoryDetail: TaskHistory | null;
  getTaskHistoryDetail: (historySeq: string) => Promise<void>;
}

export const useTaskHistoryStore = create<TaskHistoryState>()(
  devtools(
    persist<TaskHistoryState>(
      (set, get) => ({
        loadingKeys: TASK_HISTORY_LOADING_KEYS,
        taskHistoryList: null,
        getTaskHistoryList: async (params) => {
          const { setError, setLoading } = useUIStore.getState();

          const { enteredWorkplace } = useAuthStore.getState();
          if (!enteredWorkplace) {
            setError(
              TASK_HISTORY_LOADING_KEYS.LIST,
              "접속한 사업장에 문제가 발생하였습니다."
            );
            toast.error("조회 실패");
            return;
          }
          const checkParams = paramsCheck(params);
          checkParams.set("siteSeq", enteredWorkplace.siteSeq.toString());
          setLoading(TASK_HISTORY_LOADING_KEYS.LIST, true);
          try {
            const res: Response<ListData<TaskHistoryListItem>> = await api
              .get(`sitetask/w/sign/sitetaskhistory`, {
                searchParams: checkParams,
              })
              .json();

            set({ taskHistoryList: res.data });
          } catch (err) {
            console.error(err);
            const errMessage =
              err instanceof Error
                ? err.message
                : "일일업무이력 조회 문제가 발생하였습니다. 잠시후 디시 시도해주세요.";
            setError(TASK_HISTORY_LOADING_KEYS.LIST, errMessage);
            toast.error(errMessage);
          } finally {
            setLoading(TASK_HISTORY_LOADING_KEYS.LIST, false);
          }
        },
        taskHistoryDetail: null,
        getTaskHistoryDetail: async (historySeq) => {
          const { setError, setLoading } = useUIStore.getState();
          setLoading(TASK_HISTORY_LOADING_KEYS.DETAIL, true);
          try {
            const res: Response<TaskHistory> = await api
              .get(`sitetask/w/sign/sitetaskhistorydetail`, {
                searchParams: { historySeq },
              })
              .json();

            set({ taskHistoryDetail: res.data });
          } catch (err) {
            console.error(err);
            const errMessage =
              err instanceof Error
                ? err.message
                : "업무상세 조회 문제가 발생하였습니다. 잠시후 다시 시도해주세요.";
            setError(TASK_HISTORY_LOADING_KEYS.DETAIL, errMessage);
            toast.error(errMessage);
          } finally {
            setLoading(TASK_HISTORY_LOADING_KEYS.DETAIL, false);
          }
        },
      }),
      {
        name: "task-history-store",
      }
    )
  )
);
