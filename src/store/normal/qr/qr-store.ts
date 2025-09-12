import api from "@/lib/api/api-manager";
import { useAuthStore } from "@/store/auth/auth-store";
import { Response } from "@/types/common/response";
import { ListData, ListState } from "@/types/list-type";
import { paramsCheck } from "@/utils/param";
import { toast } from "sonner";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface QrState {
  qrList: ListState<QRListItem>;
  getQrList: (searchParams: URLSearchParams) => Promise<void>;
  allQrList: QRListItem[] | undefined;
  getAllQrList: () => Promise<void>;
  postAddQr: (values: Record<string, any>) => Promise<Response<boolean>>;
  patchUpdateQr: (values: any) => Promise<Response<boolean>>;
}

export const useQrStore = create<QrState>()(
  devtools(
    persist<QrState>(
      (set, get) => ({
        qrList: { type: "loading" },
        allQrList: undefined,
        getQrList: async (searchParams) => {
          const { enteredWorkplace } = useAuthStore.getState();
          if (!enteredWorkplace) return;
          const checkParams = paramsCheck(searchParams);

          try {
            const res: Response<ListData<QRListItem>> = await api
              .get("vocpoint/w/sign/getvocpointlist", {
                searchParams: checkParams,
              })
              .json();

            set({ qrList: { type: "data", payload: res.data } });
          } catch (err) {
            console.log(err);
            set({ qrList: { type: "error", message: "에러 발생" } });
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
