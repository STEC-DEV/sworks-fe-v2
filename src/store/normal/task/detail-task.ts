import api from "@/lib/api/api-manager";
import { useAuthStore } from "@/store/auth/auth-store";
import { Response } from "@/types/common/response";
import { toast } from "sonner";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface TaskDetailState {
  taskDetail: TaskDetail | undefined;
  getTaskDetail: (taskSeq: string) => Promise<void>;
  patchUpdateTaskDetail: (values: Record<string, any>) => Promise<void>;
  classificationTaskWorker: ClassificationTaskWorker[] | undefined;
  getTaskUserList: (serviceTypeSeq: string) => Promise<void>;
  putUpdateTaskWorker: (workers: number[]) => Promise<void>;
}

export const useTaskDetailStore = create<TaskDetailState>()(
  devtools(
    persist<TaskDetailState>(
      (set, get) => ({
        taskDetail: undefined,
        getTaskDetail: async (taskSeq) => {
          try {
            const res: Response<TaskDetail> = await api
              .get(`sitetask/w/sign/detailsitetask`, {
                searchParams: { taskSeq },
              })
              .json();

            set({ taskDetail: res.data });
          } catch (err) {
            console.error(err);
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
        getTaskUserList: async (serviceTypeSeq) => {
          const searchParams = new URLSearchParams();
          const { enteredWorkplace } = useAuthStore.getState();
          //에러
          if (!enteredWorkplace) return;

          searchParams.set("siteSeq", enteredWorkplace.siteSeq.toString());
          searchParams.set("serviceTypeSeq", serviceTypeSeq);

          try {
            const res: Response<ClassificationTaskWorker[]> = await api
              .get(`sitetask/w/sign/insertuserclassification`, {
                searchParams: searchParams,
              })
              .json();
            set({ classificationTaskWorker: res.data });
          } catch (err) {
            console.error(err);
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
      }),
      {
        name: "task-detail-store",
      }
    )
  )
);
