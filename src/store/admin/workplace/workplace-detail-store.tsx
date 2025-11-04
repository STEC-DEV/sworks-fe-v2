import api from "@/lib/api/api-manager";
import { AdminListItem, SelectAdminList } from "@/types/admin/admin/user-list";
import { ChecklistMultiType } from "@/types/admin/workplace/chk-types";
import { Contract } from "@/types/admin/workplace/contract-info";
import { Workplace } from "@/types/admin/workplace/v2/workplace";
import { WorkplaceDetail } from "@/types/admin/workplace/workplace-detail";
import { ContractType } from "@/types/common/basic-code";
import { Response } from "@/types/common/response";
import { ListMeta, ListState } from "@/types/list-type";
import { toast } from "sonner";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface WorkplaceDetailState {
  //사업장
  workplace: Workplace | undefined;
  getWorkplaceDetail: (id: number) => Promise<void>;
  patchWorkplaceInfo: (updateWorkplace: Workplace) => Promise<void>;
  ////계약정보
  //조회
  contractList: Contract[] | undefined;
  getContractList: (workplaceId: string) => Promise<void>;
  workplaceContractTypeList: ContractType[] | undefined;
  getWorkplaceServiceType: (workplaceId: string) => Promise<void>;
  //등록
  postAddContract: (value: Record<string, any>) => Promise<Response<number>>;
  //수정
  patchContract: (updateContract: Record<string, any>) => Promise<void>;

  ////체크리스트
  /* 전체 조회 */
  checklist: WorkplaceChecklist[] | undefined;
  getChecklist: (workplaceId: string) => Promise<void>;
  /* 상세 조회 */
  checklistDetail: ChecklistDetail | undefined;
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

  ////담당관리자
  managers: ListState<AdminListItem>;
  //--담당관리자 관련--
  getManagers: (params: URLSearchParams) => Promise<void>;
  getAllManagerList: (id: string, search?: string) => Promise<void>;
  allManagerList: SelectAdminList[] | undefined;
  //담당 관리자 수정 put
  putManagerList: (workplaceId: string, manager: number[]) => Promise<void>;
}

const initialCreateChecklist: CreateChecklist = {
  serviceTypeSeq: undefined,
  divCodeSeq: undefined,
  typeCodeSeq: undefined,
  chkMainSeq: [],
};

export const useWorkplaceDetailStore = create<WorkplaceDetailState>()(
  devtools(
    persist<WorkplaceDetailState>(
      (set, get) => ({
        workplace: undefined,
        getWorkplaceDetail: async (id) => {
          try {
            const res = await api.get(`Site/W/sign/GetSiteDetail`, {
              searchParams: { siteSeq: id },
            });

            if (!res.ok) return;

            const response: Response<WorkplaceDetail> = await res.json();

            set({ workplace: response.data });
          } catch (err) {
            console.log(err);
          }
        },

        patchWorkplaceInfo: async (updateWorkplace) => {
          try {
            const res: Response<number> = await api
              .patch(`site/w/sign/updatesiteinfo`, {
                json: { ...updateWorkplace },
              })
              .json();
            console.log(res);
            toast.success("저장");
          } catch (err) {
            console.log(err);
            toast.success("저장실패");
          }
        },
        // -------------------------계약정보-------------------------
        contractList: undefined,
        getContractList: async (workplaceId) => {
          try {
            const res: Response<Contract[]> = await api
              .get(`site/w/sign/getcontractdetail`, {
                searchParams: { siteSeq: workplaceId },
              })
              .json();
            const data = res.data;
            set({ contractList: data });

            console.log(data);
          } catch (err) {
            console.log(err);
          }
        },
        postAddContract: async (value): Promise<Response<number>> => {
          console.log(value);
          try {
            const res: Response<number> = await api
              .post(`site/w/sign/addcontract`, {
                json: { ...value },
              })
              .json();
            return res;
          } catch (err) {
            console.log(err);

            return {
              code: 500,
              data: 0,
              message: "등록 실패",
            };
          }
        },
        patchContract: async (updateContract) => {
          console.log(updateContract);
          try {
            const res: Response<Number> = await api
              .patch(`site/w/sign/updatecontract`, {
                json: { ...updateContract },
              })
              .json();
            toast.success("저장");
          } catch (err) {
            console.log(err);
            toast.error("저장 실패. 다시 시도해주세요.");
          }
        },
        workplaceContractTypeList: undefined,
        getWorkplaceServiceType: async (workplaceId) => {
          try {
            const res: Response<ContractType[]> = await api
              .get(`site/w/sign/classificationlist`, {
                searchParams: { siteSeq: workplaceId },
              })
              .json();
            console.log(res.data);
            const data = res.data;

            set({ workplaceContractTypeList: data });
          } catch (err) {
            console.log(err);
          }
        },
        // -------------------------체크리스트-------------------------
        checklist: undefined,
        getChecklist: async (workplaceId) => {
          try {
            const res: Response<WorkplaceChecklist[]> = await api
              .get(`site/w/sign/getsitechecklistdetail`, {
                searchParams: { siteSeq: workplaceId },
              })
              .json();

            console.log(res.data);
            const data = res.data;
            set({ checklist: data });
          } catch (err) {
            console.log(err);
          }
        },
        checklistDetail: undefined,
        getChecklistDetail: async (
          siteSeq,
          serviceTypeSeq,
          divCodeSeq,
          typeCodeSeq
        ) => {
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
            const data = res.data;

            set({ checklistDetail: data });
            console.log(res);
          } catch (err) {
            console.log(err);
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
            resetCreateChecklist();
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
            const finalTypeCodeSeq = typeCodeSeq ?? createChecklist.typeCodeSeq;

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
          }
        },
        // -------------------------관리자-------------------------

        managers: { type: "loading" },
        getManagers: async (params) => {
          if (
            params.size === 0 ||
            !params.get("pageNumber") ||
            !params.get("pageSize")
          ) {
            params.set("pageNumber", "1");
            params.set("pageSize", "20");
          }

          const { workplace } = get();
          if (!workplace) return;
          params.set("siteSeq", workplace?.siteSeq.toString());

          try {
            const res = await api.get(`Site/W/sign/GetSiteMasterInfo`, {
              searchParams: params,
            });

            // return ok 200이 아닌경우
            if (!res.ok) {
              set({
                managers: { type: "error", message: "에러" },
              });
            }

            const response = (await res.json()) as Response<{
              data: AdminListItem[];
              meta: ListMeta;
            }>;

            set({
              managers: { type: "data", payload: response.data },
            });
          } catch (err) {
            console.log(err);
          }
        },
        getAllManagerList: async (siteId, search) => {
          try {
            const res: Response<Object[]> = await api
              .get(`site/w/sign/sitemanagerclassification`, {
                searchParams: { siteSeq: siteId, searchKey: search ?? "" },
              })
              .json();

            const data = res.data;

            set({ allManagerList: data as SelectAdminList[] });
          } catch (err) {
            console.log(err);
          }
        },
        allManagerList: undefined,

        putManagerList: async (workplaceId, manager) => {
          try {
            const res = await api.put(`site/w/sign/updatesitemanager`, {
              json: {
                siteSeq: workplaceId,
                userSeq: manager,
              },
            });
          } catch (err) {
            console.log(err);
          }
        },
      }),
      { name: "workplace-detail-store" }
    )
  )
);
