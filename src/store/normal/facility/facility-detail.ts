import api from "@/lib/api/api-manager";
import { Response } from "@/types/common/response";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface FacilityDetailState {
  facilityDetail: FacilityDetail | undefined;
  getFacilityDetail: (facilitySeq: string) => Promise<void>;
  updateFacilityDetail: (data: FormData) => Promise<Response<boolean>>;
}

export const useFacilityDetailStore = create<FacilityDetailState>()(
  devtools(
    persist<FacilityDetailState>(
      (set, get) => ({
        facilityDetail: undefined,
        getFacilityDetail: async (facilitySeq) => {
          try {
            const res: Response<FacilityDetail> = await api
              .get(`facility/w/sign/getfacilitydetail`, {
                searchParams: { facilitySeq },
              })
              .json();

            set({ facilityDetail: res.data });
          } catch (err) {
            console.log(err);
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
