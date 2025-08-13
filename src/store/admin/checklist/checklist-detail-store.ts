import api from "@/lib/api/api-manager";
import { Response } from "@/types/common/response";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface ChecklistDetailState {
  //상세정보
  checklistDetail: ChecklistDetail | undefined;
  getChecklistDetail: (chkSeq: string) => Promise<void>;

  //항목 생성
  postAddChecklistItem: (
    item: Record<string, any>
  ) => Promise<Response<number>>;

  //편집
  editChecklistItem: Checklist | undefined;
  setEditChecklistItem: (id: number) => void;
  resetEditChecklistItem: () => void;
  putEditChecklistItem: (item: Checklist) => Promise<void>;
}

export const useChecklistDetailStore = create<ChecklistDetailState>()(
  devtools(
    persist<ChecklistDetailState>(
      (set, get) => ({
        checklistDetail: undefined,
        getChecklistDetail: async (chkSeq) => {
          try {
            const res: Response<ChecklistDetail> = await api
              .get(`checklist/w/sign/commdetail`, {
                searchParams: { chkSeq },
              })
              .json();

            const data = res.data;

            set({ checklistDetail: data });
          } catch (err) {
            console.log(err);
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
            const response: Response<number> = {
              code: 500,
              message: "요청 중 오류가 발생했습니다.",
              data: -1,
            };
            return response;
          }
        },

        editChecklistItem: undefined,
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
          }
        },
      }),
      { name: "checklist-detail-store" }
    )
  )
);
