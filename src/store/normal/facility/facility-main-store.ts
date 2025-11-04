import api from "@/lib/api/api-manager";
import { useAuthStore } from "@/store/auth/auth-store";
import { Response } from "@/types/common/response";
import { ListData, ListMeta, ListState } from "@/types/list-type";
import { convertRecordDataToFormData, objectToFormData } from "@/utils/convert";
import { paramsCheck } from "@/utils/param";
import { toast } from "sonner";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface FacilityMainState {
  facilityList: ListState<FacilityListItem>;
  getFacilityList: (
    params: URLSearchParams,
    facilitySeq: string
  ) => Promise<void>;
  postAddFacility: (value: Record<string, any>) => Promise<Response<number>>;
}

export const useFacilityMainStore = create<FacilityMainState>()(
  devtools(
    persist<FacilityMainState>(
      (set, get) => ({
        facilityList: {
          type: "loading",
        },
        getFacilityList: async (params, facilitySeq) => {
          //사업장 조회
          const { enteredWorkplace } = useAuthStore.getState();
          const checkParam = paramsCheck(params);

          if (!enteredWorkplace) return;

          checkParam.set("siteSeq", enteredWorkplace?.siteSeq.toString());
          checkParam.set("facilityType", facilitySeq);

          try {
            const res: Response<ListData<FacilityListItem>> = await api
              .get(`facility/w/sign/getfacilitylist`, {
                searchParams: checkParam,
              })
              .json();

            set({ facilityList: { type: "data", payload: res.data } });
          } catch (err) {
            console.log(err);
            toast.error("조회 실패");
          }
        },
        postAddFacility: async (value) => {
          // const formData = convertRecordDataToFormData(value);
          const formData = objectToFormData(value);

          try {
            const res: Response<number> = await api
              .post("facility/w/sign/addfacility", {
                body: formData,
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
      {
        name: "facility-main-store",
      }
    )
  )
);
