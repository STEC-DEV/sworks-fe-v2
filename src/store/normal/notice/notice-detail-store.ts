import api from "@/lib/api/api-manager";
import { useUIStore } from "@/store/common/ui-store";
import { Response } from "@/types/common/response";
import { Notice } from "@/types/normal/notice/detail";
import { toast } from "sonner";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

export const NOTICE_DETAIL_LOADING_KEYS = {
  data: "notice_detail",
} as const;

interface NoticeDetailState {
  loadingKeys: typeof NOTICE_DETAIL_LOADING_KEYS;
  notice: Notice | null;
  getNoticeDetail: (id: string) => Promise<void>;
  patchUpdateNotice: (formData: FormData) => Promise<void>;
  deleteNotice: (id: string) => Promise<void>;
}

export const useNoticeDetailStore = create<NoticeDetailState>()(
  devtools(
    persist<NoticeDetailState>(
      (set, get) => ({
        loadingKeys: NOTICE_DETAIL_LOADING_KEYS,
        notice: null,
        getNoticeDetail: async (id) => {
          const { setError, setLoading } = useUIStore.getState();
          setLoading(NOTICE_DETAIL_LOADING_KEYS.data, true);
          try {
            const res: Response<Notice> = await api
              .get(`notice/w/sign/getdetailnotice`, {
                searchParams: { noticeSeq: id },
              })
              .json();
            set({ notice: res.data });
          } catch (err) {
            console.error(err);
            const errMessage =
              err instanceof Error
                ? err.message
                : "공지사항 조회 문제가 발생하였습니다. 잠시후 다시 시도해주세요.";
            setError(NOTICE_DETAIL_LOADING_KEYS.data, errMessage);
            toast.error(errMessage);
          } finally {
            setLoading(NOTICE_DETAIL_LOADING_KEYS.data, false);
          }
        },
        patchUpdateNotice: async (data) => {
          try {
            const res: Response<boolean> = await api
              .patch(`notice/w/sign/updatenotice`, {
                body: data,
              })
              .json();

            toast.success("저장");
          } catch (err) {
            console.error(err);
            const errMessage =
              err instanceof Error
                ? err.message
                : "공지사항 수정 문제가 발생하였습니다. 잠시후 다시 시도해주세요.";
            toast.error(errMessage);
          }
        },
        deleteNotice: async (id) => {
          try {
            const res: Response<boolean> = await api
              .delete(`notice/w/sign/delnotice`, {
                searchParams: { delSeq: id },
              })
              .json();

            toast.success("삭제");
          } catch (err) {
            console.error(err);
            const errMessage =
              err instanceof Error
                ? err.message
                : "삭제중 오류가 발생하였습니다. 잠시후 다시 시도해주세요.";
            toast.error(errMessage);
          }
        },
      }),
      { name: "notice-detail-store" }
    )
  )
);
