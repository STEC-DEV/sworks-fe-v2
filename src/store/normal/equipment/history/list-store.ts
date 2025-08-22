import api from "@/lib/api/api-manager";
import { Response } from "@/types/common/response";
import { ListMeta, ListState } from "@/types/list-type";
import { paramsCheck } from "@/utils/param";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface EquipmentHistoryMainState {
  historyList: ListState<EquipmentHistoryListItem>;
  getHistoryList: (param: URLSearchParams, equipSeq: string) => Promise<void>;
}

export const useEquipmentHistoryMainStore = create<EquipmentHistoryMainState>()(
  devtools(
    persist<EquipmentHistoryMainState>(
      (set, get) => ({
        historyList: { type: "loading" },
        getHistoryList: async (param, equipSeq) => {
          if (!equipSeq || !param) return;
          const params = paramsCheck(param);
          params.set("equipSeq", equipSeq);

          try {
            const res = await api.get("equipment/w/sign/getequipmenthistory", {
              searchParams: params,
            });

            const response = (await res.json()) as Response<{
              data: EquipmentHistoryListItem[];
              meta: ListMeta;
            }>;

            set({ historyList: { type: "data", ...response.data } });
          } catch (err) {
            console.log(err);
          }
        },
      }),
      {
        name: "equipment-history-main-store",
      }
    )
  )
);
