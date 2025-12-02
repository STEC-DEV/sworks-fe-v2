import api from "@/lib/api/api-manager";
import { useUIStore } from "@/store/common/ui-store";
import { Response } from "@/types/common/response";
import { HTTPError } from "ky";
import { notFound } from "next/navigation";
import { toast } from "sonner";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

export const VOC_DETAIL_LOADING_KEYS = {
  INFO: "voc_info",
  REPLY_LIST: "voc_reply_list",
  COMPLAIN: "voc_complain",
} as const;

interface VocDetailState {
  loadingKeys: typeof VOC_DETAIL_LOADING_KEYS;
  vocDetail: VocDetail | null;
  getVocDetail: (vocId: string) => Promise<void>;
  resetVocDetail: () => void;
  putUpdateServiceType: (values: any) => Promise<Response<boolean>>;
  postAddReply: (formData: FormData) => Promise<Response<boolean>>;
  patchUpdateReply: (formData: FormData) => Promise<void>;

  complain: VocDetail | null;
  getComplain: (code: string) => Promise<void>;
}

export const useVocDetailStore = create<VocDetailState>()(
  devtools(
    persist<VocDetailState>(
      (set, get) => ({
        loadingKeys: VOC_DETAIL_LOADING_KEYS,
        vocDetail: null,
        getVocDetail: async (vocId) => {
          if (!vocId) return;
          const { setLoading, setError } = useUIStore.getState();
          const searchParams = new URLSearchParams();
          searchParams.set("logSeq", vocId);
          setLoading(VOC_DETAIL_LOADING_KEYS.INFO, true);
          try {
            const res: Response<VocDetail> = await api
              .get(`voc/w/sign/getvocdetail`, {
                searchParams: searchParams,
              })
              .json();

            set({ vocDetail: res.data });
          } catch (err) {
            const errMessage =
              err instanceof Error
                ? err.message
                : "민원정보 조회 문제가 발생하였습니다. 잠시후 다시 시도해주세요.";

            if (err instanceof HTTPError) {
              if (err.response.status === 404) {
                throw new Error("NOT_FOUND");
              }
            }
            setError(VOC_DETAIL_LOADING_KEYS.INFO, errMessage);
            toast.error(errMessage);
          } finally {
            setLoading(VOC_DETAIL_LOADING_KEYS.INFO, false);
          }
        },
        resetVocDetail: () => {
          set({ vocDetail: undefined });
        },
        putUpdateServiceType: async (values) => {
          try {
            const res: Response<boolean> = await api
              .put(`voc/w/sign/updatevoclogtype`, {
                json: values,
              })
              .json();

            return res;
          } catch (err) {
            const res: Response<boolean> = {
              data: false,
              code: 500,
              message: "에러 발생",
            };

            return res;
          }
        },
        postAddReply: async (formData) => {
          try {
            const res: Response<boolean> = await api
              .post(`voc/w/sign/addreply`, {
                body: formData,
              })
              .json();
            return res;
          } catch (err) {
            const res: Response<boolean> = {
              data: false,
              code: 500,
              message: "등록 에러",
            };
            return res;
          }
        },
        patchUpdateReply: async (formData) => {
          try {
            const res: Response<boolean> = await api
              .patch(`voc/w/sign/updateReply`, {
                body: formData,
              })
              .json();

            toast.success("저장");
          } catch (err) {
            console.error(err);
            toast.error("문제가 발생하였습니다. 잠시후 다시 시도해주세요.");
          }
        },
        complain: null,
        getComplain: async (code) => {
          const { setError, setLoading } = useUIStore.getState();
          setLoading(VOC_DETAIL_LOADING_KEYS.COMPLAIN, true);
          try {
            const res: Response<VocDetail> = await api
              .get("voc/w/getvoccode", {
                searchParams: { vocCode: code },
              })
              .json();

            set({ complain: res.data });
          } catch (err) {
            console.error(err);
            const errMessage =
              err instanceof Error
                ? err.message
                : "민원조회 문제가 발생하였습니다. 잠시후 다시 시도해주세요.";
            setError(VOC_DETAIL_LOADING_KEYS.COMPLAIN, errMessage);
            toast.error(errMessage);
          } finally {
            setLoading(VOC_DETAIL_LOADING_KEYS.COMPLAIN, false);
          }
        },
      }),
      { name: "voc-detail-store" }
    )
  )
);
