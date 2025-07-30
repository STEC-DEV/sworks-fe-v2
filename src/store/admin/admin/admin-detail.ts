import api from "@/lib/api/api-manager";
import { AdminListItem } from "@/types/admin/admin/user-list";
import { WorkplaceListItem } from "@/types/admin/workplace/workplace-list";
import { Response } from "@/types/common/response";
import { ListMeta, ListState } from "@/types/list-type";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface AdminDetailState {
  admin: AdminDetail | undefined;
  getAdminDetail: (id: number) => Promise<void>;
  adminWorkplaceList: ListState<WorkplaceListItem>;
  getAdminWorkplaceList: (params: URLSearchParams, id: string) => Promise<void>;
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
            const res = await api.get(`adminuser/w/sign/adminusersite`);
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
      }),
      { name: "admin-detail-store" }
    )
  )
);
