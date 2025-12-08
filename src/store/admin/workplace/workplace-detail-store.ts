import api from "@/lib/api/api-manager";
import { handleApiError } from "@/lib/api/errorHandler";
import { useUIStore } from "@/store/common/ui-store";
import { Workplace } from "@/types/admin/workplace/v2/workplace";
import { WorkplaceDetail } from "@/types/admin/workplace/workplace-detail";
import { Response } from "@/types/common/response";
import { toast } from "sonner";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

export const ADMIN_WORKPLACE_DETAIL_LOADING_KEYS = {
  INFO: "admin_workplace-info",
} as const;

interface WorkplaceDetailState {
  //렌더링 키
  loadingKeys: typeof ADMIN_WORKPLACE_DETAIL_LOADING_KEYS;
  //사업장
  workplace: Workplace | null;

  getWorkplaceDetail: (id: number) => Promise<void>;
  patchWorkplaceInfo: (updateWorkplace: Workplace) => Promise<void>;
}

export const useWorkplaceDetailStore = create<WorkplaceDetailState>()(
  devtools(
    persist<WorkplaceDetailState>(
      (set, get) => ({
        loadingKeys: ADMIN_WORKPLACE_DETAIL_LOADING_KEYS,
        workplace: null,

        getWorkplaceDetail: async (id) => {
          const { setLoading, setError } = useUIStore.getState();
          setLoading(ADMIN_WORKPLACE_DETAIL_LOADING_KEYS.INFO, true);
          try {
            const res: Response<WorkplaceDetail> = await api
              .get(`Site/W/sign/GetSiteDetail`, {
                searchParams: { siteSeq: id },
              })
              .json();

            set({ workplace: res.data });
          } catch (err) {
            console.log(err);
            const errMessage = await handleApiError(err);
            setError(ADMIN_WORKPLACE_DETAIL_LOADING_KEYS.INFO, errMessage);
            toast.error(errMessage);
          } finally {
            setLoading(ADMIN_WORKPLACE_DETAIL_LOADING_KEYS.INFO, false);
          }
        },

        patchWorkplaceInfo: async (updateWorkplace) => {
          try {
            const res: Response<number> = await api
              .patch(`site/w/sign/updatesiteinfo`, {
                json: { ...updateWorkplace },
              })
              .json();
            console.log(res);
            toast.success("저장");
          } catch (err) {
            console.log(err);
            const errMessage = await handleApiError(err);
            toast.success(errMessage);
          }
        },
      }),
      { name: "workplace-detail-store" }
    )
  )
);
