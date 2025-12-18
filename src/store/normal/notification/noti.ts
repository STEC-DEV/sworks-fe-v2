//0 - voc , 1 - 공지사항, 2 - 업무요청, 3 - 스케줄

import api from "@/lib/api/api-manager";
import { useAuthStore } from "@/store/auth/auth-store";
import { useUIStore } from "@/store/common/ui-store";
import { Response } from "@/types/common/response";
import {
  Notification,
  NotiResponse,
} from "@/types/normal/notification/notification";
import { toast } from "sonner";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

export const NOTIFICATION_LOADING_KEYS = {
  LIST: "notification_list",
} as const;

interface NotificationState {
  loadingKeys: typeof NOTIFICATION_LOADING_KEYS;
  notificationList: Notification[] | null;
  hasMore: boolean;
  lastCursor: number | null;
  getNotification: (lastNoticeSeq?: number) => Promise<void>;
  putReadNotification: (id: string) => Promise<void>;
}

export const useNotificationStore = create<NotificationState>()(
  devtools(
    persist<NotificationState>(
      (set, get) => ({
        loadingKeys: NOTIFICATION_LOADING_KEYS,
        notificationList: null,
        hasMore: false,
        lastCursor: null,
        getNotification: async (lastNoticeSeq) => {
          const { setLoading, setError } = useUIStore.getState();
          setLoading(NOTIFICATION_LOADING_KEYS.LIST, true);
          try {
            const res: Response<NotiResponse> = await api
              .get(`unread/w/sign/getnotificationlist`, {
                searchParams: { lastNoticeSeq },
              })
              .json();

            set((state) => ({
              // lastNoticeSeq가 있으면 기존 리스트에 추가, 없으면 새로 설정
              notificationList: lastNoticeSeq
                ? [...(state.notificationList || []), ...res.data.items]
                : res.data.items,
              hasMore: res.data.hasMore,
              lastCursor: res.data.lastCursor,
            }));
          } catch (err) {
            console.error(err);
            const errMessage =
              err instanceof Error
                ? err.message
                : "알람 조회 문제가 발생하였습니다. 잠시후 다시 시도해주세요.";
            toast.error(errMessage);
            setError(NOTIFICATION_LOADING_KEYS.LIST, errMessage);
          } finally {
            setLoading(NOTIFICATION_LOADING_KEYS.LIST, false);
          }
        },
        putReadNotification: async (id) => {
          const { enteredWorkplace } = useAuthStore.getState();
          if (!enteredWorkplace) return;

          try {
            const res: Response<boolean> = await api
              .put(`unread/w/sign/setnotification`, {
                json: {
                  readSignSeq: id,
                  siteSeq: enteredWorkplace.siteSeq,
                },
              })
              .json();
          } catch (err) {
            console.error(err);
            const errMessage =
              err instanceof Error
                ? err.message
                : "읽음처리 문제가 발생하였습니다. 잠시후 다시 시도해주세요.";
            toast.error(errMessage);
          }
        },
      }),
      { name: "notification-store" }
    )
  )
);
