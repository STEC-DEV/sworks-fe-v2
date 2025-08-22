import api from "@/lib/api/api-manager";
import { Response } from "@/types/common/response";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface FacilityDetailState {
  facilityDetail: FacilityDetail | undefined;
  getFacilityDetail: (facilitySeq: string) => Promise<void>;
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
      }),
      {
        name: "facility-detail-store",
      }
    )
  )
);
