import api from "@/lib/api/api-manager";
import { useAuthStore } from "@/store/auth/auth-store";
import { useUIStore } from "@/store/common/ui-store";
import { Response } from "@/types/common/response";
import { ListData, ListMeta, ListState } from "@/types/list-type";
import { paramsCheck } from "@/utils/param";
import { toast } from "sonner";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

export const EQUIPMENT_LOADING_KEYS = {
  LIST: "equipment_list",
} as const;

interface EquipmentMainState {
  loadingKeys: typeof EQUIPMENT_LOADING_KEYS;
  equipmentList: ListData<EquipmentListItem> | null;
  getEquipmentList: (params: URLSearchParams) => Promise<void>;
  postAddEquipment: (value: FormData) => Promise<Response<number>>;
}

export const useEquipmentMainStore = create<EquipmentMainState>()(
  devtools(
    persist<EquipmentMainState>(
      (set, get) => ({
        loadingKeys: EQUIPMENT_LOADING_KEYS,
        equipmentList: null,
        getEquipmentList: async (params) => {
          const checkParams = paramsCheck(params);
          //사업장 조회
          const { enteredWorkplace } = useAuthStore.getState();
          if (!enteredWorkplace) return;
          const { setLoading, setError } = useUIStore.getState();
          setLoading(EQUIPMENT_LOADING_KEYS.LIST, true);
          checkParams.set("siteSeq", enteredWorkplace?.siteSeq.toString());
          try {
            const res: Response<ListData<EquipmentListItem>> = await api
              .get(`equipment/w/sign/getequipmentlist`, {
                searchParams: checkParams,
              })
              .json();

            set({ equipmentList: res.data });
          } catch (err) {
            console.error(err);
            const errMessage =
              err instanceof Error
                ? err.message
                : "장비 조회 문제가 발생하였습니다. 잠시후 다시 시도해주세요.";
            setError(EQUIPMENT_LOADING_KEYS.LIST, errMessage);
            toast.error(errMessage);
          } finally {
            setLoading(EQUIPMENT_LOADING_KEYS.LIST, false);
          }
        },
        postAddEquipment: async (value) => {
          try {
            const res: Response<number> = await api
              .post("equipment/w/sign/addequipment", {
                body: value,
              })
              .json();
            return res;
          } catch (err) {
            console.log(err);
            const response: Response<number> = {
              code: 500,
              message: "요청 중 오류가 발생했습니다.",
              data: -1,
            };
            return response;
          }
        },
      }),
      { name: "equip-main-store" }
    )
  )
);
