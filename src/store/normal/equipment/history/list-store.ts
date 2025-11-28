import api from "@/lib/api/api-manager";
import { useUIStore } from "@/store/common/ui-store";
import { Response } from "@/types/common/response";
import { ListData, ListMeta, ListState } from "@/types/list-type";
import { paramsCheck } from "@/utils/param";
import { toast } from "sonner";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

export const HISTORY_LOADING_KEYS = {
  LIST: "history_key",
} as const;

interface EquipmentHistoryMainState {
  loadingKeys: typeof HISTORY_LOADING_KEYS;
  historyList: ListData<EquipmentHistoryListItem> | null;
  getHistoryList: (param: URLSearchParams, equipSeq: string) => Promise<void>;
  postAddHistory: (values: any) => Promise<Response<boolean>>;
}

export const useEquipmentHistoryMainStore = create<EquipmentHistoryMainState>()(
  devtools(
    persist<EquipmentHistoryMainState>(
      (set, get) => ({
        loadingKeys: HISTORY_LOADING_KEYS,
        historyList: null,
        getHistoryList: async (param, equipSeq) => {
          if (!equipSeq || !param) return;
          const params = paramsCheck(param);
          params.set("equipSeq", equipSeq);
          const { setError, setLoading } = useUIStore.getState();
          setLoading(HISTORY_LOADING_KEYS.LIST, true);
          try {
            const res: Response<ListData<EquipmentHistoryListItem>> = await api
              .get("equipment/w/sign/getequipmenthistory", {
                searchParams: params,
              })
              .json();

            set({ historyList: res.data });
          } catch (err) {
            console.error(err);
            const errMessage =
              err instanceof Error
                ? err.message
                : "관리이력 조회 문제가 발생하였습니다. 잠시후 다시 시도해주세요.";
            setError(HISTORY_LOADING_KEYS.LIST, errMessage);
            toast.error(errMessage);
          } finally {
            setLoading(HISTORY_LOADING_KEYS.LIST, false);
          }
        },
        postAddHistory: async (values) => {
          try {
            const res: Response<boolean> = await api
              .post(`equipment/w/sign/addequipmenthistory`, {
                json: values,
              })
              .json();

            return res;
          } catch (err) {
            const res: Response<boolean> = {
              data: false,
              code: 500,
              message: "에러 발생",
            };
            return res;
          }
        },
      }),
      {
        name: "equipment-history-main-store",
      }
    )
  )
);
