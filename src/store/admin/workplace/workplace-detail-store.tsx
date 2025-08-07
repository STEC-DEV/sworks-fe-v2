import api from "@/lib/api/api-manager";
import { AdminListItem, SelectAdminList } from "@/types/admin/admin/user-list";
import { Contract } from "@/types/admin/workplace/contract-info";
import { WorkplaceDetail } from "@/types/admin/workplace/workplace-detail";
import { Response } from "@/types/common/response";
import { ListMeta, ListState } from "@/types/list-type";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface WorkplaceDetailState {
  //사업장
  workplace: WorkplaceDetail | undefined;
  getWorkplaceDetail: (id: number) => Promise<void>;
  //계약정보
  //조회
  contractList: Contract[] | undefined;
  getContractList: (workplaceId: string) => Promise<void>;
  //수정
  patchContract: (updateContract: Record<string, any>) => Promise<void>;

  //체크리스트
  //담당관리자
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
        patchContract: async (updateContract) => {
          console.log(updateContract);
          try {
            const res: Response<Number> = await api
              .patch(`site/w/sign/updatecontract`, {
                json: { ...updateContract },
              })
              .json();
            console.log(res);
          } catch (err) {
            console.log(err);
          }
        },
        // -------------------------체크리스트-------------------------
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
