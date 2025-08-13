import api from "@/lib/api/api-manager";
import { AdminListItem, SelectAdminList } from "@/types/admin/admin/user-list";
import { ChecklistMultiType } from "@/types/admin/workplace/chk-types";
import { Contract } from "@/types/admin/workplace/contract-info";
import { WorkplaceDetail } from "@/types/admin/workplace/workplace-detail";
import { ContractType } from "@/types/common/basic-code";
import { Response } from "@/types/common/response";
import { ListMeta, ListState } from "@/types/list-type";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface WorkplaceDetailState {
  //사업장
  workplace: WorkplaceDetail | undefined;
  getWorkplaceDetail: (id: number) => Promise<void>;
  patchWorkplaceInfo: (updateWorkplace: WorkplaceDetail) => Promise<void>;
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
  //조회
  checklist: WorkplaceChecklist[] | undefined;
  getChecklist: (workplaceId: string) => Promise<void>;

  //생성
  checklistMultiType: ChecklistMultiType[] | undefined;
  getCheckMultiType: (workplaceId: string) => Promise<void>;
  /* 체크리스트 생성 객체*/
  createChecklist: CreateChecklist;
  setCreateChecklist: (value: Record<string, any>) => void;
  resetCreateChecklist: () => void;
  /* 선택한 유형의 체크리스트 조회 */
  availableChecklistItem: Checklist[] | undefined;
  getAvailableChecklistItem: (workplaceId: string) => Promise<void>;
  /* 선택한 체크리스트 */
  selectedAvailableChecklistItem: Checklist[];
  resetSelectedAvailableChecklistItem: () => void;
  updateSelectedAvailableChecklistItem: (checklist: Checklist[]) => void;

  ////담당관리자
  managers: ListState<AdminListItem>;
  //--담당관리자 관련--
  getManagers: (params: URLSearchParams) => Promise<void>;
  getAllManagerList: (id: string, search?: string) => Promise<void>;
  allManagerList: AdminListItem[] | undefined;
  selectedManagerList: number[];
  //선택 리스트 수정
  updateSelectedManagerList: (listId: number) => void;
  //담당 관리자 수정 put
  putManagerList: (workplaceId: string) => Promise<void>;
}

const initialCreateChecklist: CreateChecklist = {
  serviceTypeSeq: undefined,
  divCodeSeq: undefined,
  typeCodeSeq: undefined,
  mains: [],
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
          } catch (err) {
            console.log(err);
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
          } catch (err) {
            console.log(err);
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

            const data = await res.data;

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
          console.log(checklist);
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
        getAvailableChecklistItem: async (workplaceId) => {
          try {
            const { createChecklist } = get();
            if (
              !createChecklist.serviceTypeSeq ||
              !createChecklist.divCodeSeq ||
              !createChecklist.typeCodeSeq
            )
              return;
            const res: Response<Checklist[]> = await api
              .get(`site/w/sign/addsitechecklistclassification`, {
                searchParams: {
                  siteSeq: workplaceId,
                  serviceTypeSeq: createChecklist.serviceTypeSeq,
                  divCodeSeq: createChecklist.divCodeSeq,
                  typeCodeSeq: createChecklist.typeCodeSeq,
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
                managers: { type: "error", error: "데이터 조회 실패" },
              });
            }

            const response = (await res.json()) as Response<{
              data: AdminListItem[];
              meta: ListMeta;
            }>;

            set({
              managers: { type: "data", ...response.data },
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

            set({ allManagerList: data as AdminListItem[] });
            set({
              selectedManagerList: (data as SelectAdminList[])
                .filter((v, i) => v.isAdminSite === true)
                .map((v) => v.userSeq),
            });
          } catch (err) {
            console.log(err);
          }
        },
        allManagerList: undefined,
        selectedManagerList: [],
        updateSelectedManagerList: async (listId) => {
          console.log(listId);
          set((prev) => {
            const managers = prev.selectedManagerList;
            return {
              selectedManagerList: managers.includes(listId)
                ? managers.filter((v) => v !== listId)
                : [...managers, listId],
            };
          });
        },
        putManagerList: async (workplaceId) => {
          const { selectedManagerList } = get();
          try {
            const res = await api.put(`site/w/sign/updatesitemanager`, {
              json: {
                siteSeq: workplaceId,
                userSeq: selectedManagerList,
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
