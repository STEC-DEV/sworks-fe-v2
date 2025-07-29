import api from "@/lib/api/api-manager";
import { AdminList, AdminListItem } from "@/types/admin/user/user-list";
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

  //체크리스트
  //담당관리자
  managers: ListState<AdminList>;
  getManagers: () => Promise<void>;
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
        managers: { type: "loading" },
        getManagers: async () => {
          if (typeof window === "undefined") return;
          const params = new URLSearchParams(window.location.search);

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
              data: AdminList[];
              meta: ListMeta;
            }>;

            set({
              managers: { type: "data", ...response.data },
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
