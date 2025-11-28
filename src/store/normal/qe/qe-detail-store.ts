import api from "@/lib/api/api-manager";
import { useUIStore } from "@/store/common/ui-store";
import { Response } from "@/types/common/response";
import { QeChecklist, QeViewChecklist } from "@/types/normal/qe/checklist";
import { toast } from "sonner";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

export const QE_DETAIL_LOADING_KEYS = {
  DETAIL: "qe_detail",
} as const;

interface QeDetailState {
  loadingKeys: typeof QE_DETAIL_LOADING_KEYS;
  qeDetail: QeViewChecklist | null;
  getQeDetail: (id: string) => Promise<void>;
  putUpdateLog: (data: Record<string, any>) => Promise<void>;
}

export const useQeDetailStore = create<QeDetailState>()(
  devtools(
    persist<QeDetailState>(
      (set, get) => ({
        loadingKeys: QE_DETAIL_LOADING_KEYS,
        qeDetail: null,
        getQeDetail: async (id) => {
          const { setError, setLoading } = useUIStore.getState();
          setLoading(QE_DETAIL_LOADING_KEYS.DETAIL, true);
          try {
            const res: Response<QeViewChecklist> = await api
              .get(`qe/w/sign/getqelogviewdetail`, {
                searchParams: { logSeq: id },
              })
              .json();

            set({ qeDetail: res.data });
          } catch (err) {
            console.error(err);
            const errMessage =
              err instanceof Error
                ? err.message
                : "평가항목 조회 문제가 발생하였습니다. 잠시후 다시 시도해주세요.";
            setError(QE_DETAIL_LOADING_KEYS.DETAIL, errMessage);
            toast.error(errMessage);
          } finally {
            setLoading(QE_DETAIL_LOADING_KEYS.DETAIL, false);
          }
        },
        putUpdateLog: async (data) => {
          try {
            const res: Response<boolean> = await api
              .put(`qe/w/sign/updateqelog`, { json: data })
              .json();
            toast.success("저장");
          } catch (err) {
            console.error(err);
            const errMessage =
              err instanceof Error
                ? err.message
                : "점검내용 수정 문제가 발생하였습니다. 잠시후 다시 시도해주세요.";
            toast.error(errMessage);
          }
        },
        //  getQeDetail: async (id) => {
        //   const { setError, setLoading } = useUIStore.getState();
        //   setLoading(QE_DETAIL_LOADING_KEYS.DETAIL, true);
        //   try {
        //     const res: Response<QeChecklist> = await api
        //       .get(`qe/w/sign/getqelog`, {
        //         searchParams: { logSeq: id },
        //       })
        //       .json();

        //     set({ qeDetail: res.data });
        //   } catch (err) {
        //     console.error(err);
        //     const errMessage =
        //       err instanceof Error
        //         ? err.message
        //         : "평가항목 조회 문제가 발생하였습니다. 잠시후 다시 시도해주세요.";
        //     setError(QE_DETAIL_LOADING_KEYS.DETAIL, errMessage);
        //     toast.error(errMessage);
        //   } finally {
        //     setLoading(QE_DETAIL_LOADING_KEYS.DETAIL, false);
        //   }
        // },
      }),
      { name: "qe-detail-store" }
    )
  )
);
