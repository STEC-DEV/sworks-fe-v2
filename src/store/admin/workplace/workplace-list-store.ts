import api from "@/lib/api/api-manager";
import { WorkplaceListItem } from "@/types/admin/workplace/workplace-list";
import { Response } from "@/types/common/response";
import { ListMeta, ListState } from "@/types/list-type";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface WorkplaceListState {
  workplaceList: ListState<WorkplaceListItem>;
  getWorkplaceList: () => Promise<void>;
  postAddWorkplace: (value: Record<string, any>) => Promise<Response<number>>;
}

export const useWorkplaceListStore = create<WorkplaceListState>()(
  devtools(
    persist<WorkplaceListState>(
      (set, get) => ({
        workplaceList: { type: "loading" },
        getWorkplaceList: async () => {
          if (typeof window === "undefined") return;
          const params = new URLSearchParams(window.location.search);

          if (
            params.size === 0 &&
            !params.get("pageNumber") &&
            !params.get("pageSize")
          ) {
            params.set("pageNumber", "1");
            params.set("pageSize", "20");
          }

          const res = await api.get(`Site/W/sign/AllSiteList`, {
            searchParams: params,
          });

          /**에러 발생 */
          if (!res.ok) {
            set({
              workplaceList: { type: "error", error: "데이터 조회 실패" },
            });
            return;
          }
          const response = (await res.json()) as Response<{
            data: WorkplaceListItem[];
            meta: ListMeta;
          }>;

          set({
            workplaceList: { type: "data", ...response.data },
          });
        },
        postAddWorkplace: async (value) => {
          try {
            const res = await api.post(`Site/W/sign/AddSite`, {
              json: value,
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
      { name: "workplace-list-store" }
    )
  )
);
