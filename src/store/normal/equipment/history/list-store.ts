import api from "@/lib/api/api-manager";
import { Response } from "@/types/common/response";
import { ListData, ListMeta, ListState } from "@/types/list-type";
import { paramsCheck } from "@/utils/param";
import { toast } from "sonner";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface EquipmentHistoryMainState {
  historyList: ListState<EquipmentHistoryListItem>;
  getHistoryList: (param: URLSearchParams, equipSeq: string) => Promise<void>;
  postAddHistory: (values: any) => Promise<Response<boolean>>;
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
            const res: Response<ListData<EquipmentHistoryListItem>> = await api
              .get("equipment/w/sign/getequipmenthistory", {
                searchParams: params,
              })
              .json();

            set({ historyList: { type: "data", payload: res.data } });
          } catch (err) {
            console.log(err);
            toast.error("관리이력 조회 실패");
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
