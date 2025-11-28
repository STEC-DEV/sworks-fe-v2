import api from "@/lib/api/api-manager";
import { useUIStore } from "@/store/common/ui-store";
import { Response } from "@/types/common/response";
import { toast } from "sonner";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

export const EQUIPMENT_DETAIL_LOADING_KEYS = {
  INFO: "equipment_info",
} as const;

interface EquipmentDetailState {
  loadingKeys: typeof EQUIPMENT_DETAIL_LOADING_KEYS;
  equipmentDetail: EquipmentDetail | null;
  getEquipmentDetail: (equipSeq: string) => Promise<void>;
  patchUpdateEquipmentDetail: (formData: FormData) => Promise<void>;
}

export const useEquipmentDetailStore = create<EquipmentDetailState>()(
  devtools(
    persist<EquipmentDetailState>(
      (set, get) => ({
        loadingKeys: EQUIPMENT_DETAIL_LOADING_KEYS,
        equipmentDetail: null,
        getEquipmentDetail: async (equipSeq) => {
          if (!equipSeq) return;
          const { setError, setLoading } = useUIStore.getState();

          setLoading(EQUIPMENT_DETAIL_LOADING_KEYS.INFO, true);
          try {
            const res: Response<EquipmentDetail> = await api
              .get("equipment/w/sign/getequipmentdetail", {
                searchParams: { equipSeq },
              })
              .json();

            set({ equipmentDetail: res.data });
          } catch (err) {
            console.log(err);
            const errMessage =
              err instanceof Error
                ? err.message
                : "장비 조회 문제가 발생하였습니다. 잠시후 다시 시도해주세요.";
            setError(EQUIPMENT_DETAIL_LOADING_KEYS.INFO, errMessage);
            toast.error(errMessage);
          } finally {
            setLoading(EQUIPMENT_DETAIL_LOADING_KEYS.INFO, false);
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
