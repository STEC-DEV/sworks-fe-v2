import api from "@/lib/api/api-manager";
import { Response } from "@/types/common/response";
import { toast } from "sonner";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface EquipmentHistoryDetailState {
  historyDetail: EquipmentHistoryDetail | undefined;
  getHistoryDetail: (detailSeq: string) => Promise<void>;
  patchUpdateHistoryDetail: (values: any) => Promise<void>;
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
              toast.success("저장");
            } catch (err) {
              console.error(err);
              toast.error("문제가 발생하였습니다. 잠시후 다시 시도해주세요.");
            }
          },
        }),
        {
          name: "equipment-history-detail-store",
        }
      )
    )
  );
