import api from "@/lib/api/api-manager";
import { useUIStore } from "@/store/common/ui-store";
import { Response } from "@/types/common/response";
import { toast } from "sonner";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

export const HISTORY_DETAIL_LOADING_KEYS = {
  INFO: "history_info",
} as const;

interface EquipmentHistoryDetailState {
  loadingKeys: typeof HISTORY_DETAIL_LOADING_KEYS;
  historyDetail: EquipmentHistoryDetail | undefined;
  getHistoryDetail: (detailSeq: string) => Promise<void>;
  patchUpdateHistoryDetail: (values: any) => Promise<void>;
}

export const useEquipmentHistoryDetailStore =
  create<EquipmentHistoryDetailState>()(
    devtools(
      persist<EquipmentHistoryDetailState>(
        (set, get) => ({
          loadingKeys: HISTORY_DETAIL_LOADING_KEYS,
          historyDetail: undefined,
          getHistoryDetail: async (detailSeq) => {
            const { setError, setLoading } = useUIStore.getState();
            if (!detailSeq) return;
            setLoading(HISTORY_DETAIL_LOADING_KEYS.INFO, true);
            try {
              const res: Response<EquipmentHistoryDetail> = await api
                .get(`equipment/w/sign/getequipmenthistorydetail`, {
                  searchParams: { detailSeq },
                })
                .json();

              set({ historyDetail: res.data });
            } catch (err) {
              console.error(err);
              const errMessage =
                err instanceof Error
                  ? err.message
                  : "관리이력상세 조회 문제가 발생하였습니다. 잠시후 다시 시도해주세요.";
              setError(HISTORY_DETAIL_LOADING_KEYS.INFO, errMessage);
              toast.error(errMessage);
            } finally {
              setLoading(HISTORY_DETAIL_LOADING_KEYS.INFO, false);
            }
          },
          patchUpdateHistoryDetail: async (values) => {
            try {
              const res: Response<boolean> = await api
                .patch(`equipment/w/sign/updateequipmenthistory`, {
                  json: values,
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
          name: "equipment-history-detail-store",
        }
      )
    )
  );
