import api from "@/lib/api/api-manager";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface EquipmentHistoryDetailState {
  historyDetail: EquipmentHistoryDetail | undefined;
  getHistoryDetail: (detailSeq: string) => Promise<void>;
}

export const useEquipmentHistoryDetailStore =
  create<EquipmentHistoryDetailState>()(
    devtools(
      persist<EquipmentHistoryDetailState>(
        (set, get) => ({
          historyDetail: undefined,
          getHistoryDetail: async (detailSeq) => {
            if (!detailSeq) return;
            try {
              const response: EquipmentHistoryDetail = await api
                .get(`equipment/w/sign/getequipmenthistorydetail`, {
                  searchParams: { detailSeq },
                })
                .json();

              set({ historyDetail: response });
            } catch (err) {
              console.log(err);
            }
          },
        }),
        {
          name: "equipment-history-detail-store",
        }
      )
    )
  );
