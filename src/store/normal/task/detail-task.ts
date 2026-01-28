import api from "@/lib/api/api-manager";
import { useUIStore } from "@/store/common/ui-store";
import { Response } from "@/types/common/response";
import { toast } from "sonner";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

export const TASK_DETAIL_LOADING_KEYS = {
  DETAIL: "task_detail",
} as const;

interface TaskDetailState {
  loadingKeys: typeof TASK_DETAIL_LOADING_KEYS;
  taskDetail: TaskDetail | null;
  getTaskDetail: (taskSeq: string) => Promise<void>;
  patchUpdateTaskDetail: (values: Record<string, any>) => Promise<void>;
  classificationTaskWorker: ClassificationTaskWorker[] | undefined;
  getTaskUserList: (taskSeq: string) => Promise<void>;
  putUpdateTaskWorker: (workers: number[]) => Promise<void>;
  deleteTask: (taskSeq: string[]) => Promise<void>;
}

export const useTaskDetailStore = create<TaskDetailState>()(
  devtools(
    persist<TaskDetailState>(
      (set, get) => ({
        loadingKeys: TASK_DETAIL_LOADING_KEYS,
        taskDetail: null,
        getTaskDetail: async (taskSeq) => {
          const { setError, setLoading } = useUIStore.getState();
          setLoading(TASK_DETAIL_LOADING_KEYS.DETAIL, true);
          try {
            const res: Response<TaskDetail> = await api
              .get(`sitetask/w/sign/detailsitetask`, {
                searchParams: { taskSeq },
              })
              .json();

            set({ taskDetail: res.data });
          } catch (err) {
            console.error(err);
            const errMessage =
              err instanceof Error
                ? err.message
                : "업무상세 조회 문제가 발생하였습니다. 잠시후 다시 시도해주세요.";
            setError(TASK_DETAIL_LOADING_KEYS.DETAIL, errMessage);
            toast.error(errMessage);
          } finally {
            setLoading(TASK_DETAIL_LOADING_KEYS.DETAIL, false);
          }
        },
        patchUpdateTaskDetail: async (values) => {
          const { taskDetail } = get();
          if (!taskDetail) return;
          const updateData = { ...taskDetail, ...values };
          try {
            const res: Response<boolean> = await api
              .patch(`sitetask/w/sign/updatesitetask`, {
                json: updateData,
              })
              .json();

            toast.success("수정 완료 ");
          } catch (err) {
            console.error(err);
            toast.error("에러 발생");
          }
        },
        classificationTaskWorker: undefined,
        getTaskUserList: async (taskSeq) => {
          const searchParams = new URLSearchParams();

          searchParams.set("taskSeq", taskSeq);

          try {
            const res: Response<ClassificationTaskWorker[]> = await api
              .get(`sitetask/w/sign/updateuserclassification`, {
                searchParams: searchParams,
              })
              .json();
            set({ classificationTaskWorker: res.data });
          } catch (err) {
            console.error(err);
            toast.error("근무자 조회 실패");
          }
        },
        putUpdateTaskWorker: async (workers) => {
          const { taskDetail } = get();
          if (!taskDetail) return;
          try {
            const data = {
              taskSeq: taskDetail.taskSeq,
              userSeq: workers,
            };
            const res: Response<boolean> = await api
              .put(`sitetask/w/sign/updatesitetaskuser`, {
                json: data,
              })
              .json();
            toast.success("저장");
          } catch (err) {
            console.error(err);
            toast.error("저장 실패");
          }
        },
        deleteTask: async (taskSeq) => {
          try {
            const searchParams = new URLSearchParams();
            taskSeq.map((t) => searchParams.set("delSeq", t));
            const res: Response<boolean> = await api
              .delete("siteTask/w/sign/delsitetask", {
                searchParams: searchParams,
              })
              .json();
            toast.success("삭제되었습니다.");
          } catch (err) {
            console.error(err);
            toast.error("저장 실패");
          }
        },
      }),
      {
        name: "task-detail-store",
      },
    ),
  ),
);
