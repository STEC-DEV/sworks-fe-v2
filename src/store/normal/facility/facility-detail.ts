import api from "@/lib/api/api-manager";
import { useUIStore } from "@/store/common/ui-store";
import { Response } from "@/types/common/response";
import { FacilityDetail } from "@/types/normal/facility/fac-detail";
import { toast } from "sonner";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

export const FACILITY_DETAIL_LOADING_KEYS = {
  INFO: "facility_info",
} as const;

interface FacilityDetailState {
  loadingKeys: typeof FACILITY_DETAIL_LOADING_KEYS;
  facilityDetail: FacilityDetail | null;
  getFacilityDetail: (facilitySeq: string) => Promise<void>;
  updateFacilityDetail: (data: FormData) => Promise<Response<boolean>>;
}

export const useFacilityDetailStore = create<FacilityDetailState>()(
  devtools(
    persist<FacilityDetailState>(
      (set, get) => ({
        loadingKeys: FACILITY_DETAIL_LOADING_KEYS,
        facilityDetail: null,
        getFacilityDetail: async (facilitySeq) => {
          const { setError, setLoading } = useUIStore.getState();
          setLoading(FACILITY_DETAIL_LOADING_KEYS.INFO, true);
          try {
            const res: Response<FacilityDetail> = await api
              .get(`facility/w/sign/getfacilitydetail`, {
                searchParams: { facilitySeq },
              })
              .json();

            set({ facilityDetail: res.data });
          } catch (err) {
            console.error(err);
            const errMessage =
              err instanceof Error
                ? err.message
                : "상세정보 조회 문제가 발생하였습니다. 잠시후 다시 시도해주세요.";
            setError(FACILITY_DETAIL_LOADING_KEYS.INFO, errMessage);
            toast.error(errMessage);
          } finally {
            setLoading(FACILITY_DETAIL_LOADING_KEYS.INFO, false);
          }
        },
        updateFacilityDetail: async (data) => {
          // Object.entries(data).map(([key, value]) => console.log(key, value));

          try {
            const res: Response<boolean> = await api
              .patch("facility/w/sign/updatefacility", {
                body: data,
              })
              .json();
            return res;
          } catch (err) {
            // console.log(err);
            console.error(err);
            const response: Response<boolean> = {
              data: false,
              code: 500,
              message: "수정 실패 : 에러가 발생했습니다.",
            };
            return response;
          }
        },
      }),
      {
        name: "facility-detail-store",
      }
    )
  )
);
