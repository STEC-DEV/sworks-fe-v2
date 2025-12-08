import api from "@/lib/api/api-manager";
import { handleApiError } from "@/lib/api/errorHandler";
import { useUIStore } from "@/store/common/ui-store";
import { WorkplaceListItem } from "@/types/admin/workplace/workplace-list";
import { Response } from "@/types/common/response";
import { ListData } from "@/types/list-type";
import { paramsCheck } from "@/utils/param";
import { toast } from "sonner";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

export const ADMIN_WORKPLACE_LOADING_KEYS = {
  LIST: "admin_workplace-list",
} as const;

interface WorkplaceListState {
  workplaceList: ListData<WorkplaceListItem> | null;
  loadingKeys: typeof ADMIN_WORKPLACE_LOADING_KEYS;
  getWorkplaceList: () => Promise<void>;
  postAddWorkplace: (value: Record<string, any>) => Promise<Response<number>>;
}

export const useWorkplaceListStore = create<WorkplaceListState>()(
  devtools(
    persist<WorkplaceListState>(
      (set, get) => ({
        workplaceList: null,
        loadingKeys: ADMIN_WORKPLACE_LOADING_KEYS,
        getWorkplaceList: async () => {
          const { setLoading, setError } = useUIStore.getState();
          const loadingKey = ADMIN_WORKPLACE_LOADING_KEYS.LIST;
          setLoading(loadingKey, true);
          try {
            if (typeof window === "undefined") return;
            const params = new URLSearchParams(window.location.search);
            const checkParams = paramsCheck(params);

            const res: Response<ListData<WorkplaceListItem>> = await api
              .get(`Site/W/sign/AllSiteList`, {
                searchParams: checkParams,
              })
              .json();

            set({
              workplaceList: res.data,
            });
          } catch (err) {
            console.error(err);
            const errMessage = await handleApiError(err);
            setError(loadingKey, errMessage);
            toast.error(errMessage);
          } finally {
            setLoading(loadingKey, false); // 항상 로딩 종료
          }
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
            const errMessage = await handleApiError(err);
            toast.error(errMessage);
            return response;
          }
        },
      }),
      { name: "workplace-list-store" }
    )
  )
);
