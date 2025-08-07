import api from "@/lib/api/api-manager";
import { AdminListItem } from "@/types/admin/admin/user-list";
import {
  SelectWorkplaceList,
  WorkplaceListItem,
} from "@/types/admin/workplace/workplace-list";
import { Response } from "@/types/common/response";
import { ListMeta, ListState } from "@/types/list-type";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface AdminDetailState {
  admin: AdminDetail | undefined;
  getAdminDetail: (id: number) => Promise<void>;
  adminWorkplaceList: ListState<WorkplaceListItem>;
  getAdminWorkplaceList: (params: URLSearchParams, id: string) => Promise<void>;

  //--관리자 정보 수정--
  patchAdminInfo: (admin: Record<string, any>) => Promise<void>;

  //담당 사업장 수정 시 전체 조회 api
  getAllWorkplace: (id: string, search?: string) => Promise<void>;
  allWorkplace: WorkplaceListItem[] | undefined;
  //선택된 사업장
  selectedWorkplaceList: number[];
  //리스트 수정
  updateSelectedWorkplaces: (listId: number) => void;
  //담당 사업장 수정 put
  putAdminWorkplaceList: (userId: string) => Promise<void>;
}

export const useAdminDetailStore = create<AdminDetailState>()(
  devtools(
    persist<AdminDetailState>(
      (set, get) => ({
        admin: undefined,
        getAdminDetail: async (id) => {
          try {
            const res = await api.get(`adminuser/w/sign/adminprofile`, {
              searchParams: { userSeq: id },
            });
            const response: Response<AdminDetail> = await res.json();

            set({ admin: response.data });
          } catch (err) {
            console.log(err);
          }
        },
        adminWorkplaceList: { type: "loading" },
        getAdminWorkplaceList: async (params, id) => {
          if (
            params.size === 0 ||
            !params.get("pageNumber") ||
            !params.get("pageSize")
          ) {
            params.set("pageNumber", "1");
            params.set("pageSize", "20");
          }
          params.set("userSeq", id);

          try {
            const res = await api.get(`adminuser/w/sign/adminusersite`, {
              searchParams: params,
            });
            const response = (await res.json()) as Response<{
              data: WorkplaceListItem[];
              meta: ListMeta;
            }>;

            set({
              adminWorkplaceList: { type: "data", ...response.data },
            });
          } catch (err) {
            console.log(err);
            set({
              adminWorkplaceList: { type: "error", error: "데이터 조회 실패" },
            });
          }
        },
        patchAdminInfo: async (admin) => {
          const formData = new FormData();
          Object.entries(admin).map(([key, val]) => {
            formData.append(key, val);
          });
          try {
            const res = await api.patch(`adminuser/w/sign/updateadmin`, {
              body: formData,
            });
            const response = (await res.json()) as Response<number>;
          } catch (err) {
            console.log(err);
          }
        },
        getAllWorkplace: async (id, search) => {
          try {
            const res: Response<Object[]> = await api
              .get(`adminuser/w/sign/adminsiteclassification`, {
                searchParams: { userSeq: id, searchKey: search ?? "" },
              })
              .json();
            const data = res.data;

            set({ allWorkplace: data as WorkplaceListItem[] });
            set({
              selectedWorkplaceList: (data as SelectWorkplaceList[])
                .filter((v, i) => v.isAdminSite === true)
                .map((v) => v.siteSeq),
            });
          } catch (err) {
            console.log(err);
          }
        },
        allWorkplace: undefined,
        selectedWorkplaceList: [],
        updateSelectedWorkplaces: (id) => {
          set((prev) => {
            const workplaces = prev.selectedWorkplaceList;
            return {
              selectedWorkplaceList: workplaces.includes(id)
                ? workplaces.filter((v) => v !== id)
                : [...workplaces, id],
            };
          });
        },
        putAdminWorkplaceList: async (userId) => {
          const { selectedWorkplaceList } = get();

          try {
            const res = await api.put(`adminuser/w/sign/updateadminsite`, {
              json: {
                userSeq: userId,
                siteSeq: selectedWorkplaceList,
              },
            });
          } catch (error) {
            console.log(error);
          }
        },
      }),
      { name: "admin-detail-store" }
    )
  )
);
