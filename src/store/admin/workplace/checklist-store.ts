import api from "@/lib/api/api-manager";
import { handleApiError } from "@/lib/api/errorHandler";
import { useUIStore } from "@/store/common/ui-store";
import { ChecklistMultiType } from "@/types/admin/workplace/chk-types";
import { Response } from "@/types/common/response";
import { toast } from "sonner";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

export const WORKPLACE_CHECKLIST_LOADING_KEYS = {
  CHECKLIST: "admin_workplace_checklist",
  DETAIL: "admin_workplace_checklist_detail-a",
} as const;

interface WorkplaceDetailChecklistState {
  loadingKeys: typeof WORKPLACE_CHECKLIST_LOADING_KEYS;
  ////체크리스트
  /* 전체 조회 */
  checklist: WorkplaceChecklist[] | null;
  getChecklist: (workplaceId: string) => Promise<void>;
  /* 상세 조회 */
  checklistDetail: ChecklistDetail | null;
  getChecklistDetail: (
    workplaceId: string,
    serviceTypeSeq: string,
    divCodeSeq: string,
    typeCodeSeq: string
  ) => Promise<void>;
  /* 생성 */
  postAddChecklist: (workplaceId: string) => Promise<Response<CreateChecklist>>;
  putUpdateChecklist: (
    workplaceId: string,
    value: Record<string, any>
  ) => Promise<void>;
  /* 체크리스트 조회시 필요한 유형,부문 */
  checklistMultiType: ChecklistMultiType[] | undefined;
  getCheckMultiType: (workplaceId: string) => Promise<void>;
  /* 체크리스트 생성 객체*/
  createChecklist: CreateChecklist;
  setCreateChecklist: (value: Record<string, any>) => void;
  resetCreateChecklist: () => void;
  /* 선택한 유형의 체크리스트 조회 */
  availableChecklistItem: Checklist[] | undefined;
  resetAvailableChecklistItem: () => void;
  getAvailableChecklistItem: (
    workplaceId: string,
    serviceTypeSeq?: string,
    divCodeSeq?: string,
    typeCodeSeq?: string
  ) => Promise<void>;
  /* 선택한 체크리스트 */
  selectedAvailableChecklistItem: Checklist[];
  resetSelectedAvailableChecklistItem: () => void;
  updateSelectedAvailableChecklistItem: (checklist: Checklist[]) => void;
  deleteChecklist: (
    siteSeq: number,
    serviceTypeSeq: number,
    divCodeSeq: number,
    typeCodeSeq: number
  ) => Promise<void>;
}

const initialCreateChecklist: CreateChecklist = {
  serviceTypeSeq: undefined,
  divCodeSeq: undefined,
  typeCodeSeq: undefined,
  chkMainSeq: [],
};

export const useWorkplaceDetailChecklistStore =
  create<WorkplaceDetailChecklistState>()(
    devtools(
      persist<WorkplaceDetailChecklistState>(
        (set, get) => ({
          loadingKeys: WORKPLACE_CHECKLIST_LOADING_KEYS,
          checklist: null,
          getChecklist: async (workplaceId) => {
            const { setLoading, setError } = useUIStore.getState();
            setLoading(WORKPLACE_CHECKLIST_LOADING_KEYS.CHECKLIST, true);
            try {
              const res: Response<WorkplaceChecklist[]> = await api
                .get(`site/w/sign/getsitechecklistdetail`, {
                  searchParams: { siteSeq: workplaceId },
                })
                .json();

              set({ checklist: res.data });
            } catch (err) {
              console.log(err);
              const errMessage = await handleApiError(err);
              setError(WORKPLACE_CHECKLIST_LOADING_KEYS.CHECKLIST, errMessage);
              toast.error(errMessage);
            } finally {
              setLoading(WORKPLACE_CHECKLIST_LOADING_KEYS.CHECKLIST, false);
            }
          },
          checklistDetail: null,
          getChecklistDetail: async (
            siteSeq,
            serviceTypeSeq,
            divCodeSeq,
            typeCodeSeq
          ) => {
            const { setLoading, setError } = useUIStore.getState();
            setLoading(WORKPLACE_CHECKLIST_LOADING_KEYS.DETAIL, true);
            try {
              const res: Response<ChecklistDetail> = await api
                .get(`site/w/sign/sitechecklist`, {
                  searchParams: {
                    siteSeq,
                    serviceTypeSeq,
                    divCodeSeq,
                    typeCodeSeq,
                  },
                })
                .json();

              set({ checklistDetail: res.data });
            } catch (err) {
              console.error(err);
              const errMessage = await handleApiError(err);
              setError(WORKPLACE_CHECKLIST_LOADING_KEYS.DETAIL, errMessage);
              toast.error(errMessage);
            } finally {
              setLoading(WORKPLACE_CHECKLIST_LOADING_KEYS.DETAIL, false);
            }
          },
          postAddChecklist: async (workplaceId) => {
            const { createChecklist, resetCreateChecklist } = get();

            try {
              const res: Response<CreateChecklist> = await api
                .put(`site/w/sign/upsertsitechecklist`, {
                  json: { siteSeq: workplaceId, ...createChecklist },
                })
                .json();

              const data = res.data;

              resetCreateChecklist();
              return res;
            } catch (err) {
              console.log(err);
              const errMessage = await handleApiError(err);
              resetCreateChecklist();
              toast.error(errMessage);
              return {
                code: 500,
                data: initialCreateChecklist,
                message: "등록 에러 발생",
              };
            }
          },
          putUpdateChecklist: async (workplaceId, value) => {
            try {
              const res: Response<CreateChecklist> = await api
                .put(`site/w/sign/upsertsitechecklist`, {
                  json: { siteSeq: workplaceId, ...value },
                })
                .json();

              const data = res.data;
              console.log(data);
            } catch (err) {
              console.log(err);
              const errMessage = await handleApiError(err);
              toast.error(errMessage);
            }
          },
          checklistMultiType: undefined,
          getCheckMultiType: async (workplaceId) => {
            try {
              const res: Response<ChecklistMultiType[]> = await api
                .get(`site/w/sign/getaddchkclassification`, {
                  searchParams: { siteSeq: workplaceId },
                })
                .json();

              const data = res.data;

              set({ checklistMultiType: data });
            } catch (err) {
              console.log(err);
              const errMessage = await handleApiError(err);
              toast.error(errMessage);
            }
          },
          /* 선택한 체크리스트 */
          selectedAvailableChecklistItem: [],
          resetSelectedAvailableChecklistItem: () => {
            set({ selectedAvailableChecklistItem: [] });
          },
          updateSelectedAvailableChecklistItem: (checklist) => {
            set({ selectedAvailableChecklistItem: checklist });
          },
          createChecklist: initialCreateChecklist,
          setCreateChecklist: (value) => {
            set((prev) => ({
              createChecklist: { ...prev.createChecklist, ...value },
            }));
          },
          resetCreateChecklist: () => {
            set({ createChecklist: initialCreateChecklist });
          },
          availableChecklistItem: undefined,
          resetAvailableChecklistItem: () => {
            set({ availableChecklistItem: undefined });
          },
          getAvailableChecklistItem: async (
            workplaceId,
            serviceTypeSeq,
            divCodeSeq,
            typeCodeSeq
          ) => {
            try {
              const { createChecklist } = get();

              const finalServiceTypeSeq =
                serviceTypeSeq ?? createChecklist.serviceTypeSeq;
              const finalDivCodeSeq = divCodeSeq ?? createChecklist.divCodeSeq;
              const finalTypeCodeSeq =
                typeCodeSeq ?? createChecklist.typeCodeSeq;

              if (!finalServiceTypeSeq || !finalDivCodeSeq || !finalTypeCodeSeq)
                return;
              //site/w/sign/addsitechecklistclassification
              const res: Response<Checklist[]> = await api
                .get(`site/w/sign/getupsertchkclassification`, {
                  searchParams: {
                    siteSeq: workplaceId,
                    serviceTypeSeq: finalServiceTypeSeq,
                    divCodeSeq: finalDivCodeSeq,
                    typeCodeSeq: finalTypeCodeSeq,
                  },
                })
                .json();

              const data = res.data;
              set({ availableChecklistItem: data });
            } catch (err) {
              console.log(err);
              const errMessage = await handleApiError(err);
              toast.error(errMessage);
            }
          },
          deleteChecklist: async (
            siteSeq,
            serviceTypeSeq,
            divCodeSeq,
            typeCodeSeq
          ) => {
            try {
              const res: Response<boolean> = await api
                .delete(`site/w/sign/deletesitechklist`, {
                  searchParams: {
                    siteSeq,
                    serviceTypeSeq,
                    divCodeSeq,
                    typeCodeSeq,
                  },
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
        {
          name: "workplace-detail-checklist-store",
        }
      )
    )
  );
