import api from "@/lib/api/api-manager";
import { AdminListItem } from "@/types/admin/admin/user-list";
import { Response } from "@/types/common/response";
import { ListMeta, ListState } from "@/types/list-type";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface AdminListState {
  adminList: ListState<AdminListItem>;
  getAdminList: (params: URLSearchParams) => Promise<void>;
  postAddAdmin: (value: Record<string, any>) => Promise<Response<number>>;
}

export const useAdminListStore = create<AdminListState>()(
  devtools(
    persist<AdminListState>(
      (set, get) => ({
        adminList: { type: "loading" },
        getAdminList: async (params) => {

          if (
            params.size === 0 ||
            !params.get("pageNumber") ||
            !params.get("pageSize")
          ) {
            params.set("pageNumber", "1");
            params.set("pageSize", "20");
          }

          const res = await api.get(`AdminUser/W/sign/AdminList`, {
            searchParams: params,
          });

          /**에러 발생 */
          if (!res.ok) {
            set({
              adminList: { type: "error", error: "데이터 조회 실패" },
            });
            return;
          }

          const response = (await res.json()) as Response<{
            data: AdminListItem[];
            meta: ListMeta;
          }>;

          set({
            adminList: { type: "data", ...response.data },
          });
        },
        postAddAdmin: async (value) => {
          const formData = new FormData();

          Object.entries(value).map(([key, val]) => {
            formData.append(key, val);
          });
          try {
            const res = await api.post(`AdminUser/W/sign/AddAdmin`, {
              body: formData,
            });
            const response = (await res.json()) as Response<number>;

            if (!res.ok) return response;

            return response;
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
      }),
      { name: "admin-list-store" }
    )
  )
);
