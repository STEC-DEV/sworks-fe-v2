import api from "@/lib/api/api-manager";
import { useAuthStore } from "@/store/auth/auth-store";
import { Response } from "@/types/common/response";
import { ListData, ListState } from "@/types/list-type";
import { TaskChecklist } from "@/types/normal/task/checklist";
import { CreateTask } from "@/types/normal/task/createTask";
import { paramsCheck } from "@/utils/param";
import { toast } from "sonner";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface TaskState {
  taskList: ListState<Task>;
  getTaskList: (searchParams: URLSearchParams) => Promise<void>;
  //업무등록
  createTask: CreateTask;
  resetCreateTask: () => void;
  updateCreateTask: (values: Record<string, any>) => void;
  postAddTask: () => Promise<boolean>;
  taskChecklist: TaskChecklist[] | undefined;
  getChecklist: () => Promise<Response<TaskChecklist[] | null>>;
}

const initialCreateTask = {
  siteSeq: 0,
  serviceTypeSeq: undefined,
  title: "",
  startDt: new Date(),
  endDt: null,
  termType: 0,
  repeat: 1,
  chkMains: [],
};

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
        createTask: initialCreateTask,
        resetCreateTask: () => {
          set({ createTask: initialCreateTask });
        },
        updateCreateTask: (values) => {
          console.log(values);
          set((prev) => ({ createTask: { ...prev.createTask, ...values } }));
        },
        taskChecklist: undefined,
        getChecklist: async () => {
          const searchParams = new URLSearchParams();
          const { createTask } = get();

          //업무유형이 선택되지 않은 경우
          if (!createTask.serviceTypeSeq)
            return {
              code: 500,
              message: "업무 유형을 선택해주세요.",
              data: null,
            };
          searchParams.set(
            "serviceTypeSeq",
            createTask.serviceTypeSeq.toString()
          );
          try {
            const res: Response<TaskChecklist[]> = await api
              .get(`sitetask/w/sign/insertchkclassification`, {
                searchParams: searchParams,
              })
              .json();

            set({ taskChecklist: res.data });
            return res;
          } catch (err) {
            console.error(err);
            const res: Response<null> = {
              code: 500,
              message: "조회 실패",
              data: null,
            };
            return res;
          }
        },
        postAddTask: async () => {
          const { createTask } = get();
          const { enteredWorkplace } = useAuthStore.getState();
          if (!enteredWorkplace) return false;

          createTask.siteSeq = enteredWorkplace.siteSeq;
          try {
            const res: Response<boolean> = await api
              .post(`sitetask/w/sign/addsitetask`, {
                json: createTask,
              })
              .json();

            return res.data;
          } catch (err) {
            console.error(err);
            toast.error("업무생성 실패");
            return false;
          }
        },
      }),
      { name: "task-store" }
    )
  )
);
