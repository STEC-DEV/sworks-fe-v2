import api from "@/lib/api/api-manager";
import { Response } from "@/types/common/response";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface EquipmentHistoryDetailState {
  historyDetail: EquipmentHistoryDetail | undefined;
  getHistoryDetail: (detailSeq: string) => Promise<void>;
  patchUpdateHistoryDetail: (values: any) => Promise<Response<boolean>>;
}

export const useEquipmentHistoryDetailStore =
  create<EquipmentHistoryDetailState>()(
    devtools(
      persist<EquipmentHistoryDetailState>(
        (set, get) => ({
          historyDetail: undefined,
          getHistoryDetail: async (detailSeq) => {
            console.log(detailSeq);
            if (!detailSeq) return;
            try {
              const res: Response<EquipmentHistoryDetail> = await api
                .get(`equipment/w/sign/getequipmenthistorydetail`, {
                  searchParams: { detailSeq },
                })
                .json();

              set({ historyDetail: res.data });
            } catch (err) {
              console.log(err);
            }
          },
          patchUpdateHistoryDetail: async (values) => {
            try {
              const res: Response<boolean> = await api
                .patch(`equipment/w/sign/updateequipmenthistory`, {
                  json: values,
                })
                .json();

              return res;
            } catch (err) {
              const res: Response<boolean> = {
                data: false,
                code: 500,
                message: "수정 에러",
              };
              return res;
            }
          },
        }),
        {
          name: "equipment-history-detail-store",
        }
      )
    )
  );
