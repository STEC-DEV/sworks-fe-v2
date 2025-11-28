import api from "@/lib/api/api-manager";
import { useAuthStore } from "@/store/auth/auth-store";
import { useUIStore } from "@/store/common/ui-store";
import { Response } from "@/types/common/response";
import { ListData, ListState } from "@/types/list-type";
import { paramsCheck } from "@/utils/param";
import { toast } from "sonner";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

export const QR_LOADING_KEYS = {
  LIST: "qr_list",
} as const;

interface QrState {
  loadingKeys: typeof QR_LOADING_KEYS;
  qrList: ListData<QRListItem> | null;
  getQrList: (searchParams: URLSearchParams) => Promise<void>;
  allQrList: QRListItem[] | undefined;
  getAllQrList: () => Promise<void>;
  postAddQr: (values: Record<string, any>) => Promise<Response<boolean>>;
  deleteQr: (seq: string) => Promise<void>;
  patchUpdateQr: (values: any) => Promise<Response<boolean>>;
}

export const useQrStore = create<QrState>()(
  devtools(
    persist<QrState>(
      (set, get) => ({
        loadingKeys: QR_LOADING_KEYS,
        qrList: null,
        allQrList: undefined,
        getQrList: async (searchParams) => {
          const { enteredWorkplace } = useAuthStore.getState();
          if (!enteredWorkplace) return;
          const checkParams = paramsCheck(searchParams);
          const { setLoading, setError } = useUIStore.getState();
          setLoading(QR_LOADING_KEYS.LIST, true);
          try {
            const res: Response<ListData<QRListItem>> = await api
              .get("vocpoint/w/sign/getvocpointlist", {
                searchParams: checkParams,
              })
              .json();

            set({ qrList: res.data });
          } catch (err) {
            console.error(err);
            const errMessage =
              err instanceof Error
                ? err.message
                : "위치QR 조회 문제가 발생하였습니다. 잠시후 다시 시도해주세요.";
            setError(QR_LOADING_KEYS.LIST, errMessage);
            toast.error(errMessage);
          } finally {
            setLoading(QR_LOADING_KEYS.LIST, false);
          }
        },
        getAllQrList: async () => {
          try {
            const res: Response<QRListItem[]> = await api
              .get(`vocpoint/w/sign/getvocallpointlist`)
              .json();
            set({ allQrList: res.data });
          } catch (err) {
            console.log(err);
            toast.error("위치 조회 실패");
          }
        },
        postAddQr: async (values: any) => {
          try {
            const res: Response<boolean> = await api
              .post(`vocpoint/w/sign/addvocpoint`, {
                json: values,
              })
              .json();

            toast.success("생성완료");
            return res;
          } catch (err) {
            const response: Response<boolean> = {
              code: 500,
              data: false,
              message: "에러 발생",
            };
            toast.error("에러 발생");
            return response;
          }
        },
        deleteQr: async (seq) => {
          try {
            const res: Response<boolean> = await api
              .delete(`vocpoint/w/sign/delvocpoint`, {
                searchParams: { delSeq: seq },
              })
              .json();

            toast.success("삭제");
          } catch (err) {
            console.error(err);
            toast.error("문제가 발생하였습니다. 잠시후 다시 시도해주세요.");
          }
        },
        patchUpdateQr: async (values) => {
          try {
            const res: Response<boolean> = await api
              .patch(`vocpoint/w/sign/updatevocpoint`, {
                json: values,
              })
              .json();
            toast.success("저장");
            return res;
          } catch (err) {
            const res: Response<boolean> = {
              data: false,
              code: 500,
              message: "에러 발생",
            };
            toast.error("에러 발생");
            return res;
          }
        },
      }),
      { name: "qr-store" }
    )
  )
);
