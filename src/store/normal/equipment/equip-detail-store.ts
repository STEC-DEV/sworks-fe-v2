import api from "@/lib/api/api-manager";
import { Response } from "@/types/common/response";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface EquipmentDetailState {
  equipmentDetail: EquipmentDetail | undefined;
  getEquipmentDetail: (equipSeq: string) => Promise<void>;
  patchUpdateEquipmentDetail: (
    formData: FormData
  ) => Promise<Response<boolean>>;
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

            return res;
          } catch (err) {
            const res: Response<boolean> = {
              data: false,
              code: 500,
              message: "수정 실패. 에러가 발생하였습니다.",
            };
            return res;
          }
        },
      }),
      {
        name: "equipment-detail-store",
      }
    )
  )
);
