import api from "@/lib/api/api-manager";
import { Response } from "@/types/common/response";
import { toast } from "sonner";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface EquipmentDetailState {
  equipmentDetail: EquipmentDetail | undefined;
  getEquipmentDetail: (equipSeq: string) => Promise<void>;
  patchUpdateEquipmentDetail: (formData: FormData) => Promise<void>;
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
        patchUpdateEquipmentDetail: async (formData) => {
          try {
            const res: Response<boolean> = await api
              .patch(`equipment/w/sign/updateEquipment`, {
                body: formData,
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
        name: "equipment-detail-store",
      }
    )
  )
);
