import api from "@/lib/api/api-manager";
import { handleApiError } from "@/lib/api/errorHandler";
import { useUIStore } from "@/store/common/ui-store";
import { AdminListItem } from "@/types/admin/admin/user-list";
import { Response } from "@/types/common/response";
import { ListData } from "@/types/list-type";
import { paramsCheck } from "@/utils/param";
import { toast } from "sonner";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

export const ADMIN_LIST_LOADING_KEYS = {
  LIST: "admin-list",
} as const;

interface AdminListState {
  loadingKeys: typeof ADMIN_LIST_LOADING_KEYS;
  adminList: ListData<AdminListItem> | null;
  getAdminList: (params: URLSearchParams) => Promise<void>;
  postAddAdmin: (value: Record<string, any>) => Promise<Response<number>>;
}

export const useAdminListStore = create<AdminListState>()(
  devtools(
    persist<AdminListState>(
      (set, get) => ({
        loadingKeys: ADMIN_LIST_LOADING_KEYS,
        adminList: null,
        getAdminList: async (params) => {
          const checkParams = paramsCheck(params);
          const { setError, setLoading } = useUIStore.getState();
          setLoading(ADMIN_LIST_LOADING_KEYS.LIST, true);
          try {
            const res: Response<ListData<AdminListItem>> = await api
              .get(`AdminUser/W/sign/AdminList`, {
                searchParams: checkParams,
              })
              .json();

            set({
              adminList: res.data,
            });
          } catch (err) {
            console.error(err);
            const errMessage = await handleApiError(err);
            setError(ADMIN_LIST_LOADING_KEYS.LIST, errMessage);
            toast.error(errMessage);
          } finally {
            setLoading(ADMIN_LIST_LOADING_KEYS.LIST, false);
          }
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
            const errMessage = await handleApiError(err);
            const response: Response<number> = {
              code: 500,
              message: "요청 중 오류가 발생했습니다.",
              data: -1,
            };
            toast.error(errMessage);
            return response;
          }
        },
      }),
      { name: "admin-list-store" }
    )
  )
);
