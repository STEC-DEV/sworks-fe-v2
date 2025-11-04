import api from "@/lib/api/api-manager";
import { Response } from "@/types/common/response";
import { toast } from "sonner";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface VocDetailState {
  vocDetail: VocDetail | undefined;
  getVocDetail: (vocId: string) => Promise<void>;
  resetVocDetail: () => void;
  putUpdateServiceType: (values: any) => Promise<Response<boolean>>;
  postAddReply: (formData: FormData) => Promise<Response<boolean>>;
  patchUpdateReply: (formData: FormData) => Promise<void>;
}

export const useVocDetailStore = create<VocDetailState>()(
  devtools(
    persist<VocDetailState>(
      (set, get) => ({
        vocDetail: undefined,
        getVocDetail: async (vocId) => {
          if (!vocId) return;
          const searchParams = new URLSearchParams();
          searchParams.set("logSeq", vocId);
          try {
            const res: Response<VocDetail> = await api
              .get(`voc/w/sign/getvocdetail`, {
                searchParams: searchParams,
              })
              .json();

            set({ vocDetail: res.data });
          } catch (err) {
            console.log(err);
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
      }),
      { name: "voc-detail-store" }
    )
  )
);
