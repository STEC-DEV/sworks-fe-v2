import api from "@/lib/api/api-manager";
import { AdminListItem, SelectAdminList } from "@/types/admin/admin/user-list";
import { Response } from "@/types/common/response";
import { ListData } from "@/types/list-type";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { useWorkplaceDetailStore } from "./workplace-detail-store";
import { paramsCheck } from "@/utils/param";
import { useUIStore } from "@/store/common/ui-store";
import { toast } from "sonner";

export const WORKPLACE_MANAGER_LOADING_KEYS = {
  MANAGER: "admin_workplace_manager",
} as const;

interface WorkplaceManagerState {
  loadingKeys: typeof WORKPLACE_MANAGER_LOADING_KEYS;
  ////담당관리자
  managers: ListData<AdminListItem> | null;
  //--담당관리자 관련--
  getManagers: (params: URLSearchParams) => Promise<void>;
  getAllManagerList: (id: string, search?: string) => Promise<void>;
  allManagerList: SelectAdminList[] | undefined;
  //담당 관리자 수정 put
  putManagerList: (workplaceId: string, manager: number[]) => Promise<void>;
}

export const useWorkplaceManagerStore = create<WorkplaceManagerState>()(
  devtools(
    persist<WorkplaceManagerState>(
      (set, get) => ({
        loadingKeys: WORKPLACE_MANAGER_LOADING_KEYS,
        managers: null,
        getManagers: async (params) => {
          const checkParams = paramsCheck(params);
          const { setLoading, setError } = useUIStore.getState();
          const { workplace } = useWorkplaceDetailStore.getState();
          if (!workplace) return;
          params.set("siteSeq", workplace?.siteSeq.toString());

          setLoading(WORKPLACE_MANAGER_LOADING_KEYS.MANAGER, true);

          try {
            const res: Response<ListData<AdminListItem>> = await api
              .get(`Site/W/sign/GetSiteMasterInfo`, {
                searchParams: checkParams,
              })
              .json();

            set({
              managers: res.data,
            });
          } catch (err) {
            console.log(err);
            const errMessage =
              err instanceof Error
                ? err.message
                : "담당관리자 조회 문제가 발생하였습니다. 잠시후 다시 시도해주세요.";
            setError(WORKPLACE_MANAGER_LOADING_KEYS.MANAGER, errMessage);
            toast.error(errMessage);
          } finally {
            setLoading(WORKPLACE_MANAGER_LOADING_KEYS.MANAGER, false);
          }
        },
        getAllManagerList: async (siteId, search) => {
          try {
            const res: Response<object[]> = await api
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
      {
        name: "workplace-manager-store",
      }
    )
  )
);
