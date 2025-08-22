import api from "@/lib/api/api-manager";
import { Response } from "@/types/common/response";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface EquipmentDetailState {
  equipmentDetail: EquipmentDetail | undefined;
  getEquipmentDetail: (equipSeq: string) => Promise<void>;
}

export const useEquipmentDetailStore = create<EquipmentDetailState>()(
  devtools(
    persist<EquipmentDetailState>(
      (set, get) => ({
        equipmentDetail: undefined,
        getEquipmentDetail: async (equipSeq) => {
          if (!equipSeq) return;
          try {
            const res: Response<EquipmentDetail> = await api
              .get("equipment/w/sign/getequipmentdetail", {
                searchParams: { equipSeq },
              })
              .json();

            set({ equipmentDetail: res.data });
          } catch (err) {
            console.log(err);
          }
        },
      }),
      {
        name: "equipment-detail-store",
      }
    )
  )
);
