import api from "@/lib/api/api-manager";
import { Response } from "@/types/common/response";
import { ListData, ListState } from "@/types/list-type";
import { paramsCheck } from "@/utils/param";
import { toast } from "sonner";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface TaskState {
  taskList: ListState<Task>;
  getTaskList: (searchParams: URLSearchParams) => Promise<void>;
}

export const useTaskStore = create<TaskState>()(
  devtools(
    persist<TaskState>(
      (set, get) => ({
        taskList: { type: "loading" },
        getTaskList: async (searchParams) => {
          const checkParams = paramsCheck(searchParams);
          try {
            const res: Response<ListData<Task>> = await api
              .get(`sitetask/w/sign/allsitetask`, {
                searchParams: checkParams,
              })
              .json();
            set({ taskList: { type: "data", payload: res.data } });
          } catch (err) {
            console.error(err);
            toast.error("조회 실패");
          }
        },
      }),
      { name: "task-store" }
    )
  )
);
