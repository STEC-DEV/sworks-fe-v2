import api from "@/lib/api/api-manager";
import { useAuthStore } from "@/store/auth/auth-store";
import { Response } from "@/types/common/response";
import { ListMeta, ListState } from "@/types/list-type";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface EquipmentMainState {
  equipmentList: ListState<EquipmentListItem>;
  getEquipmentList: (params: URLSearchParams) => Promise<void>;
  postAddEquipment: (value: FormData) => Promise<Response<number>>;
}

export const useEquipmentMainStore = create<EquipmentMainState>()(
  devtools(
    persist<EquipmentMainState>(
      (set, get) => ({
        equipmentList: { type: "loading" },
        getEquipmentList: async (params) => {
          if (
            params.size === 0 ||
            !params.get("pageNumber") ||
            !params.get("pageSize")
          ) {
            params.set("pageNumber", "1");
            params.set("pageSize", "20");
          }
          //사업장 조회
          const { enteredWorkplace } = useAuthStore.getState();
          if (!enteredWorkplace) return;
          try {
            const res = await api.get(`equipment/w/sign/getequipmentlist`, {
              searchParams: {
                siteSeq: enteredWorkplace?.siteSeq,
                ...Object.fromEntries(params),
              },
            });

            const response = (await res.json()) as Response<{
              data: EquipmentListItem[];
              meta: ListMeta;
            }>;
            set({ equipmentList: { type: "data", ...response.data } });
            console.log(response);
          } catch (err) {
            console.log(err);
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
