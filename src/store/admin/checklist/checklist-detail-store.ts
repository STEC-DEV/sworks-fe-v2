import api from "@/lib/api/api-manager";
import { handleApiError } from "@/lib/api/errorHandler";
import { useUIStore } from "@/store/common/ui-store";
import { Response } from "@/types/common/response";
import { toast } from "sonner";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

export const COMMON_CHECKLIST_DETAIL_LOADING_KEYS = {
  INFO: "checklist_info",
} as const;

interface ChecklistDetailState {
  loadingKeys: typeof COMMON_CHECKLIST_DETAIL_LOADING_KEYS;
  //상세정보
  checklistDetail: ChecklistDetail | null;
  getChecklistDetail: (chkSeq: string) => Promise<void>;

  //항목 생성
  postAddChecklistItem: (
    item: Record<string, any>
  ) => Promise<Response<number>>;

  //편집
  editChecklistItem: Checklist | null;
  setEditChecklistItem: (id: number) => void;
  resetEditChecklistItem: () => void;
  putEditChecklistItem: (item: Checklist) => Promise<void>;
  deleteChecklist: (delSeq: number) => Promise<void>;
}

export const useChecklistDetailStore = create<ChecklistDetailState>()(
  devtools(
    persist<ChecklistDetailState>(
      (set, get) => ({
        loadingKeys: COMMON_CHECKLIST_DETAIL_LOADING_KEYS,
        checklistDetail: null,
        getChecklistDetail: async (chkSeq) => {
          const { setLoading, setError } = useUIStore.getState();
          setLoading(COMMON_CHECKLIST_DETAIL_LOADING_KEYS.INFO, true);
          try {
            const res: Response<ChecklistDetail> = await api
              .get(`checklist/w/sign/commdetail`, {
                searchParams: { chkSeq },
              })
              .json();
            set({ checklistDetail: res.data });
          } catch (err) {
            console.log(err);
            const errMessage = await handleApiError(err);
            setError(COMMON_CHECKLIST_DETAIL_LOADING_KEYS.INFO, errMessage);
            toast.error(errMessage);
          } finally {
            setLoading(COMMON_CHECKLIST_DETAIL_LOADING_KEYS.INFO, false);
          }
        },

        postAddChecklistItem: async (item) => {
          const { checklistDetail } = get();
          try {
            const res: Response<number> = await api
              .post(`checklist/w/sign/addchecklist/`, {
                json: {
                  serviceTypeSeq: checklistDetail?.serviceTypeSeq,
                  divTypeSeq: checklistDetail?.divCodeSeq,
                  typeCodeSeq: checklistDetail?.typeCodeSeq,
                  mains: [item],
                },
              })
              .json();

            return res;
          } catch (err) {
            console.log(err);
            const errMessage = await handleApiError(err);
            const response: Response<number> = {
              code: 500,
              message: "요청 중 오류가 발생했습니다.",
              data: -1,
            };
            toast.error(errMessage);
            return response;
          }
        },

        editChecklistItem: null,
        setEditChecklistItem: (id) => {
          const { checklistDetail } = get();
          const editChecklistItem = checklistDetail?.mains.find(
            (c) => c.chkMainSeq === id
          );
          set({ editChecklistItem: editChecklistItem });
        },
        resetEditChecklistItem: () => {
          set({ editChecklistItem: undefined });
        },
        putEditChecklistItem: async (item) => {
          console.log("항목");
          console.log(item);
          try {
            const res: Response<number> = await api
              .put(`checklist/w/sign/updatechecklist`, {
                json: item,
              })
              .json();

            console.log(res);
          } catch (err) {
            console.log(err);
            const errMessage = await handleApiError(err);
            toast.error(errMessage);
          }
        },
        deleteChecklist: async (delSeq) => {
          try {
            const res: Response<boolean> = await api
              .delete(`checklist/w/sign/deletechkmain`, {
                searchParams: { delSeq },
              })
              .json();
            toast.success("삭제");
          } catch (err) {
            console.error(err);
            const errMessage = await handleApiError(err);
            toast.error(errMessage);
          }
        },
      }),
      { name: "checklist-detail-store" }
    )
  )
);
