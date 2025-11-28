import api from "@/lib/api/api-manager";
import { useUIStore } from "@/store/common/ui-store";
import { Response } from "@/types/common/response";
import { ListData } from "@/types/list-type";
import { NoticeListItem } from "@/types/normal/notice/notice";
import { paramsCheck } from "@/utils/param";
import { toast } from "sonner";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

export const NOTICE_LOADING_KEYS = {
  LIST: "notice_list",
} as const;

interface NoticeState {
  loadingKeys: typeof NOTICE_LOADING_KEYS;
  noticeList: ListData<NoticeListItem> | null;
  getNotice: (searchParams: URLSearchParams) => Promise<void>;
  getClassification: () => Promise<UserServiceType[] | null>;
  postAddNotice: (data: FormData) => Promise<void>;
}

export const useNoticeStore = create<NoticeState>()(
  devtools(
    persist<NoticeState>(
      (set, get) => ({
        loadingKeys: NOTICE_LOADING_KEYS,
        noticeList: null,
        getNotice: async (searchParams) => {
          const checkParams = paramsCheck(searchParams);
          const { setError, setLoading } = useUIStore.getState();
          setLoading(NOTICE_LOADING_KEYS.LIST, true);

          try {
            const res: Response<ListData<NoticeListItem>> = await api
              .get(`notice/w/sign/getsitenoticelist`, {
                searchParams: checkParams,
              })
              .json();
            console.log(res.data);
            set({ noticeList: res.data });
          } catch (err) {
            console.error(err);
            const errMessage =
              err instanceof Error
                ? err.message
                : "공지사항 조회 문제가 발생하였습니다. 잠시후 다시 시도해주세요.";
            setError(NOTICE_LOADING_KEYS.LIST, errMessage);
            toast.error(errMessage);
          } finally {
            setLoading(NOTICE_LOADING_KEYS.LIST, false);
          }
        },
        getClassification: async () => {
          try {
            const res: Response<UserServiceType[]> = await api
              .get(`notice/w/sign/upsertclassification`)
              .json();

            return res.data;
          } catch (err) {
            console.log(err);
            const errMessage =
              err instanceof Error
                ? err.message
                : "기초코드 조회 문제가 발생하였습니다. 잠시후 다시 시도해주세요.";
            toast.error(errMessage);
            return null;
          }
        },
        postAddNotice: async (data: FormData) => {
          try {
            const res: Response<boolean> = await api
              .post("notice/w/sign/addnotice", {
                body: data,
              })
              .json();
          } catch (err) {
            console.error(err);
            const errMessage =
              err instanceof Error
                ? err.message
                : "공지사항 등록에 문제가 발생하였습니다. 잠시후 다시 시도해주세요.";
            toast.error(errMessage);
          }
        },
      }),
      { name: "notice-store" }
    )
  )
);
